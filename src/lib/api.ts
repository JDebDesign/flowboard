import { supabase } from './supabaseClient';
import { DEFAULT_COLUMN_NAMES } from '../types';
import type { Board, Card, Column, DataState, Priority } from '../types';

interface CardRow {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  assignee: string | null;
  priority: Priority;
  due_date: string | null;
  position: number;
}

interface ColumnRow {
  id: string;
  board_id: string;
  name: string;
  position: number;
}

interface BoardRow {
  id: string;
  name: string;
  created_at: string;
}

function rowToCard(row: CardRow): Card {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    assignee: row.assignee ?? '',
    priority: row.priority,
    dueDate: row.due_date ?? '',
  };
}

export async function fetchAllData(userId: string): Promise<DataState> {
  const { data: boardRows, error: boardsError } = await supabase
    .from('boards')
    .select('id, name, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (boardsError) throw boardsError;

  const boards = (boardRows ?? []) as BoardRow[];
  const boardIds = boards.map((b) => b.id);

  let columnRows: ColumnRow[] = [];
  let cardRows: CardRow[] = [];

  if (boardIds.length > 0) {
    const { data: cols, error: colsError } = await supabase
      .from('columns')
      .select('id, board_id, name, position')
      .in('board_id', boardIds)
      .order('position', { ascending: true });
    if (colsError) throw colsError;
    columnRows = (cols ?? []) as ColumnRow[];

    const columnIds = columnRows.map((c) => c.id);
    if (columnIds.length > 0) {
      const { data: cardData, error: cardsError } = await supabase
        .from('cards')
        .select('id, column_id, title, description, assignee, priority, due_date, position')
        .in('column_id', columnIds)
        .order('position', { ascending: true });
      if (cardsError) throw cardsError;
      cardRows = (cardData ?? []) as CardRow[];
    }
  }

  const cards: Record<string, Card> = {};
  for (const row of cardRows) {
    cards[row.id] = rowToCard(row);
  }

  const columnsByBoard = new Map<string, Column[]>();
  for (const col of columnRows) {
    const cardIds = cardRows.filter((row) => row.column_id === col.id).map((row) => row.id);
    const existing = columnsByBoard.get(col.board_id) ?? [];
    existing.push({ id: col.id, name: col.name, cardIds });
    columnsByBoard.set(col.board_id, existing);
  }

  return {
    boards: boards.map((b) => ({
      id: b.id,
      name: b.name,
      createdAt: b.created_at,
      columns: columnsByBoard.get(b.id) ?? [],
    })),
    cards,
  };
}

export async function createBoard(userId: string, name: string): Promise<Board> {
  const { data: boardRow, error } = await supabase
    .from('boards')
    .insert({ user_id: userId, name })
    .select('id, name, created_at')
    .single();
  if (error) throw error;

  const columnsToInsert = DEFAULT_COLUMN_NAMES.map((columnName, position) => ({
    board_id: boardRow.id,
    name: columnName,
    position,
  }));
  const { data: columnRows, error: columnsError } = await supabase
    .from('columns')
    .insert(columnsToInsert)
    .select('id, name, position');
  if (columnsError) throw columnsError;

  const columns: Column[] = ((columnRows ?? []) as ColumnRow[])
    .sort((a, b) => a.position - b.position)
    .map((c) => ({ id: c.id, name: c.name, cardIds: [] }));

  return { id: boardRow.id, name: boardRow.name, createdAt: boardRow.created_at, columns };
}

export async function addCard(columnId: string, position: number, input: Omit<Card, 'id'>): Promise<Card> {
  const { data, error } = await supabase
    .from('cards')
    .insert({
      column_id: columnId,
      title: input.title,
      description: input.description || null,
      assignee: input.assignee || null,
      priority: input.priority,
      due_date: input.dueDate || null,
      position,
    })
    .select('id, column_id, title, description, assignee, priority, due_date, position')
    .single();
  if (error) throw error;
  return rowToCard(data as CardRow);
}

export async function updateCard(card: Card): Promise<void> {
  const { error } = await supabase
    .from('cards')
    .update({
      title: card.title,
      description: card.description || null,
      assignee: card.assignee || null,
      priority: card.priority,
      due_date: card.dueDate || null,
    })
    .eq('id', card.id);
  if (error) throw error;
}

export async function deleteCard(cardId: string): Promise<void> {
  const { error } = await supabase.from('cards').delete().eq('id', cardId);
  if (error) throw error;
}

export async function reorderCards(changes: { columnId: string; cardIds: string[] }[]): Promise<void> {
  const updates = changes.flatMap(({ columnId, cardIds }) =>
    cardIds.map((cardId, position) => ({ id: cardId, column_id: columnId, position })),
  );
  const results = await Promise.all(
    updates.map((u) => supabase.from('cards').update({ column_id: u.column_id, position: u.position }).eq('id', u.id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}

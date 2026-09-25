export type Priority = 'High' | 'Medium' | 'Low';

export interface Card {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  priority: Priority;
  dueDate: string;
}

export interface Column {
  id: string;
  name: string;
  cardIds: string[];
}

export interface Board {
  id: string;
  name: string;
  createdAt: string;
  columns: Column[];
}

export interface DataState {
  boards: Board[];
  cards: Record<string, Card>;
}

export const DEFAULT_COLUMN_NAMES = ['Backlog', 'In Progress', 'In Review', 'Done'];

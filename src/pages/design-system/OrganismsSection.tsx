import { useState } from 'react';
import { Column } from '../../components/Column';
import type { DragPayload } from '../../components/Column';
import { CardModal } from '../../components/CardModal';
import type { CardFormValues } from '../../components/CardModal';
import type { Card as CardType, Column as ColumnType } from '../../types';
import styles from './section.module.css';

interface DemoState {
  columns: ColumnType[];
  cards: Record<string, CardType>;
}

function makeInitialState(): DemoState {
  const cards: CardType[] = [
    { id: 'org-1', title: 'Draft the announcement', assignee: 'Jamie', priority: 'High', dueDate: '2026-11-01' },
    { id: 'org-2', title: 'QA the new flow', assignee: 'Morgan', priority: 'Medium', dueDate: '2026-11-04' },
    { id: 'org-3', title: 'Ship it', assignee: 'Alex', priority: 'Low', dueDate: '' },
  ];
  const columns: ColumnType[] = [
    { id: 'org-col-todo', name: 'To Do', cardIds: ['org-1', 'org-2'] },
    { id: 'org-col-progress', name: 'In Progress', cardIds: ['org-3'] },
    { id: 'org-col-done', name: 'Done', cardIds: [] },
  ];
  const cardMap = Object.fromEntries(cards.map((c) => [c.id, c]));
  return { columns, cards: cardMap };
}

export function OrganismsSection() {
  const [{ columns, cards }, setState] = useState<DemoState>(makeInitialState);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [creatingColumnId, setCreatingColumnId] = useState<string | null>(null);

  const handleDropCard = (payload: DragPayload, toColumnId: string, toIndex: number) => {
    setDraggingCardId(null);
    setState((prev) => {
      const nextColumns = prev.columns.map((c) => ({
        ...c,
        cardIds: c.cardIds.filter((id) => id !== payload.cardId),
      }));
      const targetIndex = nextColumns.findIndex((c) => c.id === toColumnId);
      if (targetIndex === -1) return prev;
      const cardIds = [...nextColumns[targetIndex].cardIds];
      const clampedIndex = Math.max(0, Math.min(toIndex, cardIds.length));
      cardIds.splice(clampedIndex, 0, payload.cardId);
      nextColumns[targetIndex] = { ...nextColumns[targetIndex], cardIds };
      return { ...prev, columns: nextColumns };
    });
  };

  const handleSaveCard = (values: CardFormValues) => {
    if (editingCardId) {
      setState((prev) => ({
        ...prev,
        cards: { ...prev.cards, [editingCardId]: { ...prev.cards[editingCardId], ...values } },
      }));
      setEditingCardId(null);
      return;
    }
    if (creatingColumnId) {
      const id = `org-new-${Date.now()}`;
      setState((prev) => ({
        columns: prev.columns.map((c) =>
          c.id === creatingColumnId ? { ...c, cardIds: [...c.cardIds, id] } : c,
        ),
        cards: { ...prev.cards, [id]: { id, ...values } },
      }));
      setCreatingColumnId(null);
    }
  };

  const handleDeleteCard = () => {
    if (!editingCardId) return;
    setState((prev) => {
      const nextColumns = prev.columns.map((c) => ({
        ...c,
        cardIds: c.cardIds.filter((id) => id !== editingCardId),
      }));
      const nextCards = { ...prev.cards };
      delete nextCards[editingCardId];
      return { columns: nextColumns, cards: nextCards };
    });
    setEditingCardId(null);
  };

  const editingCard = editingCardId ? cards[editingCardId] : undefined;

  return (
    <section id="organisms" className={styles.section}>
      <h2 className={styles.sectionTitle}>Organisms</h2>
      <p className={styles.sectionDescription}>
        A fully working mini board — drag a card between columns, click one to edit or delete it, or add a new one.
        This uses the same <code>Column</code>, <code>Card</code>, and <code>CardModal</code> components as the real
        app, just with local demo data instead of Supabase.
      </p>
      <div className={styles.columnRow}>
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            cards={column.cardIds.map((id) => cards[id]).filter((c): c is CardType => Boolean(c))}
            draggingCardId={draggingCardId}
            onAddCard={() => setCreatingColumnId(column.id)}
            onCardClick={(cardId) => setEditingCardId(cardId)}
            onDropCard={handleDropCard}
            onDragStartCard={(payload) => setDraggingCardId(payload.cardId)}
            onDragEndCard={() => setDraggingCardId(null)}
          />
        ))}
      </div>

      {editingCard && (
        <CardModal
          initialValues={editingCard}
          onClose={() => setEditingCardId(null)}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
        />
      )}
      {creatingColumnId && <CardModal onClose={() => setCreatingColumnId(null)} onSave={handleSaveCard} />}

      <p className={styles.sectionDescription} style={{ marginTop: 24 }}>
        <strong>Navbar</strong> isn't duplicated here — this page's own header above uses the same logo and type
        style. See <code>src/components/Navbar.tsx</code> for the authenticated version with the sign-out button.
      </p>
    </section>
  );
}

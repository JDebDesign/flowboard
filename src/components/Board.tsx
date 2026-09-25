import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/useData';
import { Column } from './Column';
import type { DragPayload } from './Column';
import { CardModal } from './CardModal';
import type { CardFormValues } from './CardModal';
import styles from './Board.module.css';

type ModalState = { mode: 'create'; columnId: string } | { mode: 'edit'; cardId: string } | null;

export function Board({ boardId }: { boardId: string }) {
  const { getBoard, state, addCard, updateCard, deleteCard, moveCard } = useData();
  const board = getBoard(boardId);
  const [modal, setModal] = useState<ModalState>(null);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  if (!board) {
    return (
      <main className={styles.main}>
        <p>Board not found.</p>
        <Link to="/boards" className={styles.breadcrumb}>
          Back to boards
        </Link>
      </main>
    );
  }

  const handleDropCard = async (payload: DragPayload, toColumnId: string, toIndex: number) => {
    setDraggingCardId(null);
    try {
      await moveCard(board.id, payload.cardId, toColumnId, toIndex);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Could not move the card.');
    }
  };

  const handleSave = async (values: CardFormValues) => {
    try {
      if (modal?.mode === 'create') {
        await addCard(board.id, modal.columnId, values);
      } else if (modal?.mode === 'edit') {
        const existing = state.cards[modal.cardId];
        if (existing) {
          await updateCard({ ...existing, ...values });
        }
      }
      setModal(null);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Could not save the card.');
    }
  };

  const handleDelete = async () => {
    try {
      if (modal?.mode === 'edit') {
        await deleteCard(board.id, modal.cardId);
      }
      setModal(null);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Could not delete the card.');
    }
  };

  const editingCard = modal?.mode === 'edit' ? state.cards[modal.cardId] : undefined;

  return (
    <main className={styles.main}>
      <div className={styles.headerRow}>
        <Link to="/boards" className={styles.breadcrumb}>
          Boards
        </Link>
        <span className={styles.separator}>/</span>
        <h1 className={styles.boardName}>{board.name}</h1>
        <span className={styles.columnCount}>{board.columns.length} columns</span>
      </div>

      {mutationError && (
        <p className={styles.error} role="alert">
          {mutationError}
        </p>
      )}

      <div className={styles.columns}>
        {board.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            cards={column.cardIds.map((id) => state.cards[id]).filter((card): card is NonNullable<typeof card> => Boolean(card))}
            draggingCardId={draggingCardId}
            onAddCard={() => setModal({ mode: 'create', columnId: column.id })}
            onCardClick={(cardId) => setModal({ mode: 'edit', cardId })}
            onDropCard={handleDropCard}
            onDragStartCard={(payload) => setDraggingCardId(payload.cardId)}
            onDragEndCard={() => setDraggingCardId(null)}
          />
        ))}
      </div>

      {modal?.mode === 'create' && (
        <CardModal onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {modal?.mode === 'edit' && editingCard && (
        <CardModal
          initialValues={editingCard}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}

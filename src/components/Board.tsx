import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/useData';
import { Column } from './Column';
import type { DragPayload } from './Column';
import { CardModal } from './CardModal';
import type { CardFormValues } from './CardModal';
import { Button } from './Button';
import { ConfirmAction } from './ConfirmAction';
import fields from './formFields.module.css';
import styles from './Board.module.css';

type ModalState = { mode: 'create'; columnId: string } | { mode: 'edit'; cardId: string } | null;

export function Board({ boardId }: { boardId: string }) {
  const { getBoard, state, addCard, updateCard, deleteCard, moveCard, renameBoard, deleteBoard } = useData();
  const navigate = useNavigate();
  const board = getBoard(boardId);
  const [modal, setModal] = useState<ModalState>(null);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

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
          const currentColumn = board.columns.find((c) => c.cardIds.includes(modal.cardId));
          if (values.columnId && currentColumn && values.columnId !== currentColumn.id) {
            const targetColumn = board.columns.find((c) => c.id === values.columnId);
            await moveCard(board.id, modal.cardId, values.columnId, targetColumn?.cardIds.length ?? 0);
          }
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

  const startRenaming = () => {
    setRenameValue(board.name);
    setIsRenaming(true);
  };

  const handleRenameSave = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === board.name) {
      setIsRenaming(false);
      return;
    }
    try {
      await renameBoard(board.id, trimmed);
      setIsRenaming(false);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Could not rename the board.');
    }
  };

  const handleDeleteBoard = async () => {
    try {
      await deleteBoard(board.id);
      navigate('/boards');
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Could not delete the board.');
    }
  };

  const editingCard = modal?.mode === 'edit' ? state.cards[modal.cardId] : undefined;
  const editingCardColumn = modal?.mode === 'edit' ? board.columns.find((c) => c.cardIds.includes(modal.cardId)) : undefined;

  return (
    <main className={styles.main}>
      <div className={styles.headerRow}>
        <Link to="/boards" className={styles.breadcrumb}>
          Boards
        </Link>
        <span className={styles.separator}>/</span>
        {isRenaming ? (
          <form
            className={styles.renameForm}
            onSubmit={(e) => {
              e.preventDefault();
              handleRenameSave();
            }}
          >
            <input
              className={`${fields.input} ${styles.renameInput}`}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsRenaming(false);
              }}
              autoFocus
              required
            />
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsRenaming(false)}>
              Cancel
            </Button>
          </form>
        ) : (
          <>
            <h1 className={styles.boardName}>{board.name}</h1>
            <Button type="button" variant="ghost-muted" onClick={startRenaming}>
              Rename
            </Button>
          </>
        )}
        <span className={styles.columnCount}>{board.columns.length} columns</span>
        <div className={styles.headerActions}>
          <ConfirmAction
            label="Delete board"
            message="Delete this board and all its cards?"
            onConfirm={handleDeleteBoard}
          />
        </div>
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

      {modal?.mode === 'create' && <CardModal onClose={() => setModal(null)} onSave={handleSave} />}
      {modal?.mode === 'edit' && editingCard && (
        <CardModal
          initialValues={editingCard}
          columns={board.columns.map((c) => ({ id: c.id, name: c.name }))}
          currentColumnId={editingCardColumn?.id}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}

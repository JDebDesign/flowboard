import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/useData';
import { Navbar } from '../components/Navbar';
import { BoardCard } from '../components/BoardCard';
import { CreateBoardModal } from '../components/CreateBoardModal';
import { PlusIcon } from '../components/icons';
import styles from './BoardsPage.module.css';

export function BoardsPage() {
  const { state, loading, error, createBoard } = useData();
  const [isModalOpen, setModalOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreate = async (name: string) => {
    try {
      const board = await createBoard(name);
      setModalOpen(false);
      navigate(`/boards/${board.id}`);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Could not create the board.');
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.headerRow}>
          <h1 className={styles.heading}>My Boards</h1>
          <button type="button" className={styles.newBoardButton} onClick={() => setModalOpen(true)}>
            <PlusIcon size={18} color="white" />
            New Board
          </button>
        </div>

        {error && <p className={styles.empty}>Couldn't load your boards: {error}</p>}

        {!error && loading && <p className={styles.empty}>Loading boards…</p>}

        {!error && !loading && state.boards.length === 0 && (
          <p className={styles.empty}>No boards yet — create your first one to get started.</p>
        )}

        {!error && !loading && state.boards.length > 0 && (
          <div className={styles.grid}>
            {state.boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <CreateBoardModal
          onClose={() => {
            setModalOpen(false);
            setCreateError(null);
          }}
          onCreate={handleCreate}
          error={createError}
        />
      )}
    </>
  );
}

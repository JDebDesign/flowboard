import { Link } from 'react-router-dom';
import type { Board } from '../types';
import styles from './BoardCard.module.css';

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export function BoardCard({ board }: { board: Board }) {
  return (
    <Link to={`/boards/${board.id}`} className={styles.card}>
      <p className={styles.title}>{board.name}</p>
      <p className={styles.date}>{dateFormatter.format(new Date(board.createdAt))}</p>
    </Link>
  );
}

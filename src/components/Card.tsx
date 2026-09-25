import type { DragEvent } from 'react';
import type { Card as CardType } from '../types';
import styles from './Card.module.css';

const priorityClass: Record<CardType['priority'], string> = {
  High: styles.priorityHigh,
  Medium: styles.priorityMedium,
  Low: styles.priorityLow,
};

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

function formatDueDate(dueDate: string): string {
  if (!dueDate) return '';
  const parsed = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dueDate;
  return dateFormatter.format(parsed);
}

interface CardProps {
  card: CardType;
  onClick: () => void;
  onDragStart: (event: DragEvent<HTMLButtonElement>) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export function Card({ card, onClick, onDragStart, onDragEnd, isDragging }: CardProps) {
  return (
    <button
      type="button"
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      <span className={styles.title}>{card.title}</span>
      <div className={styles.metaRow}>
        <span className={`${styles.priority} ${priorityClass[card.priority]}`}>{card.priority}</span>
        {card.dueDate && <span className={styles.dueDate}>{formatDueDate(card.dueDate)}</span>}
      </div>
      {card.assignee && (
        <div className={styles.assignee}>
          <span className={styles.assigneeAvatar}>{card.assignee.trim().charAt(0).toUpperCase() || '?'}</span>
          <span>{card.assignee}</span>
        </div>
      )}
    </button>
  );
}

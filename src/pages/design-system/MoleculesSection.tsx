import { useState } from 'react';
import { Column } from '../../components/Column';
import { CreateBoardModal } from '../../components/CreateBoardModal';
import { Button } from '../../components/Button';
import type { Card as CardType, Column as ColumnType } from '../../types';
import styles from './section.module.css';

const SAMPLE_CARDS: CardType[] = [
  { id: 'mol-card-1', title: 'Design the empty state', assignee: 'Priya', priority: 'Medium', dueDate: '2026-11-05' },
  { id: 'mol-card-2', title: 'Write onboarding copy', assignee: 'Sam', priority: 'Low', dueDate: '' },
];

const FILLED_COLUMN: ColumnType = { id: 'mol-filled', name: 'In Progress', cardIds: SAMPLE_CARDS.map((c) => c.id) };
const EMPTY_COLUMN: ColumnType = { id: 'mol-empty', name: 'Done', cardIds: [] };

export function MoleculesSection() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <section id="molecules" className={styles.section}>
      <h2 className={styles.sectionTitle}>Molecules</h2>
      <p className={styles.sectionDescription}>Small groups of atoms that work together as one unit.</p>

      <h3 className={styles.subheading}>Column</h3>
      <p className={styles.sectionDescription}>A column with cards, and an empty column showing its drop zone.</p>
      <div className={styles.columnRow}>
        <Column
          column={FILLED_COLUMN}
          cards={SAMPLE_CARDS}
          draggingCardId={null}
          onAddCard={() => {}}
          onCardClick={() => {}}
          onDropCard={() => {}}
          onDragStartCard={() => {}}
          onDragEndCard={() => {}}
        />
        <Column
          column={EMPTY_COLUMN}
          cards={[]}
          draggingCardId={null}
          onAddCard={() => {}}
          onCardClick={() => {}}
          onDropCard={() => {}}
          onDragStartCard={() => {}}
          onDragEndCard={() => {}}
        />
      </div>

      <h3 className={styles.subheading}>Create Board modal</h3>
      <Button variant="secondary" onClick={() => setCreateOpen(true)}>
        Open "Create board"
      </Button>
      {createOpen && <CreateBoardModal onClose={() => setCreateOpen(false)} onCreate={() => setCreateOpen(false)} />}
    </section>
  );
}

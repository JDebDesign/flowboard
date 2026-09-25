import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { Card } from '../../components/Card';
import { BoardCard } from '../../components/BoardCard';
import { Button } from '../../components/Button';
import type { Card as CardType, Board } from '../../types';
import styles from './section.module.css';

const SAMPLE_CARDS: CardType[] = [
  { id: 'atom-high', title: 'Ship the design system', assignee: 'Jamie Rivera', priority: 'High', dueDate: '2026-11-01' },
  { id: 'atom-medium', title: 'Review kanban copy', assignee: 'Morgan', priority: 'Medium', dueDate: '2026-11-08' },
  { id: 'atom-low', title: 'Tidy up icon exports', assignee: 'Alex', priority: 'Low', dueDate: '' },
];

const SAMPLE_BOARD: Board = {
  id: 'demo-board',
  name: 'Sample Board',
  createdAt: new Date().toISOString(),
  columns: [],
};

export function AtomsSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="atoms" className={styles.section}>
      <h2 className={styles.sectionTitle}>Atoms</h2>
      <p className={styles.sectionDescription}>The smallest reusable building blocks.</p>

      <h3 className={styles.subheading}>Kanban card — all three priorities</h3>
      <div className={styles.cardRow}>
        {SAMPLE_CARDS.map((card) => (
          <div key={card.id} className={styles.cardDemoWrap}>
            <Card card={card} isDragging={false} onClick={() => {}} onDragStart={() => {}} onDragEnd={() => {}} />
          </div>
        ))}
      </div>

      <h3 className={styles.subheading}>Board tile</h3>
      <div className={styles.cardDemoWrap}>
        <BoardCard board={SAMPLE_BOARD} />
      </div>

      <h3 className={styles.subheading}>Modal shell</h3>
      <Button variant="secondary" onClick={() => setModalOpen(true)}>
        Open a modal
      </Button>
      {modalOpen && (
        <Modal title="Modal title" onClose={() => setModalOpen(false)}>
          <p className={styles.sectionDescription} style={{ margin: 0 }}>
            This is the shared Modal shell from <code>src/components/Modal.tsx</code> — an overlay, a panel, a
            title, and a close button. Any content can go inside it.
          </p>
        </Modal>
      )}
    </section>
  );
}

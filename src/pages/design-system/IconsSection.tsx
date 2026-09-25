import { LogoIcon, PlusIcon, UploadIcon, CloseIcon } from '../../components/icons';
import styles from './section.module.css';

const ICONS = [
  {
    name: 'LogoIcon',
    description: 'The FlowBoard brand mark — always white, shown on the primary-blue badge',
    render: () => (
      <span className={styles.iconSwatchBadge}>
        <LogoIcon size={20} />
      </span>
    ),
  },
  {
    name: 'PlusIcon',
    description: '"Add card" and "New Board" buttons',
    render: () => <PlusIcon size={20} color="#0a0a0a" />,
  },
  {
    name: 'UploadIcon',
    description: 'The empty-state drop zone in a kanban column',
    render: () => <UploadIcon size={24} color="#0a0a0a" />,
  },
  {
    name: 'CloseIcon',
    description: 'The close button on modals',
    render: () => <CloseIcon size={16} color="#0a0a0a" />,
  },
];

export function IconsSection() {
  return (
    <section id="icons" className={styles.section}>
      <h2 className={styles.sectionTitle}>Icons</h2>
      <p className={styles.sectionDescription}>
        Hand-drawn inline SVGs from <code>src/components/icons.tsx</code>. Every icon (except the logo) takes a{' '}
        <code>size</code> and a <code>color</code> prop.
      </p>
      <div className={styles.iconGrid}>
        {ICONS.map((icon) => (
          <div key={icon.name} className={styles.iconCard}>
            {icon.render()}
            <code>{icon.name}</code>
            <span className={styles.tokenUsage}>{icon.description}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

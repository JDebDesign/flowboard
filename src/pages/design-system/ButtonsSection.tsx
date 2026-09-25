import { useState } from 'react';
import { Button } from '../../components/Button';
import type { ButtonVariant } from '../../components/Button';
import { PlusIcon } from '../../components/icons';
import styles from './section.module.css';

const VARIANTS: { variant: ButtonVariant; label: string; withIcon?: boolean }[] = [
  { variant: 'primary', label: 'Save' },
  { variant: 'accent', label: 'New Board', withIcon: true },
  { variant: 'secondary', label: 'Cancel' },
  { variant: 'danger-text', label: 'Delete card' },
  { variant: 'ghost-muted', label: 'Add card', withIcon: true },
];

export function ButtonsSection() {
  const [clicks, setClicks] = useState(0);

  return (
    <section id="buttons" className={styles.section}>
      <h2 className={styles.sectionTitle}>Buttons</h2>
      <p className={styles.sectionDescription}>
        Every button in the app is one of these five variants (from <code>src/components/Button.tsx</code>). Click
        one — you've clicked {clicks} time{clicks === 1 ? '' : 's'}.
      </p>
      <div className={styles.buttonRow}>
        {VARIANTS.map(({ variant, label, withIcon }) => (
          <Button
            key={variant}
            variant={variant}
            icon={withIcon ? <PlusIcon size={16} color={variant === 'accent' ? '#fff' : undefined} /> : undefined}
            onClick={() => setClicks((c) => c + 1)}
          >
            {label}
          </Button>
        ))}
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Button } from './Button';
import styles from './ConfirmAction.module.css';

interface ConfirmActionProps {
  label: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  disabled?: boolean;
  onConfirmingChange?: (confirming: boolean) => void;
}

export function ConfirmAction({
  label,
  message,
  confirmLabel = 'Yes, delete',
  onConfirm,
  disabled,
  onConfirmingChange,
}: ConfirmActionProps) {
  const [confirming, setConfirming] = useState(false);

  const updateConfirming = (next: boolean) => {
    setConfirming(next);
    onConfirmingChange?.(next);
  };

  if (!confirming) {
    return (
      <Button type="button" variant="danger-text" onClick={() => updateConfirming(true)} disabled={disabled}>
        {label}
      </Button>
    );
  }

  return (
    <div className={styles.confirming}>
      <span className={styles.message}>{message}</span>
      <Button type="button" variant="secondary" onClick={() => updateConfirming(false)} disabled={disabled}>
        Cancel
      </Button>
      <Button type="button" variant="danger-text" onClick={onConfirm} disabled={disabled}>
        {confirmLabel}
      </Button>
    </div>
  );
}

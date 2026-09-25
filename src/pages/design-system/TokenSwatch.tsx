import { useState } from 'react';
import type { ReactNode } from 'react';
import type { DesignToken } from '../../design-system/tokens.generated';
import styles from './TokenSwatch.module.css';

interface TokenSwatchProps {
  token: DesignToken;
  preview: ReactNode;
}

export function TokenSwatch({ token, preview }: TokenSwatchProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`var(${token.name})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — nothing else to do.
    }
  };

  return (
    <button type="button" className={styles.swatch} onClick={handleCopy}>
      {preview}
      <div className={styles.meta}>
        <code className={styles.tokenName}>{token.name}</code>
        <span className={styles.tokenValue}>{token.value}</span>
        <span className={styles.tokenUsage}>{token.usage}</span>
      </div>
      {copied && <span className={styles.copiedBadge}>Copied!</span>}
    </button>
  );
}

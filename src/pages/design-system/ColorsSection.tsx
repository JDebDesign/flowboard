import { colorTokens } from '../../design-system/tokens.generated';
import { TokenSwatch } from './TokenSwatch';
import styles from './section.module.css';

export function ColorsSection() {
  return (
    <section id="colors" className={styles.section}>
      <h2 className={styles.sectionTitle}>Colors</h2>
      <p className={styles.sectionDescription}>
        Click any swatch to copy its CSS variable name. These come straight from{' '}
        <code>design-system.md</code>.
      </p>
      <div className={styles.swatchGrid}>
        {colorTokens.map((token) => (
          <TokenSwatch
            key={token.name}
            token={token}
            preview={<span className={styles.colorPreview} style={{ background: token.value }} />}
          />
        ))}
      </div>
    </section>
  );
}

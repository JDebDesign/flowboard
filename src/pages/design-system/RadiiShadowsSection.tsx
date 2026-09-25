import { radiusTokens, shadowTokens } from '../../design-system/tokens.generated';
import { TokenSwatch } from './TokenSwatch';
import styles from './section.module.css';

export function RadiiShadowsSection() {
  return (
    <section id="radii-shadows" className={styles.section}>
      <h2 className={styles.sectionTitle}>Radii &amp; Shadows</h2>

      <h3 className={styles.subheading}>Radii</h3>
      <div className={styles.swatchGrid}>
        {radiusTokens.map((token) => (
          <TokenSwatch
            key={token.name}
            token={token}
            preview={<span className={styles.radiusPreview} style={{ borderRadius: token.value }} />}
          />
        ))}
      </div>

      <h3 className={styles.subheading}>Shadows</h3>
      <div className={styles.swatchGrid}>
        {shadowTokens.map((token) => (
          <TokenSwatch
            key={token.name}
            token={token}
            preview={<span className={styles.shadowPreview} style={{ boxShadow: token.value }} />}
          />
        ))}
      </div>
    </section>
  );
}

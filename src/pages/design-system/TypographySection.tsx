import { typographyTokens } from '../../design-system/tokens.generated';
import { TokenSwatch } from './TokenSwatch';
import styles from './section.module.css';

export function TypographySection() {
  const sizes = typographyTokens.filter((t) => t.name.startsWith('--font-size'));
  const weights = typographyTokens.filter((t) => t.name.startsWith('--font-weight'));
  const spacings = typographyTokens.filter((t) => t.name.startsWith('--letter-spacing'));

  return (
    <section id="typography" className={styles.section}>
      <h2 className={styles.sectionTitle}>Typography</h2>
      <p className={styles.sectionDescription}>FlowBoard uses Inter everywhere, loaded from Google Fonts.</p>

      <h3 className={styles.subheading}>Font sizes</h3>
      <div className={styles.stack}>
        {sizes.map((token) => (
          <TokenSwatch key={token.name} token={token} preview={<span style={{ fontSize: token.value }}>Aa</span>} />
        ))}
      </div>

      <h3 className={styles.subheading}>Font weights</h3>
      <div className={styles.stack}>
        {weights.map((token) => (
          <TokenSwatch
            key={token.name}
            token={token}
            preview={<span style={{ fontWeight: token.value }}>Aa</span>}
          />
        ))}
      </div>

      <h3 className={styles.subheading}>Letter spacing</h3>
      <div className={styles.stack}>
        {spacings.map((token) => (
          <TokenSwatch
            key={token.name}
            token={token}
            preview={<span style={{ letterSpacing: token.value }}>Aa</span>}
          />
        ))}
      </div>
    </section>
  );
}

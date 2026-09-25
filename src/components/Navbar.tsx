import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LogoIcon } from './icons';
import { Button } from './Button';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const initial = user?.email?.trim().charAt(0).toUpperCase() || 'U';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <Link to="/boards" className={styles.logoGroup}>
          <span className={styles.logoMark}>
            <LogoIcon />
          </span>
          <span className={styles.brandName}>FlowBoard</span>
        </Link>
        <Link to="/boards" className={styles.navLink}>
          Boards
        </Link>
        <Link to="/design-system" className={styles.navLink}>
          Design System
        </Link>
      </div>
      <div className={styles.actions}>
        <span className={styles.avatar}>{initial}</span>
        <Button variant="ghost-muted" className={styles.signOut} onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </header>
  );
}

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import './AnimatedLogo.css';
type AnimatedLogoProps = { size?: number; name?: string; className?: string };
export function AnimatedLogo({ size = 36, name = 'Finanças pessoais', className = '' }: AnimatedLogoProps) {
  return <span className={`animated-logo ${className}`} style={{ '--logo-size': `${size}px` } as CSSProperties} aria-label={name} role="img"><span className="animated-logo__coin" aria-hidden="true"><span className="animated-logo__coin-face">€</span></span><span className="animated-logo__name" aria-hidden="true">{name}</span></span>;
}
export function InitialLoader({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true), [mounted, setMounted] = useState(true);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const show = window.setTimeout(() => setVisible(false), reduced ? 0 : 450);
    const remove = window.setTimeout(() => setMounted(false), reduced ? 0 : 800);
    return () => { window.clearTimeout(show); window.clearTimeout(remove); };
  }, []);
  return <><div className="app-content">{children}</div>{mounted && <div className={`initial-loader ${visible ? '' : 'initial-loader--hidden'}`} role="status" aria-hidden="true" aria-label="A preparar Finanças pessoais"><AnimatedLogo size={64}/></div>}</>;
}

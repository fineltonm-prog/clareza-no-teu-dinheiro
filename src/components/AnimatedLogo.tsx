import { useEffect, useState, type CSSProperties } from "react";

const CSS = `
.al-root{
  --al-accent:hsl(var(--primary));
  --al-ink:hsl(var(--primary-foreground));
  --al-text:hsl(var(--foreground));
  --al-font:var(--font-display, var(--font-serif, Georgia, "Times New Roman", serif));
  display:inline-flex;align-items:center;gap:calc(var(--al-size)*.3);line-height:1;
}
.al-coin{width:var(--al-size);height:var(--al-size);perspective:calc(var(--al-size)*5);flex:none}
.al-spin{position:relative;display:block;width:100%;height:100%;transform-style:preserve-3d;
  animation:al-turn 3.6s linear infinite}
.al-face,.al-edge{position:absolute;inset:0;border-radius:50%}
.al-edge{background:color-mix(in srgb,var(--al-accent) 68%,black)}
.al-face{
  display:flex;align-items:center;justify-content:center;backface-visibility:hidden;
  font-family:var(--al-font);font-weight:700;font-size:calc(var(--al-size)*.58);color:var(--al-ink);
  background:radial-gradient(circle at 32% 28%,
    color-mix(in srgb,var(--al-accent) 70%,white) 0%,
    var(--al-accent) 58%,
    color-mix(in srgb,var(--al-accent) 82%,black) 100%);
  box-shadow:
    inset 0 0 0 calc(var(--al-size)*.05) color-mix(in srgb,var(--al-accent) 78%,black),
    inset 0 0 0 calc(var(--al-size)*.085) color-mix(in srgb,var(--al-accent) 72%,white);
}
.al-front{transform:translateZ(calc(var(--al-size)*.08))}
.al-back{transform:rotateY(180deg) translateZ(calc(var(--al-size)*.08))}
.al-text{
  font-family:var(--al-font);font-size:calc(var(--al-size)*.56);font-weight:500;
  letter-spacing:-.01em;color:var(--al-text);white-space:nowrap;
}
@keyframes al-turn{
  from{transform:rotateX(-12deg) rotateY(0deg)}
  to{transform:rotateX(-12deg) rotateY(360deg)}
}
@media (max-width:420px){.al-text--collapse{display:none}}

.al-splash{
  position:fixed;inset:0;z-index:100;display:grid;place-items:center;
  background:hsl(var(--background));opacity:1;transition:opacity var(--al-fade,400ms) ease;
}
.al-splash[data-phase="fade"]{opacity:0;pointer-events:none}

@media (prefers-reduced-motion:reduce){
  .al-spin{animation:none;transform:rotateX(-8deg) rotateY(-24deg)}
  .al-splash{transition:none}
}
`;

const LAYERS = 7;
const HALF_THICKNESS = 0.07;

type AnimatedLogoProps = {
  size?: number;
  name?: string;
  hideTextOnMobile?: boolean;
  className?: string;
};

export function AnimatedLogo({
  size = 36,
  name = "FinanÃ§as pessoais",
  hideTextOnMobile = false,
  className = "",
}: AnimatedLogoProps) {
  return (
    <span
      className={`al-root ${className}`}
      style={{ "--al-size": `${size}px` } as CSSProperties}
      role="img"
      aria-label={name}
    >
      <style>{CSS}</style>
      <span className="al-coin" aria-hidden="true">
        <span className="al-spin">
          {Array.from({ length: LAYERS }, (_, i) => {
            const z = -HALF_THICKNESS + (i * 2 * HALF_THICKNESS) / (LAYERS - 1);
            return (
              <span
                key={i}
                className="al-edge"
                style={{ transform: `translateZ(calc(var(--al-size) * ${z.toFixed(4)}))` }}
              />
            );
          })}
          <span className="al-face al-front">â‚¬</span>
          <span className="al-face al-back">â‚¬</span>
        </span>
      </span>
      <span
        className={`al-text${hideTextOnMobile ? " al-text--collapse" : ""}`}
        aria-hidden="true"
      >
        {name}
      </span>
    </span>
  );
}

type SplashScreenProps = {
  duration?: number;
  fadeDuration?: number;
};

export function SplashScreen({ duration = 1500, fadeDuration = 400 }: SplashScreenProps) {
  const [phase, setPhase] = useState<"show" | "fade" | "done">("show");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fade"), duration);
    const t2 = setTimeout(() => setPhase("done"), duration + fadeDuration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [duration, fadeDuration]);

  if (phase === "done") return null;

  return (
    <div
      className="al-splash"
      data-phase={phase}
      style={{ "--al-fade": `${fadeDuration}ms` } as CSSProperties}
      role="status"
      aria-label="A carregar"
    >
      <AnimatedLogo size={64} />
    </div>
  );
}

import type { ComponentPropsWithoutRef, ReactNode } from "react";

type LiquidGlassNavProps = ComponentPropsWithoutRef<"nav"> & {
  children: ReactNode;
};

export function LiquidGlassNav({
  children,
  className = "",
  ...props
}: LiquidGlassNavProps) {
  return (
    <nav className={`liquid-glass-nav ${className}`.trim()} {...props}>
      <span className="liquid-glass-nav-backdrop" aria-hidden="true" />
      <span className="liquid-glass-nav-surface" aria-hidden="true" />
      {children}
      <svg className="liquid-glass-nav-filter" aria-hidden="true">
        <defs>
          <filter
            id="project-nav-liquid-glass"
            x="-20%"
            y="-50%"
            width="140%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.12"
              numOctaves="1"
              seed="7"
              result="turbulence"
            />
            <feGaussianBlur
              in="turbulence"
              stdDeviation="1.6"
              result="blurredNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurredNoise"
              scale="42"
              xChannelSelector="R"
              yChannelSelector="B"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="0.65" />
          </filter>
        </defs>
      </svg>
    </nav>
  );
}

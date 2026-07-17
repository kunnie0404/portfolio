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
      <span
        className="liquid-glass-nav-backdrop"
        style={{
          backdropFilter: "blur(20px) saturate(165%) contrast(105%)",
          WebkitBackdropFilter: "blur(20px) saturate(165%) contrast(105%)",
        }}
        aria-hidden="true"
      />
      {children}
    </nav>
  );
}

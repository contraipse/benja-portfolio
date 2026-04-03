// ─── DESIGN TOKENS ───
// Colors reference CSS custom properties defined in global.css
// so they automatically adapt to dark/light mode via prefers-color-scheme.
export const T = {
  // Colors
  bg: "var(--bg)",
  bgLight: "var(--bg-light)",
  surface: "var(--surface)",
  text: "var(--text)",
  textMuted: "var(--text-muted)",
  textFaint: "var(--text-faint)",
  accent: "var(--accent)",
  accentDark: "var(--accent-dark)",
  accentGlow: "var(--accent-glow)",
  border: "var(--border)",
  borderLight: "var(--border-light)",

  // Typography
  serif: "'Fraunces', Georgia, serif",
  sans: "'Space Grotesk', 'Inter', system-ui, sans-serif",

  // Border Radius Scale
  r: { sm: 4, md: 8, lg: 16, xl: 24, full: 9999 },

  // Spacing Scale (8pt grid)
  s: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 },

  // Section padding
  padX: "clamp(24px, 5vw, 64px)",
  mobilePadX: 20,
};

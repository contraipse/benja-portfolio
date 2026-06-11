// ─── DESIGN TOKENS ───
export const T = {
  // Colors — warm charcoal + bone, orange as scalpel accent
  bg: "#0D0B09",
  bgLight: "#14110E",
  surface: "#1B1713",
  text: "#EFE9DF",
  textMuted: "rgba(239,233,223,0.64)",
  textFaint: "rgba(239,233,223,0.52)",
  accent: "#FF4D00",
  accentDark: "#E64400",
  accentGlow: "rgba(255,77,0,0.15)",
  border: "rgba(239,233,223,0.10)",
  borderLight: "rgba(239,233,223,0.18)",

  // Typography
  serif: "'Fraunces', Georgia, serif",
  sans: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', monospace",

  // Border Radius Scale
  r: { sm: 4, md: 8, lg: 16, xl: 24, full: 9999 },

  // Spacing Scale (8pt grid)
  s: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 },

  // Section padding
  padX: "clamp(24px, 5vw, 72px)",
  mobilePadX: 20,
};

// Shared mono metadata label style
export const monoLabel = {
  fontFamily: T.mono,
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "2px",
  textTransform: "uppercase",
};

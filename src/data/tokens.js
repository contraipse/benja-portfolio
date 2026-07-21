// ─── DESIGN TOKENS ─── "Paper" theme.
// Radius scale intentionally all-zero: square edges site-wide.
export const T = {
  // Colors
  bg: "#FAF7F2",
  bgLight: "#F3EFE7",
  surface: "#EDE8DE",
  text: "#211E19",
  textMuted: "#6E6A62",
  textFaint: "#8F8A80",
  border: "#DED9D0",
  borderLight: "#EAE5DC",
  dot: "#C9C3B8",

  // Typography
  serif: "'Fraunces', Georgia, serif",
  sans: "'Space Grotesk', 'Inter', system-ui, sans-serif",

  // Border Radius Scale
  r: { sm: 0, md: 0, lg: 0, xl: 0, full: 0 },

  // Spacing Scale (8pt grid)
  s: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 },

  // Section padding
  padX: "clamp(24px, 5vw, 64px)",
  mobilePadX: 20,
};

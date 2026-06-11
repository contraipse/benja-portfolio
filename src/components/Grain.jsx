// Fixed film-grain texture + one quiet warm glow. Replaces EtherealBackground.
export function Grain() {
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(255,77,0,0.07) 0%, rgba(255,77,0,0.02) 40%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, opacity: 0.4,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />
    </div>
  );
}
export default Grain;

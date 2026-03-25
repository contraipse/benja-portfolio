import { useState, useEffect, useRef } from 'react';
import { T } from '../data/tokens';
import { useInView } from '../hooks/useInView';
import { useIsMobile } from '../hooks/useIsMobile';

// -- Footer WebGL Shader (desktop only) --
function FooterShader({ containerRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cleanup = null;

    import('three').then((THREE) => {
      if (!container) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";
    container.insertBefore(renderer.domElement, container.firstChild);
    canvasRef.current = renderer.domElement;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    const vertexShader = `void main() { gl_Position = vec4(position, 1.0); }`;
    const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
          mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
        return v;
      }
      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        vec2 mouse = (iMouse - 0.5 * iResolution.xy) / iResolution.y;
        float t = iTime * 0.15;
        vec2 p = uv;
        p.y += 0.5;
        float f = fbm(vec2(p.x * 2.5, p.y * 1.5 + t));
        float curtain = smoothstep(0.15, 0.55, f) * (1.0 - p.y * 0.8);
        float d = length(uv - mouse);
        float flare = smoothstep(0.35, 0.0, d);
        vec3 c1 = vec3(0.95, 0.3, 0.0);
        vec3 c2 = vec3(1.0, 0.55, 0.15);
        vec3 c3 = vec3(0.8, 0.15, 0.05);
        vec3 fc = vec3(1.0, 0.85, 0.6);
        vec3 color = mix(c1, c2, p.y + 0.3) * curtain * 0.35;
        color += c3 * fbm(p * 3.0 - t) * 0.15;
        color += fc * flare * curtain * 1.2;
        float vignette = smoothstep(1.2, 0.3, length(uv * vec2(0.8, 1.0)));
        color *= vignette * 0.5;
        gl_FragColor = vec4(color, 1.0);
      }
    `;
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      iMouse: { value: new THREE.Vector2(-100, -100) },
    };
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    const dpr = renderer.getPixelRatio();
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w * dpr, h * dpr);
    };
    window.addEventListener("resize", onResize);
    onResize();

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      uniforms.iMouse.value.set((e.clientX - rect.left) * dpr, (rect.height - (e.clientY - rect.top)) * dpr);
    };
    container.addEventListener("mousemove", onMouseMove);

    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });
    cleanup = () => {
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMouseMove);
      renderer.setAnimationLoop(null);
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
      material.dispose();
      renderer.dispose();
    };
    });

    return () => { if (cleanup) cleanup(); };
  }, []);

  return null;
}

// -- CSS Haze background (mobile fallback) --
function FooterCSSHaze() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", width: "200%", height: "200%",
        top: "-50%", left: "-50%",
        background: [
          "radial-gradient(ellipse 50% 40% at 35% 60%, rgba(255,77,0,0.14) 0%, transparent 60%)",
          "radial-gradient(ellipse 40% 50% at 70% 40%, rgba(255,120,50,0.08) 0%, transparent 55%)",
          "radial-gradient(ellipse 45% 35% at 50% 70%, rgba(200,100,50,0.06) 0%, transparent 50%)",
        ].join(", "),        animation: "footerHaze1 25s ease-in-out infinite alternate",
        filter: "blur(40px)", willChange: "transform",
      }} />
      <div style={{
        position: "absolute", width: "180%", height: "180%",
        top: "-40%", left: "-40%",
        background: [
          "radial-gradient(ellipse 55% 45% at 60% 50%, rgba(160,140,255,0.07) 0%, transparent 55%)",
          "radial-gradient(ellipse 35% 50% at 30% 65%, rgba(120,100,200,0.04) 0%, transparent 50%)",
        ].join(", "),
        animation: "footerHaze2 30s ease-in-out infinite alternate",
        filter: "blur(50px)", willChange: "transform",
      }} />
      <div style={{
        position: "absolute", width: "100%", height: "60%",
        bottom: 0, left: 0,
        background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,77,0,0.08) 0%, transparent 60%)",
        filter: "blur(30px)",
      }} />
    </div>
  );
}

// -- Footer Divider (simplified) --
function FooterDivider({ visible, isMobile }) {
  return (
    <div style={{
      position: "relative", zIndex: 3,
      marginBottom: isMobile ? T.s.xxl : T.s.xxxl,
      height: 2,    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: T.accent,
        opacity: visible ? 0.85 : 0,
        transition: "opacity 0.8s ease",
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, top: "50%",
        height: 6, transform: "translateY(-50%)",
        background: T.accent,
        filter: "blur(4px)",
        opacity: visible ? 0.45 : 0,
        transition: "opacity 1s ease 0.1s",
      }} />
    </div>
  );
}

// -- FOOTER --
function Footer() {
  const [footerContainerRef, visible] = useInView({ threshold: 0.05 });
  const containerDomRef = useRef(null);
  const [btnHover, setBtnHover] = useState(false);
  const [shaderReady, setShaderReady] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (visible && !shaderReady) setShaderReady(true);
  }, [visible]);
  const ctaText = "Building something bold?";

  return (
    <footer ref={(el) => { footerContainerRef(el); containerDomRef.current = el; }} style={{
      paddingTop: 0,
      paddingBottom: isMobile ? T.s.xl : "clamp(32px, 4vw, 48px)",
      position: "relative", overflow: "hidden", zIndex: 1, marginTop: 0,
      minHeight: isMobile ? 400 : "auto",
    }}>
      <FooterDivider visible={visible} isMobile={isMobile} />

      {/* Top fade */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "30%",
        background: `linear-gradient(to bottom, ${T.bg} 0%, transparent 100%)`,
        pointerEvents: "none", zIndex: 2,
      }} />
      {/* Background: WebGL shader on desktop, CSS haze on mobile */}
      {shaderReady && (isMobile
        ? <FooterCSSHaze />
        : <FooterShader containerRef={containerDomRef} />
      )}

      <div style={{ position: "relative", zIndex: 1, padding: isMobile ? `0 ${T.mobilePadX}px` : `0 ${T.padX}` }}>
        {/* Accent line */}
        <div style={{
          width: visible ? 80 : 0, height: 2, background: T.accent,
          marginBottom: T.s.lg, borderRadius: T.r.sm,          transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }} />

        <span style={{
          fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.accent,
          letterSpacing: "3px", textTransform: "uppercase",
          opacity: visible ? 1 : 0, transition: "opacity 0.6s ease",
        }}>Get in touch</span>

        {/* CTA headline with "life." wave restored */}
        <h2 style={{
          fontFamily: T.serif, fontSize: isMobile ? "clamp(32px, 10vw, 48px)" : "clamp(44px, 7vw, 100px)", fontWeight: 300,
          color: T.text, margin: `${T.s.md}px 0 0`, lineHeight: 1,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
        }}>
          {ctaText}<br />
          Let's bring it to{" "}
          <span style={{ display: "inline-block" }}>
            {["l","i","f","e","."].map((ch, i) => (
              <span key={i} style={{
                color: "transparent", WebkitTextStroke: `1.5px ${T.accent}`,
                fontStyle: "italic", display: "inline-block",
                animation: visible ? `lifeWave 2.5s ease-in-out ${i * 0.18}s infinite` : "none",
              }}>{ch}</span>
            ))}
          </span>
        </h2>
        {/* CTA button */}
        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s", marginTop: T.s.xxl,
        }}>
          <a
            href="mailto:benjajuster@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor={isMobile ? undefined : ""}
            onMouseEnter={isMobile ? undefined : () => setBtnHover(true)}
            onMouseLeave={isMobile ? undefined : () => setBtnHover(false)}
            style={{
              display: "inline-flex", alignItems: "center", gap: T.s.sm + 4,
              padding: isMobile ? `${T.s.md}px ${T.s.xl}px` : `${T.s.lg - 4}px ${T.s.xxl - 8}px`,
              borderRadius: T.r.full,
              background: T.accent,
              color: "#fff", textDecoration: "none", fontFamily: T.sans,
              fontSize: isMobile ? 14 : 16, fontWeight: 600, position: "relative",
              transform: `scale(${btnHover ? 1.05 : 1})`,
              transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease",
              boxShadow: btnHover ? "0 0 40px rgba(255,77,0,0.35)" : "0 0 20px rgba(255,77,0,0.12)",
            }}
          >
            Let's connect
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              style={{ transform: btnHover ? "translateX(4px)" : "translateX(0)", transition: "transform 0.3s ease" }}>
              <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
      {/* Footer bar */}
      <div style={{
        display: "flex", justifyContent: isMobile ? "center" : "space-between", alignItems: "center",
        flexDirection: isMobile ? "column" : "row",
        marginTop: isMobile ? T.s.xxxl : "clamp(80px, 10vw, 140px)", paddingTop: T.s.lg,
        padding: isMobile ? `${T.s.lg}px ${T.mobilePadX}px 0` : `${T.s.lg}px ${T.padX} 0`,
        borderTop: `1px solid ${T.border}`, flexWrap: "wrap", gap: isMobile ? T.s.sm + 4 : T.s.md,
        position: "relative", zIndex: 1,
      }}>
        <span style={{ fontFamily: T.sans, fontSize: 12, color: T.textFaint }}>
          {'\u00A9'} {new Date().getFullYear()} Benja Juster. Los Angeles, CA.
        </span>
        <a href="https://www.linkedin.com/in/benjajuster/" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", color: T.textFaint, transition: "color 0.3s" }}
          onMouseEnter={(e) => e.currentTarget.style.color = T.text}
          onMouseLeave={(e) => e.currentTarget.style.color = T.textFaint}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
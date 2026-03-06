import { useState, useEffect, useRef, useCallback } from 'react';
import { T } from '../data/tokens';
import { useInView } from '../hooks/useInView';
import { useIsMobile } from '../hooks/useIsMobile';

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ FOOTER SHADER ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ WebGL shader with animated noise and mouse flare ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
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
      }
      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
        return v;
      }
      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        vec2 mouse = (iMouse - 0.5 * iResolution.xy) / iResolution.y;
        float t = iTime * 0.15;

        // FBM curtain flowing upward
        vec2 p = uv;
        p.y += 0.5;
        float f = fbm(vec2(p.x * 2.5, p.y * 1.5 + t));
        float curtain = smoothstep(0.15, 0.55, f) * (1.0 - p.y * 0.8);

        // Mouse flare ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ warm glow follows cursor
        float d = length(uv - mouse);
        float flare = smoothstep(0.35, 0.0, d);

        // Warm color palette (orange/amber to match brand)
        vec3 c1 = vec3(0.95, 0.3, 0.0);   // brand orange
        vec3 c2 = vec3(1.0, 0.55, 0.15);   // warm amber
        vec3 c3 = vec3(0.8, 0.15, 0.05);   // deep red
        vec3 fc = vec3(1.0, 0.85, 0.6);    // warm white flare

        vec3 color = mix(c1, c2, p.y + 0.3) * curtain * 0.35;
        color += c3 * fbm(p * 3.0 - t) * 0.15;
        color += fc * flare * curtain * 1.2;

        // Fade to transparent at edges
        float vignette = smoothstep(1.2, 0.3, length(uv * vec2(0.8, 1.0)));
        color *= vignette;

        // Keep it subtle ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ this is a background
        color *= 0.5;

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

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ FOOTER CSS HAZE ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ Layered animated gradients that mimic smoke/aurora ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
function FooterCSSHaze() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Slow-drifting warm cloud */}
      <div style={{
        position: "absolute", width: "200%", height: "200%",
        top: "-50%", left: "-50%",
        background: [
          "radial-gradient(ellipse 50% 40% at 35% 60%, rgba(255,77,0,0.14) 0%, transparent 60%)",
          "radial-gradient(ellipse 40% 50% at 70% 40%, rgba(255,120,50,0.08) 0%, transparent 55%)",
          "radial-gradient(ellipse 45% 35% at 50% 70%, rgba(200,100,50,0.06) 0%, transparent 50%)",
        ].join(", "),
        animation: "footerHaze1 25s ease-in-out infinite alternate",
        filter: "blur(40px)", willChange: "transform",
      }} />
      {/* Counter-drifting cool mist */}
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
      {/* Subtle warm ember at bottom */}
      <div style={{
        position: "absolute", width: "100%", height: "60%",
        bottom: 0, left: 0,
        background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,77,0,0.08) 0%, transparent 60%)",
        filter: "blur(30px)",
      }} />
    </div>
  );
}

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ FOOTER DIVIDER ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ Bold accent seam with glow pulse ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
function FooterDivider({ visible, isMobile }) {
  return (
    <div style={{
      position: "relative", zIndex: 3,
      marginBottom: isMobile ? 40 : 60,
      height: 2,
    }}>
      {/* Solid accent line */}
      <div style={{
        position: "absolute", inset: 0,
        background: T.accent,
        opacity: visible ? 0.85 : 0,
        transition: "opacity 0.8s ease",
      }} />
      {/* Tight glow right on the line */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: "50%",
        height: 6, transform: "translateY(-50%)",
        background: T.accent,
        filter: "blur(4px)",
        opacity: visible ? 0.45 : 0,
        transition: "opacity 1s ease 0.1s",
      }} />
      {/* Breathing wide glow ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ slow pulse */}
      <div style={{
        position: "absolute", left: "5%", right: "5%", top: "50%",
        height: 24, transform: "translateY(-50%)",
        background: `radial-gradient(ellipse 50% 100% at 50% 50%, ${T.accent} 0%, transparent 70%)`,
        filter: "blur(12px)",
        opacity: visible ? 1 : 0,
        animation: visible ? "dividerPulse 4s ease-in-out infinite" : "none",
        transition: "opacity 1s ease 0.2s",
        pointerEvents: "none",
      }} />
    </div>
  );
}

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ FOOTER ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
function Footer() {
  const [footerContainerRef, visible] = useInView({ threshold: 0.05 });
  const containerDomRef = useRef(null);
  const [btnHover, setBtnHover] = useState(false);
  const btnRef = useRef(null);
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });
  const [shaderReady, setShaderReady] = useState(false);
  const isMobile = useIsMobile();

  // Start shader only when footer comes into view
  useEffect(() => {
    if (visible && !shaderReady) setShaderReady(true);
  }, [visible]);

  const handleBtnMouseMove = useCallback((e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setBtnOffset({ x: (e.clientX - cx) * 0.15, y: (e.clientY - cy) * 0.15 });
  }, []);

  const handleBtnMouseLeave = useCallback(() => {
    setBtnHover(false);
    setBtnOffset({ x: 0, y: 0 });
  }, []);

  const ctaText = "Building something bold?";

  return (
    <footer ref={(el) => { footerContainerRef(el); containerDomRef.current = el; }} style={{
      paddingTop: 0,
      paddingBottom: isMobile ? 32 : "clamp(32px, 4vw, 48px)",
      paddingLeft: isMobile ? 0 : 0,
      paddingRight: isMobile ? 0 : 0,
      position: "relative", overflow: "hidden", zIndex: 1, marginTop: 0,
      minHeight: isMobile ? 400 : "auto",
    }}>
      {/* Divider at the exact seam */}
      <FooterDivider visible={visible} isMobile={isMobile} />

      {/* Top fade ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ the shader canvas will show through, and this fades it to bg color at the top edge */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "30%",
        background: `linear-gradient(to bottom, ${T.bg} 0%, transparent 100%)`,
        pointerEvents: "none", zIndex: 2,
      }} />
      {/* Background effect ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ WebGL shader on desktop, CSS haze on mobile */}
      {shaderReady && (isMobile
        ? <FooterCSSHaze />
        : <FooterShader containerRef={containerDomRef} />
      )}

      <div style={{ position: "relative", zIndex: 1, padding: isMobile ? "0 28px" : "0 clamp(40px, 5vw, 80px)" }}>
        {/* Animated accent line */}
        <div style={{
          width: visible ? 80 : 0, height: 2, background: T.accent,
          marginBottom: 24, borderRadius: 1,
          transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }} />

        <span style={{
          fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.accent,
          letterSpacing: "3px", textTransform: "uppercase",
          opacity: visible ? 1 : 0, transition: "opacity 0.6s ease",
        }}>Get in touch</span>

        {/* CTA text with staggered letter/word reveal */}
        <h2 style={{
          fontFamily: T.serif, fontSize: isMobile ? "clamp(32px, 10vw, 48px)" : "clamp(44px, 7vw, 100px)", fontWeight: 300,
          color: T.text, margin: "16px 0 0", lineHeight: 1,
          overflow: "hidden",
        }}>
          {ctaText.split(" ").map((word, i) => (
            <span key={i} style={{
              display: "inline-block", marginRight: "0.3em",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0) rotateX(0deg)" : "translateY(100%) rotateX(-80deg)",
              transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.08}s`,
              transformOrigin: "bottom",
            }}>{word}</span>
          ))}
          <br />
          {["Let's", "bring", "it", "to"].map((word, i) => (
            <span key={i} style={{
              display: "inline-block", marginRight: "0.3em",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(40px)",
              transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.6 + i * 0.08}s`,
            }}>{word}</span>
          ))}
          {/* "life." with wave animation ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ each letter undulates independently */}
          <span style={{
            display: "inline-block",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.9)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.95s",
          }}>
            {["l","i","f","e","."].map((ch, i) => (
              <span key={i} style={{
                color: "transparent", WebkitTextStroke: `1.5px ${T.accent}`,
                fontStyle: "italic", display: "inline-block",
                animation: visible ? `lifeWave 2.5s ease-in-out ${i * 0.18}s infinite` : "none",
              }}>{ch}</span>
            ))}
          </span>
        </h2>

        {/* Magnetic CTA button */}
        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1.1s", marginTop: 40,
        }}>
          <a
            ref={btnRef}
            href="mailto:benjajuster@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor={isMobile ? undefined : ""}
            onMouseEnter={isMobile ? undefined : () => setBtnHover(true)}
            onMouseMove={isMobile ? undefined : handleBtnMouseMove}
            onMouseLeave={isMobile ? undefined : handleBtnMouseLeave}
            style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              padding: isMobile ? "16px 32px" : "20px 40px", borderRadius: 40, background: "#E64400",
              color: "#fff", textDecoration: "none", fontFamily: T.sans,
              fontSize: isMobile ? 14 : 16, fontWeight: 600, position: "relative",
              transform: isMobile ? "none" : `translate(${btnOffset.x}px, ${btnOffset.y}px) scale(${btnHover ? 1.05 : 1})`,
              transition: btnHover ? "transform 0.15s ease" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: btnHover ? "0 0 60px rgba(255,77,0,0.4), 0 0 120px rgba(255,77,0,0.15)" : "0 0 30px rgba(255,77,0,0.15)",
            }}
          >
            {btnHover && (
              <div style={{
                position: "absolute", inset: -8, borderRadius: 48,
                border: `1px solid rgba(255,77,0,0.3)`,
                animation: "magneticPulse 1.5s ease-in-out infinite",
                pointerEvents: "none",
              }} />
            )}
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
        marginTop: isMobile ? 60 : "clamp(80px, 10vw, 140px)", paddingTop: 24,
        padding: isMobile ? "24px 28px 0" : `24px clamp(40px, 5vw, 80px) 0`,
        borderTop: `1px solid ${T.border}`, flexWrap: "wrap", gap: isMobile ? 12 : 16,
        position: "relative", zIndex: 1,
      }}>
        <span style={{ fontFamily: T.sans, fontSize: 12, color: T.textFaint }}>
          {'\u00A9'} {new Date().getFullYear()} Benja Juster. Los Angeles, CA.
        </span>
        <div style={{ display: "flex", gap: 28 }}>
          <a href="https://www.linkedin.com/in/benjajuster/" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: T.sans, fontSize: 12, color: T.textFaint,
              textDecoration: "none", transition: "color 0.3s",
            }}
              onMouseEnter={(e) => e.target.style.color = T.text}
              onMouseLeave={(e) => e.target.style.color = T.textFaint}
            >LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { useEffect, useRef, useState } from "react";
import { HERO_NAME_LINES, SITE_NAME } from "../site.config";

const MAX_STRETCH = 220;

function HangingBadge() {
  const offsetRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const frameRef = useRef(0);
  const springRef = useRef(0);
  const bandRef = useRef(null);
  const jointRef = useRef(null);
  const mobileHookRef = useRef(null);
  const handRef = useRef(null);
  const hintToken = useRef(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [pulling, setPulling] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const applyOffset = (next) => {
    offsetRef.current = next;
    setOffset(next);
  };

  useEffect(() => {
    const tick = () => {
      const anchor = document.getElementById("badge-anchor");
      const joint = jointRef.current;
      const band = bandRef.current;
      if (anchor && joint && band) {
        const jointBox = joint.getBoundingClientRect();
        const atRest = Math.hypot(offsetRef.current.x, offsetRef.current.y) < 0.5;
        const mobile = window.matchMedia("(max-width: 700px)").matches;
        const bx = jointBox.left + jointBox.width / 2;
        const by = jointBox.top + jointBox.height / 2;
        let ax;
        let ay;
        if (mobile) {
          if (atRest || !mobileHookRef.current) {
            mobileHookRef.current = { x: bx, y: by - 54 };
          }
          ax = mobileHookRef.current.x;
          ay = mobileHookRef.current.y;
        } else {
          const parent = anchor.offsetParent || band.parentElement;
          if (atRest && parent) {
            const parentBox = parent.getBoundingClientRect();
            anchor.style.left = `${bx + window.scrollX - (parentBox.left + window.scrollX) - anchor.offsetWidth / 2}px`;
            if (window.scrollY <= 1 || anchor.dataset.placed !== "1") {
              const nav = document.querySelector(".site-nav");
              const hookDocY = nav.offsetTop + nav.offsetHeight;
              anchor.style.top = `${hookDocY - (parentBox.top + window.scrollY) - anchor.offsetHeight / 2}px`;
              anchor.dataset.placed = "1";
            }
          }
          const anchorBox = anchor.getBoundingClientRect();
          ax = anchorBox.left + anchorBox.width / 2;
          ay = anchorBox.top + anchorBox.height / 2;
        }
        const angle = Math.atan2(by - ay, bx - ax) * (180 / Math.PI);
        band.style.left = `${ax}px`;
        band.style.top = `${ay}px`;
        band.style.width = `${Math.hypot(bx - ax, by - ay)}px`;
        band.style.transform = `rotate(${angle}deg)`;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShowHint(false);
      return;
    }
    const token = ++hintToken.current;
    let frame = 0;
    const start = performance.now() + 400;
    const duration = 2400;
    const pull = 52;
    const tick = (now) => {
      if (token !== hintToken.current || dragRef.current) return;
      const elapsed = now - start;
      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }
      if (elapsed >= duration) {
        applyOffset({ x: 0, y: 0 });
        setShowHint(false);
        return;
      }
      const cycle = 1100;
      const phase = (elapsed % cycle) / cycle;
      const active = elapsed < cycle * 2;
      let y = 0;
      if (active && phase < 0.42) y = pull * Math.sin((phase / 0.42) * (Math.PI / 2));
      else if (active && phase < 0.78) y = pull * (1 - (phase - 0.42) / 0.36);
      applyOffset({ x: 0, y });
      const hand = handRef.current;
      if (hand) {
        const fadeIn = Math.min(1, elapsed / 180);
        const fadeOut = Math.min(1, (duration - elapsed) / 320);
        hand.style.opacity = String(Math.min(fadeIn, fadeOut));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      hintToken.current += 1;
      cancelAnimationFrame(frame);
    };
  }, []);

  const springHome = (from) => {
    cancelAnimationFrame(springRef.current);
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 780);
      const damp = Math.exp(-3.4 * t) * Math.cos(t * Math.PI * 2.6);
      if (t >= 1) {
        applyOffset({ x: 0, y: 0 });
        return;
      }
      applyOffset({ x: from.x * damp, y: from.y * damp });
      springRef.current = requestAnimationFrame(tick);
    };
    springRef.current = requestAnimationFrame(tick);
  };

  const onPointerDown = (event) => {
    event.preventDefault();
    hintToken.current += 1;
    setShowHint(false);
    cancelAnimationFrame(springRef.current);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* Pointer capture is unavailable for synthetic events. */
    }
    dragRef.current = {
      id: event.pointerId,
      sx: event.clientX,
      sy: event.clientY,
      ox: offsetRef.current.x,
      oy: offsetRef.current.y,
    };
    setPulling(true);
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    let x = drag.ox + (event.clientX - drag.sx);
    let y = drag.oy + (event.clientY - drag.sy);
    y = Math.max(-24, y);
    const reach = Math.hypot(x, Math.max(0, y));
    if (reach > MAX_STRETCH) {
      const scale = MAX_STRETCH / reach;
      x *= scale;
      y = y > 0 ? y * scale : y;
    }
    applyOffset({ x, y });
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    setPulling(false);
    springHome(offsetRef.current);
  };

  return (
    <div className="hero-badge">
      <span id="badge-anchor" className="badge-anchor" aria-hidden="true" />
      <div ref={bandRef} className="badge-band" aria-hidden="true" />
      <div className="id-card-stage">
      <div
        className="id-card-mover"
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) rotateX(${4 + offset.y * 0.015}deg) rotateY(${offset.x * -0.035}deg) rotateZ(${offset.x * 0.012}deg)`,
          transformOrigin: "top center",
        }}
      >
      <article
        className={`id-card${pulling ? " is-pulling" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(event) => event.preventDefault()}
      >
        <span ref={jointRef} className="badge-joint" aria-hidden="true" />
        <span className="badge-clip" aria-hidden="true" />
        <span className="badge-clip" aria-hidden="true" />
        <svg className="id-card-traces" viewBox="0 0 220 340" preserveAspectRatio="none" aria-hidden="true">
          <g className="trace-bus">
            <path d="M12 18 H50 L64 32 H94" />
            <path d="M12 24 H47 L61 38 H94" />
            <path d="M12 30 H44 L58 44 H94" />
            <path d="M126 32 H156 L170 18 H208" />
            <path d="M126 38 H159 L173 24 H208" />
            <path d="M126 44 H162 L176 30 H208" />

            <path d="M14 70 V102 H26 V154 H14 V188" />
            <path d="M20 70 V102 H32 V154 H20 V188" />
            <path d="M26 70 V102 H38 V154 H26 V188" />
            <path d="M206 70 V102 H194 V154 H206 V188" />
            <path d="M200 70 V102 H188 V154 H200 V188" />
            <path d="M194 70 V102 H182 V154 H194 V188" />

            <path d="M14 294 V270 H26 V222 H14 V202" />
            <path d="M20 294 V270 H32 V222 H20 V202" />
            <path d="M26 294 V270 H38 V222 H26 V202" />
            <path d="M206 294 V270 H194 V222 H206 V202" />
            <path d="M200 294 V270 H188 V222 H200 V202" />
            <path d="M194 294 V270 H182 V222 H194 V202" />

            <path d="M12 322 H50 L64 308 H94" />
            <path d="M12 316 H47 L61 302 H94" />
            <path d="M12 310 H44 L58 296 H94" />
            <path d="M126 308 H156 L170 322 H208" />
            <path d="M126 302 H159 L173 316 H208" />
            <path d="M126 296 H162 L176 310 H208" />
          </g>
          <g className="trace-pads">
            <rect x="8" y="15" width="7" height="6" />
            <rect x="8" y="21" width="7" height="6" />
            <rect x="8" y="27" width="7" height="6" />
            <rect x="205" y="15" width="7" height="6" />
            <rect x="205" y="21" width="7" height="6" />
            <rect x="205" y="27" width="7" height="6" />
            <rect x="10" y="185" width="8" height="6" />
            <rect x="16" y="185" width="8" height="6" />
            <rect x="22" y="185" width="8" height="6" />
            <rect x="202" y="185" width="8" height="6" />
            <rect x="196" y="185" width="8" height="6" />
            <rect x="190" y="185" width="8" height="6" />
            <rect x="8" y="319" width="7" height="6" />
            <rect x="8" y="313" width="7" height="6" />
            <rect x="8" y="307" width="7" height="6" />
            <rect x="205" y="319" width="7" height="6" />
            <rect x="205" y="313" width="7" height="6" />
            <rect x="205" y="307" width="7" height="6" />
          </g>
          <g className="trace-vias">
            <circle cx="26" cy="102" r="2.4" />
            <circle cx="32" cy="102" r="2.4" />
            <circle cx="38" cy="102" r="2.4" />
            <circle cx="194" cy="102" r="2.4" />
            <circle cx="188" cy="102" r="2.4" />
            <circle cx="182" cy="102" r="2.4" />
            <circle cx="26" cy="270" r="2.4" />
            <circle cx="32" cy="270" r="2.4" />
            <circle cx="38" cy="270" r="2.4" />
            <circle cx="194" cy="270" r="2.4" />
            <circle cx="188" cy="270" r="2.4" />
            <circle cx="182" cy="270" r="2.4" />
          </g>
        </svg>
        <div className="id-card-window">
          <div className="id-card-photo">
            <img src="/badge-portrait.png" alt={SITE_NAME} draggable="false" />
          </div>
        </div>
        <p className="id-card-role">Dev & Ops</p>
      </article>
        {showHint ? (
          <span ref={handRef} className="badge-hint" aria-hidden="true">
            <svg viewBox="0 0 64 64">
              <path d="M24 8c-2.4 0-4 1.8-4 4.2V28c-2.2-1.6-5.4-1.2-7 1-1.6 2.2-1.2 5.2 1 6.8l12.6 10.2c2.2 1.8 5 2.8 8 2.8h4.2c6.4 0 11.2-4.6 11.2-11.2V24.5c0-2.2-1.8-4-4-4s-4 1.8-4 4v-2.2c0-2.2-1.8-4-4-4s-4 1.8-4 4V25c0-2.2-1.8-4-4-4s-4 1.8-4 4V12.2c0-2.4-1.6-4.2-4-4.2Z" />
            </svg>
          </span>
        ) : null}
      </div>
      </div>
    </div>
  );
}

const About = () => {
  return (
    <section className="about-section section-wrap">
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">Portfolio / 2024—present</p>
          <h1>
            {HERO_NAME_LINES[0]}
            <br />
            <span>{HERO_NAME_LINES[1]}</span>
          </h1>
          <p className="hero-summary">
            <span className="hero-summary-line">
              I <span className="hl hl-marker-acid">ship code</span>,
              run it in <span className="hl hl-coral">prod</span>,
            </span>
            <span className="hero-summary-line">
              and love to interact with{" "}
              <span className="hl hl-marker">amazing people</span> in{" "}
              <span className="hl hl-marker-acid">tech</span>.
            </span>
          </p>
        </div>
        <HangingBadge />
        <a className="lime-link" href="#about">
          Scroll to explore <span>↓</span>
        </a>
      </div>

      <div id="about" className="about-copy section-rule">
        <p className="section-kicker">01 / About</p>
        <div>
          <p>
            Hey there! 👋 I'm {SITE_NAME}, a software engineer focused on
            development and operations. I build intelligent software powered by
            AI models and deploy it to production infrastructure — owning the
            full lifecycle from code to deployment to runtime reliability.
          </p>
          <p>
            I approach technology with curiosity and a hands-on, self-directed
            learning style, continually exploring new tools and methods to
            sharpen how I build and operate systems. I'm comfortable working
            close to the infrastructure layer — automating workflows, managing
            deployments, and troubleshooting issues wherever they arise.
          </p>
          <p>
            I love meeting new people and talking about the latest things going
            on in tech at events and gatherings.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;

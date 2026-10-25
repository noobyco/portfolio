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
          <path d="M10 12 H58 L76 28 H118 V14 H168 L190 28 H210" />
          <path d="M14 40 H42 V22 H78 L96 40 H132 V18 H160 V40 H196" />
          <path d="M12 58 H36 L52 42 H88 V58 H124 L142 42 H178 V58 H208" />
          <path d="M10 16 V70 H24 V110 H12 V160 H26 V210 H10 V270 H24 V310" />
          <path d="M210 16 V64 H196 V108 H210 V158 H194 V208 H210 V268 H196 V312" />
          <path d="M28 78 V118 H14 V148 H30 V188 H16 V228 H32 V268" />
          <path d="M192 82 V124 H206 V154 H188 V198 H206 V238 H190 V278" />
          <path d="M18 286 H52 L70 304 H108 V286 H150 L168 304 H202" />
          <path d="M24 312 H48 V296 H80 L98 314 H140 V296 H172 L190 314 H206" />
          <path d="M40 328 H72 V316 H110 V330 H148 V316 H184 V330" />
          <circle cx="10" cy="12" r="2.4" />
          <circle cx="210" cy="12" r="2.4" />
          <circle cx="14" cy="40" r="2.2" />
          <circle cx="196" cy="40" r="2.2" />
          <circle cx="12" cy="58" r="2.2" />
          <circle cx="208" cy="58" r="2.2" />
          <circle cx="10" cy="160" r="2.2" />
          <circle cx="210" cy="158" r="2.2" />
          <circle cx="10" cy="270" r="2.2" />
          <circle cx="210" cy="268" r="2.2" />
          <circle cx="18" cy="286" r="2.2" />
          <circle cx="202" cy="286" r="2.2" />
          <circle cx="40" cy="328" r="2.2" />
          <circle cx="184" cy="330" r="2.2" />
          <rect x="72" y="328" width="10" height="6" />
          <rect x="110" y="328" width="10" height="6" />
          <rect x="148" y="328" width="10" height="6" />
        </svg>
        <div className="id-card-window">
          <img src="/profilex.jpg" alt={SITE_NAME} draggable="false" />
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

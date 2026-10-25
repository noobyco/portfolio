import { HERO_NAME_LINES, SITE_NAME } from "../site.config";

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
        <div className="hero-portrait">
          <img src="/profilex.png" alt={SITE_NAME} />
          <span className="portrait-label">
            Development
            <br />& Operations
          </span>
        </div>
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

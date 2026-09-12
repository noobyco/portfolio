const About = () => {
  return (
    <section className="about-section section-wrap">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Portfolio / 2024—present</p>
          <h1>
            Shekh Md
            <br />
            <span>Moinuddin</span>
          </h1>
          <p className="hero-summary">
            I ship code, run it in prod, and love to interact with amazing
            people in tech.
          </p>
          <a className="lime-link" href="#about">
            Scroll to explore <span>↓</span>
          </a>
        </div>
        <div className="hero-portrait">
          <img src="/profilex.png" alt="Shekh Md Moinuddin" />
          <span className="portrait-label">
            Development
            <br />& Operations
          </span>
        </div>
      </div>

      <div id="about" className="about-copy section-rule">
        <p className="section-kicker">01 / About</p>
        <div>
          <p>
            Hey there! 👋 I'm Shekh Md Moinuddin, a software engineer focused on
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

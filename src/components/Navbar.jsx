"use client";
import { useState } from "react";
import { SITE_INITIALS } from "../site.config";
import { RxCross1 } from "react-icons/rx";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
const Navbar = (props) => {
  const [btnState, setBtnState] = useState(false);

  return (
    <nav className="site-nav">
      <div className="brand-lockup">
        <a href="/" className="brand-mark">
          {SITE_INITIALS}
        </a>
        <a className="crumb" href="/">
          / {props.urlx}
        </a>
      </div>

      <div className="desktop-links">
        <a href="/">About</a>
        <a href="/projects">Projects</a>
        <a href="/talks">Talks</a>
        <a href="/blogs">Blogs</a>
      </div>

      <div className="mobile-toggle">
        <button
          aria-label="Toggle navigation"
          onClick={() => setBtnState((prevStateBtn) => !prevStateBtn)}
        >
          {btnState ? <RxCross1 size={24} /> : <HiOutlineMenuAlt3 size={24} />}
        </button>
      </div>
      {btnState ? (
        <div className="mobile-menu">
          <a href="/">About</a>
          <a href="/projects">Projects</a>
          <a href="/talks">Talks</a>
          <a href="/blogs">Blogs</a>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;

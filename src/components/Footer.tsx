import { PROFILE } from '../data';
import { sfx } from '../sound';
import SanblueWordmark from './SanblueWordmark';

export default function Footer() {
  return (
    <footer className="footer crt-fx">
      <div>
        <div className="footer__name">✨ {PROFILE.name} • {PROFILE.title}</div>
        <p className="footer__sub">
          Business Administration student at UTEL (expected 2029), combining hospitality experience
          with ongoing Python and AI Builder learning. Built with React, GSAP & Three.js.
        </p>
      </div>
      <div className="footer__host">
        Hosting: Firebase
        <br />
        sanbluedot.com
      </div>
      <button
        className="footer__top"
        onClick={() => {
          sfx.coin();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        ▲ BACK TO TOP
      </button>
      <div className="footer__sig">
        <SanblueWordmark tagline />
        <span className="footer__copy">© 2026 Sandy E. Quintero</span>
      </div>
    </footer>
  );
}

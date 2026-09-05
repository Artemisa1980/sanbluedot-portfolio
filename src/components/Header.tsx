import { useEffect, useState } from 'react';
import { PROFILE } from '../data';
import { sfx, setMuted, isMuted } from '../sound';
import SanblueWordmark from './SanblueWordmark';
import SanblueBadge from './SanblueBadge';

const NAV = [
  { href: '#arcade', label: './arcade' },
  { href: '#reception', label: './about' },
  { href: '#experience', label: './resume' },
  { href: '#analytics', label: './analytics' },
  { href: '#tv', label: './tv' },
  { href: '#mail', label: './mail' },
];

export default function Header() {
  const [now, setNow] = useState(new Date());
  const [shrunk, setShrunk] = useState(false);
  const [mute, setMute] = useState(isMuted());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    const onScroll = () => setShrunk(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearInterval(clock);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const clock = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });
  const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  const clockLabel = `Local time: ${now.toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZoneName: 'short',
  })}`;

  return (
    <header className={`header ${shrunk ? 'header--shrunk' : ''}`}>
      <div className="header__identity">
        <SanblueBadge className="header__logo" interactive />
        <div className="header__id">
          <span className="header__name">
            {PROFILE.handle} <span className="header__ver">{PROFILE.version}</span>
          </span>
          <span className="header__sub">{PROFILE.subtitle}</span>
          <SanblueWordmark className="header__brand" />
        </div>
      </div>
      <nav className={`header__nav${menuOpen ? ' header__nav--open' : ''}`} id="header-nav">
        {NAV.map((n) => (
          <a
            key={n.href}
            href={n.href}
            className="header__link term"
            onClick={() => {
              sfx.click();
              setMenuOpen(false);
            }}
          >
            {n.label}
          </a>
        ))}
      </nav>
      <div className="header__tools">
        {/* only visible at ≤900px, where the nav is collapsed */}
        <button
          className="header__icon-btn header__menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="header-nav"
          onClick={() => {
            sfx.click();
            setMenuOpen((open) => !open);
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <time className="header__clock" dateTime={now.toISOString()} aria-label={clockLabel} title={clockLabel}>
          <span className="header__clock-screen" aria-hidden="true">
            <span className="header__clock-led" />
            <span className="header__clock-time">{clock}</span>
            <span className="header__clock-date">{weekday} · {date}</span>
          </span>
        </time>
        <a
          className="header__icon-btn"
          href={PROFILE.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          onClick={() => sfx.click()}
        >
          in
        </a>
        <button
          className="header__icon-btn"
          aria-label={mute ? 'Unmute sounds' : 'Mute sounds'}
          onClick={() => {
            const next = !mute;
            setMuted(next);
            setMute(next);
            if (!next) sfx.coin();
          }}
        >
          {mute ? '🔇' : '🔊'}
        </button>
      </div>
    </header>
  );
}

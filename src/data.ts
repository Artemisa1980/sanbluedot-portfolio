export const PROFILE = {
  name: 'Sandy E. Quintero',
  handle: 'SANDY.SYSDEV',
  version: 'v2.0',
  title: 'Retail & Hospitality Operations to AI Builder',
  subtitle: 'UTEL BBA Student & AI Builder',
  tagline:
    '20+ years in U.S. retail and hospitality operations, now combining a UTEL BBA path with Python, AI-assisted workflows, and interactive web projects.',
  location: 'Daule, Ecuador',
  email: 'sayma29@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sandy-e-q-30171254',
  bio: 'I am an operations professional with 20+ years working for U.S. brands — Starbucks, JW Marriott, Hilton, and Holiday Inn — in high-volume retail and hospitality environments. My experience spans team supervision, inventory and supplies control, quality standards, staff training, customer experience, and daily financial reporting. Now based in Ecuador, I am pursuing a BBA in Administration & Finance at UTEL while building practical AI-assisted workflows and interactive web projects.',
  quote: 'Hospitality teaches operational empathy, while code breeds structured logic.',
  languages: [
    { name: 'Spanish', level: 'Native / Bilingual' },
    { name: 'English', level: 'Full Professional' },
  ],
};

export interface GameInfo {
  id: string;
  title: string;
  description: string;
  icon: string;
  ready: boolean;
}

export const GAMES: GameInfo[] = [
  {
    id: 'pac-toe',
    title: 'Pac-Toe: Neon Arcade',
    description:
      'Three sectors (3×3, 5×5, 7×7), six levels each — outline Ghosty, capture ghost coins, customize your Pac. Press START!',
    icon: '🕹️',
    ready: true,
  },
  {
    id: 'stranger-pac',
    title: 'Stranger Pac-Man',
    description:
      'Guide Eleven through the Upside Down maze. Demogorgons hunt in the dark — waffles restore your power.',
    icon: '🧇',
    ready: false,
  },
  {
    id: 'space-race',
    title: 'Galactic Speedway',
    description:
      'Race starfighters through asteroid fields in a galaxy far, far away. Six sectors, rising speed.',
    icon: '🚀',
    ready: false,
  },
  {
    id: 'barista',
    title: 'Starbucks Retro Barista',
    description:
      'Interactive tribute to 11+ years of coffee craft. Brew cappuccinos and lattes against the clock.',
    icon: '☕️',
    ready: false,
  },
  {
    id: 'octo-catcher',
    title: 'GitHub Octo-Catcher',
    description:
      'Manage a Git branch to catch commits and avoid merge conflicts.',
    icon: '🐙',
    ready: false,
  },
];

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  duration?: string;
  location: string;
  icon: string;
  bullets: string[];
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'starbucks',
    company: 'Starbucks Coffee Company',
    role: 'Barista',
    period: '2013 — 2025',
    duration: '11+ yrs',
    location: 'Miami, FL, USA',
    icon: '☕️',
    bullets: [
      'Ran peak-hour operations in a high-volume store while maintaining quality, speed, cleanliness, and safety standards.',
      'Trained and guided new partners, demonstrating strong leadership potential.',
      'Built customer loyalty through consistent service for more than 11 years.',
    ],
  },
  {
    id: 'marriott',
    company: 'JW Marriott Hotel & Marriott Executive Apartments',
    role: 'AM Supervisor',
    period: '2011 — 2013',
    location: 'Miami, FL (Brickell), USA',
    icon: '🏨',
    bullets: [
      'Supervised a morning housekeeping team of 8–10 room attendants, assigning tasks and inspecting rooms and public areas.',
      'Managed supplies and inventory while coordinating with the front desk and maintenance.',
      'Trained new team members on safety, brand standards, and cleaning protocols.',
    ],
  },
  {
    id: 'hilton',
    company: 'Hilton Worldwide',
    role: 'Night Auditor',
    period: '2008 — 2010',
    location: 'Ocean City, MD, USA',
    icon: '🌙',
    bullets: [
      'Audited and closed daily financial activity across all departments in Hilton OnQ, preparing reports for management.',
      'Ran the overnight front desk independently and handled emergencies according to protocol.',
    ],
  },
  {
    id: 'pax',
    company: 'Pax Wholesome Foods',
    role: 'Barista · Cash Handling',
    period: '2007',
    location: 'New York, NY, USA',
    icon: '🗽',
    bullets: [
      'Handled barista service and cash transactions in a New York food-service setting.',
    ],
  },
  {
    id: 'outback',
    company: 'Outback Steakhouse',
    role: 'Line Cook',
    period: '2004 — 2006',
    location: 'Ocean City, MD, USA',
    icon: '🔥',
    bullets: [
      'Worked grill, fry, and salad stations while coordinating evening tickets.',
    ],
  },
  {
    id: 'popeyes',
    company: 'Popeyes',
    role: 'Cashier',
    period: '2004 — 2005',
    location: 'Ocean City, MD, USA',
    icon: '🧾',
    bullets: [
      'Handled cashier duties during evening shifts.',
    ],
  },
  {
    id: 'holiday-inn',
    company: 'Holiday Inn Hotel & Suites',
    role: 'Room Service & Housekeeping',
    period: '2003 — 2007',
    location: 'Ocean City, MD, USA',
    icon: '🛎️',
    bullets: [
      'Supported room service and housekeeping operations in a U.S. hotel environment.',
    ],
  },
];

export interface Skill {
  name: string;
  level: number;
  category: 'Tech' | 'Hospitality' | 'Soft Skills';
}

export const SKILLS: Skill[] = [
  { name: 'Git & GitHub Version Control', level: 90, category: 'Tech' },
  { name: 'AI Builder & Web Core', level: 65, category: 'Tech' },
  { name: 'Python Scripting Explorer', level: 70, category: 'Tech' },
  { name: 'Creative AI & Prompt Engineering', level: 95, category: 'Tech' },
  { name: 'Guest Experience Excellence', level: 100, category: 'Hospitality' },
  { name: 'Operation Logistics & Supervision', level: 90, category: 'Hospitality' },
  { name: 'Active Listening & Connection', level: 100, category: 'Soft Skills' },
  { name: 'Leadership & Partner Mentoring', level: 95, category: 'Soft Skills' },
];

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  icon: string;
  /** scan of the real certificate (public/certs/) — shown + zoomable in the VAULT */
  image?: string;
  /** issuer's public verification URL (printed on the certificate) */
  verify?: string;
}

/* years + issuers + verify URLs taken from the actual certificate documents (07-23) */
export const CERTIFICATIONS: Certification[] = [
  { id: 'git', name: 'Getting Started with Git and GitHub', issuer: 'IBM / Coursera', year: '2026', icon: '🐙', image: '/certs/git.webp', verify: 'https://coursera.org/verify/O1RP4U5OS1K3' },
  { id: 'gai', name: 'Google AI Professional Certificate', issuer: 'Google', year: '2026', icon: '✨', image: '/certs/gai.webp', verify: 'https://coursera.org/verify/professional-cert/LLOXF3UICPUM' },
  { id: 'prompt', name: 'Google Prompting Essentials Specialization', issuer: 'Google', year: '2026', icon: '🧠', image: '/certs/prompt.webp', verify: 'https://coursera.org/verify/specialization/JHFBURP7QBVZ' },
  { id: 'python', name: 'Programming for Everybody (Python)', issuer: 'Univ. of Michigan / Coursera', year: '2026', icon: '🐍', image: '/certs/python.webp', verify: 'https://coursera.org/verify/MUH72OQ8ZI89' },
  { id: 'excel', name: 'Excel Skills for Business: Essentials', issuer: 'Macquarie University / Coursera', year: '2026', icon: '📊', image: '/certs/excel.webp', verify: 'https://coursera.org/verify/SVHA7SJ99PYH' },
];

export const EDUCATION = [
  { id: 'ibm-cert', institution: 'IBM Academy', degree: 'AI Builder Developer Course', period: 'Active Path' },
  { id: 'utel', institution: 'UTEL Universidad', degree: 'BBA, Administration & Finance', period: 'Online · In progress · 2025—2029' },
  { id: 'worwic', institution: 'Wor-Wic Community College', degree: 'Hotel, Motel & Restaurant Management coursework', period: 'Part-time · Not completed · 2008—2010' },
  { id: 'ucsg', institution: 'Universidad Católica de Santiago de Guayaquil', degree: 'Business Management studies (Ing. Gestión Empresarial)', period: 'Part-time · Not completed · 2001—2003' },
];

export interface TVChannel {
  id: number;
  title: string;
  genre: string;
  length: string;
  icon: string;
  synopsis: string;
  /** Short label printed on the VHS cassette sticker in the film-archive shelf. */
  tape: string;
  /** Optional video URL/file. When set, it plays inside the CRT; otherwise the program card shows. */
  videoSrc?: string;
}

export const TV_CHANNELS: TVChannel[] = [
  {
    id: 1,
    title: 'sanblueᵈᵒᵗ Station Intro — Cat-Bot',
    genre: 'Brand Short · sanblueᵈᵒᵗ',
    length: '~0:21 min',
    icon: '🐱',
    synopsis:
      'The station mascot takes the screen: Cat-Bot boots up the sanblueᵈᵒᵗ retro dev-station and rolls the opening transmission. First tape in the archive — more films are on the way.',
    tape: 'CAT-BOT INTRO',
    videoSrc: '/videos/cat-bot-intro.mp4',
  },
  {
    id: 2,
    title: 'The AI Robot Race and Its Hidden Cost',
    genre: 'Research Film · sanblueᵈᵒᵗ',
    length: '~1:30 min',
    icon: '🤖',
    synopsis:
      'A wordless retro-futurist short for the published research. One small salvager robot, DOT, wanders mountains of discarded humanoids and recovers the single rare-earth magnet the world fought to mine — the one we throw away. We made the trash, and the salvager too.',
    tape: 'AI ROBOT RACE',
    // videoSrc: 'https://…'  // ← drop the finished research video URL/file here to play it in the CRT
  },
  {
    id: 3,
    title: 'Coming Soon',
    genre: 'Transmission Pending',
    length: '—',
    icon: '📡',
    synopsis: 'A new transmission is being recorded. Stay tuned.',
    tape: 'BLANK TAPE',
  },
  {
    id: 4,
    title: 'Coming Soon',
    genre: 'Transmission Pending',
    length: '—',
    icon: '📡',
    synopsis: 'A new transmission is being recorded. Stay tuned.',
    tape: 'BLANK TAPE',
  },
];

// Illustrative entries, not repository history. Short one-line messages: the console must not wrap,
// so the GH card and the mail terminal close at the same height
export const DEMO_COMMITS = [
  { date: '2025-08-10 14:32:01', hash: 'commit-8a1bf2', msg: 'docs: init retro portfolio' },
  { date: '2025-08-15 09:15:33', hash: 'commit-4e9d7c', msg: 'feat: start UTEL BBA track' },
  { date: '2025-11-20 18:22:11', hash: 'commit-3c5f2b', msg: 'study: IBM Full Stack path' },
  { date: '2026-02-22 11:05:40', hash: 'commit-7d4e3a', msg: 'feat: Google Prompting cert' },
  { date: '2026-05-24 16:40:00', hash: 'commit-9b2c1d', msg: 'feat: git + arcade cabinet' },
  { date: '2026-06-11 10:08:27', hash: 'commit-e5a8f0', msg: 'feat: ship Dev-Station v2.0' },
];

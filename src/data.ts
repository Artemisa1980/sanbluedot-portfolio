export const PROFILE = {
  name: 'Sandy E. Quintero',
  handle: 'SANDY.SYSDEV',
  version: 'v2.0',
  title: 'From Starbucks Barista to Retro DeV',
  subtitle: 'UTEL BBA Student & AI Builder Apprentice',
  tagline:
    "Born in the '80s, tech enthusiast, combining 20+ years of customer service & hospitality leadership with active Python and AI Builder learning paths.",
  location: 'Daule, Ecuador',
  email: 'sayma29@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sandy-e-q-30171254',
  bio: 'I am a passionate operations professional who spent 20+ years with U.S. brands — Starbucks, JW Marriott, Hilton, and Holiday Inn — leading guest experiences in high-volume environments. Today, I fuse my absolute attention to detail and proactive problem-solving with AI Builder and retro web development. Currently pursuing a Business Administration & Finance degree at UTEL and an active AI Builder learning path, I construct interactive systems to demonstrate my growth and analytical capabilities.',
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
  duration: string;
  location: string;
  icon: string;
  bullets: string[];
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'starbucks',
    company: 'Starbucks',
    role: 'Barista',
    period: 'Sep 2013 — Jun 2025',
    duration: '11 yrs 10 mos',
    location: 'Miami, FL, USA',
    icon: '☕️',
    bullets: [
      'Crafted premium specialty beverages with high consistency in fast-paced, high-volume retail environments.',
      'Cultivated genuine loyalty by memorizing personal preferences of hundreds of recurring guests.',
      'Onboarded and trained dozens of new partners, enforcing operational standards and safety best practices.',
      'Continuously recognized for an outstanding positive attitude and strong leadership potential.',
    ],
  },
  {
    id: 'marriott',
    company: 'JW Marriott Hotel & Executive Apartments',
    role: 'AM Housekeeping Supervisor',
    period: 'Sep 2010 — May 2012',
    duration: '1 yr 9 mos',
    location: 'Miami, FL, USA',
    icon: '🏨',
    bullets: [
      'Supervised a morning housekeeping team of 8–10 room attendants to JW Marriott five-star luxury expectations, leading dedicated 6–8 person crews for VIP room turnovers.',
      'Coordinated directly with front desk management and maintenance to respond instantly to guest issues.',
      'Delivered brand orientation and structured safety training schedules for all new team members.',
    ],
  },
  {
    id: 'hilton',
    company: 'Hilton Worldwide',
    role: 'Night Auditor',
    period: 'Feb 2008 — Apr 2010',
    duration: '2 yrs 3 mos',
    location: 'Ocean City, MD, USA',
    icon: '🌙',
    bullets: [
      'Managed overnight front office operations, balancing daily accounts and closing system-wide financial logs.',
      'Provided high-standard guest services to late-night arrivals and handled emergency protocols calmly.',
    ],
  },
  {
    id: 'pax',
    company: 'Pax Wholesome Foods',
    role: 'Barista & Cashier',
    period: 'Aug 2007 — Dec 2007',
    duration: '5 mos',
    location: 'New York, NY, USA',
    icon: '🗽',
    bullets: [
      'Delivered fast, high-quality beverage service in a high-traffic Manhattan gourmet café environment.',
      'Audited registers, processed complex cash & card transactions, and supported team layout shifts.',
    ],
  },
  {
    id: 'holiday-inn',
    company: 'Holiday Inn Hotel & Suites',
    role: 'Room Service & Housekeeping',
    period: 'Oct 2003 — 2007',
    duration: '~4 yrs',
    location: 'Ocean City, MD, USA',
    icon: '🛎️',
    bullets: [
      'First role with a U.S. hospitality brand — ran room service and housekeeping operations to brand standards.',
      'The starting point of 20+ years of continuous U.S. customer-service experience.',
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

export const CERTIFICATIONS = [
  { id: 'ibm', name: 'AI Builder Professional Certificate', issuer: 'IBM / Coursera', year: 'In Progress', icon: '🌐' },
  { id: 'git', name: 'Getting Started with Git and GitHub', issuer: 'Google / Coursera', year: '2025', icon: '🐙' },
  { id: 'gai', name: 'Google AI Professional Certificate', issuer: 'Google', year: '2025', icon: '✨' },
  { id: 'prompt', name: 'Google Prompting Essentials Specialization', issuer: 'Google', year: '2025', icon: '🧠' },
  { id: 'python', name: 'Programming for Everybody (Python)', issuer: 'Univ. of Michigan / Coursera', year: '2025', icon: '🐍' },
  { id: 'excel', name: 'Excel Skills for Business: Essentials', issuer: 'Macquarie University / Coursera', year: '2024', icon: '📊' },
];

export const EDUCATION = [
  { id: 'ibm-cert', institution: 'IBM Academy', degree: 'AI Builder Developer Course', period: 'Active Path' },
  { id: 'utel', institution: 'UTEL Universidad', degree: 'Bachelor of Business Administration (BBA)', period: '2025 — Expected 2029' },
  { id: 'worwic', institution: 'Wor-Wic Community College', degree: 'Hotel, Motel & Restaurant Management', period: '2008 — 2010' },
  { id: 'ucsg', institution: 'U. Católica de Santiago de Guayaquil', degree: 'Business Management (Initial Studies)', period: '2001 — 2003' },
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
    title: 'The AI Robot Race and Its Hidden Cost',
    genre: 'Research Film · sanblueᵈᵒᵗ',
    length: '~1:30 min',
    icon: '🤖',
    synopsis:
      'A wordless retro-futurist short for the published research. One small salvager robot, DOT, wanders mountains of discarded humanoids and recovers the single rare-earth magnet the world fought to mine — the one we throw away. We made the trash, and the salvager too.',
    tape: 'AI ROBOT RACE',
    // videoSrc: 'https://…'  // ← drop the finished video URL/file here to play it in the CRT
  },
  {
    id: 2,
    title: 'Coming Soon',
    genre: 'Transmission Pending',
    length: '—',
    icon: '📡',
    synopsis: 'A new transmission is being recorded. Stay tuned.',
    tape: 'BLANK TAPE',
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

// short one-line messages on purpose (Sandy 07-16): the console must not wrap,
// so the GH card and the mail terminal close at the same height
export const COMMITS = [
  { date: '2025-08-10 14:32:01', hash: 'commit-8a1bf2', msg: 'docs: init retro portfolio' },
  { date: '2025-08-15 09:15:33', hash: 'commit-4e9d7c', msg: 'feat: start UTEL BBA track' },
  { date: '2025-11-20 18:22:11', hash: 'commit-3c5f2b', msg: 'study: IBM Full Stack path' },
  { date: '2026-02-22 11:05:40', hash: 'commit-7d4e3a', msg: 'feat: Google Prompting cert' },
  { date: '2026-05-24 16:40:00', hash: 'commit-9b2c1d', msg: 'feat: git + arcade cabinet' },
  { date: '2026-06-11 10:08:27', hash: 'commit-e5a8f0', msg: 'feat: ship Dev-Station v2.0' },
];

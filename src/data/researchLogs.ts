export interface ResearchLog {
  id: string;
  number: string;
  title: string;
  legend: string;
  status: 'live' | 'coming-soon';
  /** If set, a "WATCH IN STUDIO" button scrolls to the TV Studio and tunes to this channel id. */
  studioChannelId?: number;
  links?: { html: string; pdf: string; doi: string; video?: string };
  financials?: {
    bomCost: { from: number; to: number; fromYear: number; toYear: number; source: string };
    valuations: Array<{ name: string; amountB: number; asOf: string; source: string }>;
  };
}

export const researchLogs: ResearchLog[] = [
  {
    id: 'ai-robot-race',
    number: '01',
    title: 'The AI Robot Race and Its Hidden Cost',
    legend:
      'A 10-year outlook on the US–China humanoid race — and what getting them built costs us later.',
    status: 'live',
    studioChannelId: 1,
    links: {
      html: 'https://artemisa1980.github.io/ai-robot-race/',
      pdf: 'https://artemisa1980.github.io/ai-robot-race/The-AI-Robot-Race-and-Its-Hidden-Cost.pdf',
      doi: 'https://doi.org/10.5281/zenodo.20754384',
    },
    financials: {
      bomCost: { from: 35000, to: 17000, fromYear: 2025, toYear: 2030, source: 'BofA Global Research' },
      valuations: [
        { name: 'Figure AI', amountB: 39, asOf: 'Sep 2025', source: 'Figure AI Series C' },
        { name: 'Physical Intelligence', amountB: 5.6, asOf: 'Nov 2025', source: 'Bloomberg' },
        { name: 'Apptronik', amountB: 5.5, asOf: '2026', source: 'Crunchbase News' },
      ],
    },
  },
  {
    id: 'cars-consumerism',
    number: '02',
    title: 'Cars & the Age of Consumerism',
    legend: 'The automobile as a living example of consumer culture — manufacture and marketing.',
    status: 'coming-soon',
  },
  {
    id: 'microplastics',
    number: '03',
    title: 'Microplastics',
    legend: 'The environmental and health angle, mined from institutional reports.',
    status: 'coming-soon',
  },
  {
    id: 'company-case-study',
    number: '04',
    title: 'Company Case Study (e.g. Intel)',
    legend: "A company's trajectory read through its market history.",
    status: 'coming-soon',
  },
];

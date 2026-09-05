export interface ResearchLog {
  id: string;
  number: string;
  title: string;
  legend: string;
  status: 'live' | 'coming-soon';
  /** Target channel; the archive only offers playback when a video is configured. */
  studioChannelId?: number;
  links?: { html: string; pdf: string; doi: string; video?: string };
  topics?: string[];
  queue?: {
    status: 'TOPIC RESERVED' | 'SUBJECT OPEN';
    next: string;
  };
  analysis?: {
    thesis: string;
    findings: { title: string; body: string; view: 'costs' | 'capital' | 'lifecycle' }[];
    components: { name: string; share: number; motion?: boolean }[];
    lifecycle: { name: string; status: string; title: string; detail: string; chapter: string }[];
  };
  financials?: {
    bomCost: { from: number; to: number; fromYear: number; toYear: number; source: string; sourceUrl: string };
    valuations: Array<{ name: string; amountB: number; asOf: string; source: string; sourceUrl: string; role: string }>;
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
    topics: ['Robotics', 'Economics', 'Circularity'],
    analysis: {
      thesis: 'The race is built to acquire robots. What will it take to keep them?',
      findings: [
        { title: 'The cost of motion', body: 'Actuators and hands dominate the projected parts bill.', view: 'costs' },
        { title: 'Capital has a clock', body: 'Private valuations reveal the scale of the bet, not operating profit.', view: 'capital' },
        { title: 'The missing half', body: 'Reliability, upgrades and recovery need attention beyond the launch.', view: 'lifecycle' },
      ],
      components: [
        { name: 'Linear actuators', share: 27, motion: true },
        { name: 'Rotary actuators', share: 24, motion: true },
        { name: 'Dexterous hands', share: 19, motion: true },
        { name: 'Other parts', share: 12 },
        { name: 'Control system', share: 10 },
        { name: 'Vision & sensors', share: 4 },
        { name: 'Energy system', share: 4 },
      ],
      lifecycle: [
        { name: 'Build', status: 'Projection', title: 'A body made of costs', detail: 'The research follows a falling parts bill. Cheaper components do not establish the full cost of owning a finished robot.', chapter: '02-economics-of-a-humanoid' },
        { name: 'Fund', status: 'Reported snapshots', title: 'Who pays for the first step?', detail: 'Private capital and state-backed funding pursue different time horizons. A company valuation and a national fund are different measures.', chapter: '03-capital-investment' },
        { name: 'Source', status: 'Research finding', title: 'The materials behind the machine', detail: 'Chips, magnets and supply chains connect the robot to a much larger industrial system. The report examines those dependencies.', chapter: '05-trade-tariffs' },
        { name: 'Deploy', status: 'Research finding', title: 'A workplace is not a demo', detail: 'The report connects adoption to labor needs and aging populations. Industrial robot density is context, not a count of humanoids.', chapter: '06-adoption-generational' },
        { name: 'Run', status: 'Evidence gap', title: 'How long will it keep working?', detail: 'The research identifies missing disclosed humanoid reliability data at its source cutoff. Battery runtime is not time between failures.', chapter: '04-reliability-gap' },
        { name: 'Outdate', status: 'Research argument', title: 'Two clocks in one body', detail: 'Fast AI upgrades and longer-lived mechanical parts may pull in different directions. Modular upgrades are a design opportunity, not a guaranteed lifespan.', chapter: '07-fast-hardware' },
        { name: 'Discard', status: 'Evidence gap', title: 'Where does the body go?', detail: 'Global e-waste figures describe the wider problem. The report does not establish a measured, robot-specific waste total.', chapter: '08-ewaste-wave' },
        { name: 'Recover', status: 'Design opportunity', title: 'Make the loop possible', detail: 'Repairable modules, disassembly and take-back systems can change the ending. Industrial remanufacturing results cannot simply be assigned to humanoids.', chapter: '09-circular-economy' },
      ],
    },
    studioChannelId: 2, /* intro film took CH_01 (07-17) */
    links: {
      html: 'https://artemisa1980.github.io/ai-robot-race/',
      pdf: 'https://artemisa1980.github.io/ai-robot-race/The-AI-Robot-Race-and-Its-Hidden-Cost.pdf',
      doi: 'https://doi.org/10.5281/zenodo.20754384',
    },
    financials: {
      bomCost: { from: 35000, to: 17000, fromYear: 2025, toYear: 2030, source: 'BofA Global Research · Mar 2026', sourceUrl: 'https://institute.bankofamerica.com/content/dam/transformation/physical-ai-part-2.pdf' },
      valuations: [
        { name: 'Figure AI', amountB: 39, asOf: 'Sep 2025', source: 'Figure AI Series C', sourceUrl: 'https://www.figure.ai/news/series-c', role: 'Humanoid hardware + AI' },
        { name: 'Physical Intelligence', amountB: 5.6, asOf: 'Nov 2025', source: 'Bloomberg', sourceUrl: 'https://www.bloomberg.com/news/articles/2025-11-20/robotics-startup-physical-intelligence-valued-at-5-6-billion-in-new-funding', role: 'Robot foundation models' },
        { name: 'Apptronik', amountB: 5.5, asOf: 'Feb 2026', source: 'Bloomberg via Yahoo Finance', sourceUrl: 'https://finance.yahoo.com/news/apptronik-raises-520-million-5-192431461.html', role: 'Apollo humanoid' },
      ],
    },
  },
  {
    id: 'cars-consumerism',
    number: '02',
    title: 'Cars & the Age of Consumerism',
    legend: 'The automobile as a living example of consumer culture — manufacture and marketing.',
    status: 'coming-soon',
    queue: { status: 'TOPIC RESERVED', next: 'Frame the research question' },
  },
  {
    id: 'microplastics',
    number: '03',
    title: 'Microplastics',
    legend: 'The environmental and health angle, mined from institutional reports.',
    status: 'coming-soon',
    queue: { status: 'TOPIC RESERVED', next: 'Define the evidence scope' },
  },
  {
    id: 'company-case-study',
    number: '04',
    title: 'Company Case Study',
    legend: "A company's trajectory read through its market history. The subject remains open.",
    status: 'coming-soon',
    queue: { status: 'SUBJECT OPEN', next: 'Select the company' },
  },
];

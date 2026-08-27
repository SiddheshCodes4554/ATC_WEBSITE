export interface EventStat {
  label: string;
  value: string;
  emoji: string;
}

export interface MissionStage {
  step: string;
  title: string;
  desc: string;
  iconName: string;
}

export interface HighlightItem {
  id: string;
  title: string;
  caption: string;
  type: 'polaroid' | 'sticky' | 'screenshot' | 'quote';
  badge?: string;
  color?: string;
  rotation?: string;
  imgUrl?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  tapeColor?: string;
  rotation?: string;
  aspect?: string;
  category: string;
  svgSceneType: 'hacking' | 'presentation' | 'laughing' | 'judging' | 'trophy' | 'chaos-code';
  imgUrl?: string;
}

export interface LearningItem {
  title: string;
  tagline: string;
  desc: string;
  emoji: string;
  color: string;
  badge: string;
}

export interface WinnerProject {
  title: string;
  badge: string;
  badgeColor: string;
  team: string[];
  desc: string;
  tech: string[];
  mockupType: 'runaway-btn' | 'win93' | 'shouting-slider' | 'tos-wordsearch';
}

export interface EventQuote {
  quote: string;
  author: string;
  role: string;
  color: string;
  rotation: string;
}

export interface DetailedEvent {
  id: string;
  title: string;
  category: 'HACKATHON' | 'WORKSHOP' | 'TECH SESSION' | 'COMPETITION';
  tagline: string;
  date: string;
  venue: string;
  organizedBy: string;
  eventType: string;
  heroTheme: {
    accentColor: string;
    badgeBg: string;
    bgPattern: string;
  };
  stats: EventStat[];
  about: {
    heading: string;
    subheading: string;
    paragraphs: string[];
    pullQuote: string;
    stickyNote: string;
  };
  mission: MissionStage[];
  highlights: HighlightItem[];
  gallery: GalleryPhoto[];
  learnings: LearningItem[];
  winners: WinnerProject[];
  quotes: EventQuote[];
  coverUrl?: string;
}

export const eventsArchive: Record<string, DetailedEvent> = {
  'worst-ui-ux': {
    id: 'worst-ui-ux',
    title: 'WORST UI/UX HACKATHON',
    category: 'HACKATHON',
    tagline: 'Break every UX rule possible.',
    date: '13 December 2025',
    venue: 'Lab 5.0, NIAT Pune',
    organizedBy: 'Advanced Tech Club • NIAT Pune',
    eventType: '4-Hour Creative Chaos Hackathon',
    coverUrl: '/events/worst-ui-ux-poster.png',
    heroTheme: {
      accentColor: '#FF6B6B',
      badgeBg: 'bg-[#FF6B6B]',
      bgPattern: 'bg-[#FAF7F0]',
    },
    stats: [
      { label: 'Participants', value: '80+', emoji: '👥' },
      { label: 'Chaos Sprints', value: '3 Hours', emoji: '⏱' },
      { label: 'Crazy Interfaces', value: '20+', emoji: '💻' },
      { label: 'Podium Teams', value: '4 Teams', emoji: '🏆' },
      { label: 'Pizzas Devoured', value: '40+', emoji: '🍕' },
      { label: 'UX Errors Triggered', value: '999+', emoji: '⚠️' },
    ],
    about: {
      heading: 'WHAT WAS THIS ALL ABOUT?',
      subheading: 'Why build clean software when you can engineer pure creative madness?',
      paragraphs: [
        'In every software engineering syllabus, students are taught how to design intuitive, clean, and seamless user experiences. We wanted to flip that completely on its head.',
        'The Worst UI/UX Hackathon challenged 80+ builders across NIAT Pune to intentionally violate every rule in the Human Interface Guidelines: unclickable buttons, backward progress bars, inverted scroll mechanics, Comic Sans typography, and multi-step captchas written in ancient languages.',
        'By forcing students to deconstruct what makes software frustrating, they walked away with a profound, deep appreciation for intuitive product design, animation timing, and cognitive psychology.',
      ],
      pullQuote: 'Instead of designing a good user experience... we challenged students to engineer the absolute WORST one.',
      stickyNote: '💡 To master the rules of great UI, you first have to break every single one of them with joy!',
    },
    mission: [
      {
        step: '01',
        title: 'Form a Squad',
        desc: 'Gather 2-4 fearless builders, designers, and frontend chaos agents.',
        iconName: 'users',
      },
      {
        step: '02',
        title: 'Receive The Theme',
        desc: 'Draw a cursed prompt: "E-Commerce Checkout from Hell" or "Impossible Flight Booker".',
        iconName: 'dices',
      },
      {
        step: '03',
        title: 'Break Every UX Rule',
        desc: 'Reverse hover states, disable right clicks, randomize color contrast, and build runaway buttons.',
        iconName: 'bomb',
      },
      {
        step: '04',
        title: 'Prototype The Madness',
        desc: 'Deploy working React, HTML5 Canvas, and CSS animations that induce glorious designer tears.',
        iconName: 'code',
      },
      {
        step: '05',
        title: 'Live Judge Pitch',
        desc: 'Present your masterpiece to our poker-faced jury without bursting into laughter.',
        iconName: 'trophy',
      },
    ],
    highlights: [
      {
        id: 'h1',
        title: 'The Runaway Login Button',
        caption: 'Team 404 calculated mouse cursor velocity and had the submit button flee across the viewport at 60fps.',
        type: 'screenshot',
        badge: 'VIRAL MOMENT',
        color: 'bg-[#FFF9DB]',
        rotation: '-rotate-2',
      },
      {
        id: 'h2',
        title: 'Audio-Volume by Screaming',
        caption: 'A media player volume slider that only moves up when the user literally shouts into their microphone.',
        type: 'polaroid',
        badge: 'DECIBEL MAX',
        color: 'bg-[#E1DCFF]',
        rotation: 'rotate-2',
      },
      {
        id: 'h3',
        title: 'Terms of Service Word Search',
        caption: 'You cannot click "Accept" until you find 8 hidden legal clauses inside an unselectable 50x50 word grid.',
        type: 'sticky',
        badge: 'PURE EVIL',
        color: 'bg-[#FFD9E8]',
        rotation: '-rotate-1',
      },
      {
        id: 'h4',
        title: 'Backward Progress Bar',
        caption: 'A loading screen that starts at 99% and slowly counts down to 0% over 4 minutes before showing an error.',
        type: 'screenshot',
        badge: 'TIME WASTER',
        color: 'bg-[#D4F8E8]',
        rotation: 'rotate-1',
      },
    ],
    gallery: [
      {
        id: 'g1',
        title: 'The Worst UI/UX Champions & Squad',
        caption: '80+ builders, jury members, and organizers gathered at NIAT Lab 5.0 celebrating glorious design chaos.',
        tapeColor: '#FFE600',
        rotation: '-rotate-1',
        category: 'Winners & Squad',
        svgSceneType: 'trophy',
        imgUrl: '/events/worst-ui-ux-group.jpg',
      },
      {
        id: 'g2',
        title: '"You Adapted" Screen Challenge',
        caption: 'A participant cracking the inverted navigation puzzle on an RGB gaming laptop.',
        tapeColor: '#FF6B6B',
        rotation: 'rotate-2',
        category: 'Live Sprint',
        svgSceneType: 'chaos-code',
        imgUrl: '/events/worst-ui-ux-laptop-adapted.jpg',
      },
      {
        id: 'g3',
        title: 'Pitching The Cursed UI',
        caption: 'Presenter breaking down the runaway submit button and impossible form validation to the jury.',
        tapeColor: '#48DBFB',
        rotation: '-rotate-2',
        category: 'Jury Pitch',
        svgSceneType: 'presentation',
        imgUrl: '/events/worst-ui-ux-presentation.jpg',
      },
      {
        id: 'g4',
        title: 'Pair Programming The Madness',
        caption: 'Makers collaborating intensely during the 4-hour frontend chaos sprint in NIAT Lab.',
        tapeColor: '#A29BFE',
        rotation: 'rotate-1',
        category: 'Lab Sprint',
        svgSceneType: 'hacking',
        imgUrl: '/events/worst-ui-ux-coding-duo.jpg',
      },
      {
        id: 'g5',
        title: 'Laughter & Cheering in Lab 5.0',
        caption: 'Engineers and participants laughing while reviewing wild anti-UX interactions.',
        tapeColor: '#2ED573',
        rotation: '-rotate-2',
        category: 'Atmosphere',
        svgSceneType: 'laughing',
        imgUrl: '/events/worst-ui-ux-cheering.jpg',
      },
      {
        id: 'g6',
        title: 'Worst UI/UX Award Ceremony • Winners',
        caption: 'Winners receiving their official Achievement Certificates from club leads.',
        tapeColor: '#FFA502',
        rotation: 'rotate-2',
        category: 'Award Ceremony',
        svgSceneType: 'trophy',
        imgUrl: '/events/worst-ui-ux-winners-team1.jpg',
      },
      {
        id: 'g7',
        title: 'Runner-Up Podium Felicitation',
        caption: 'Runner-up team receiving verified certificates for their cursed runaway UI.',
        tapeColor: '#FF6B6B',
        rotation: '-rotate-1',
        category: 'Award Ceremony',
        svgSceneType: 'trophy',
        imgUrl: '/events/worst-ui-ux-winners-team2.jpg',
      },
      {
        id: 'g8',
        title: 'Chaos Master Certificate Handover',
        caption: 'Podium finishers celebrating their intentionally frustrating user flow build.',
        tapeColor: '#6C5CE7',
        rotation: 'rotate-1',
        category: 'Award Ceremony',
        svgSceneType: 'trophy',
        imgUrl: '/events/worst-ui-ux-winners-team3.jpg',
      },
      {
        id: 'g9',
        title: 'Official Winner Certificate • Close-Up',
        caption: 'Presented for demonstrating exceptional creativity and resilience during the Worst UI/UX Hackathon on 13th December 2025.',
        tapeColor: '#FFE600',
        rotation: '-rotate-2',
        category: 'Certificate',
        svgSceneType: 'trophy',
        imgUrl: '/events/worst-ui-ux-certificate-closeup.jpg',
      },
    ],
    learnings: [
      {
        title: 'Cognitive Ergonomics',
        tagline: 'Experiencing bad design firsthand.',
        desc: 'By deliberately maximizing user frustration, students internalized Fitts\'s Law, Hick\'s Law, and visual hierarchy better than any textbook.',
        emoji: '🧠',
        color: 'bg-[#D4F8E8]',
        badge: 'UI/UX MASTERY',
      },
      {
        title: 'Rapid CSS & DOM Sorcery',
        tagline: 'Pushing browser physics to the limits.',
        desc: 'Participants mastered complex requestAnimationFrame physics, mouse tracking vectors, and CSS matrix transforms.',
        emoji: '⚡',
        color: 'bg-[#D6EEFF]',
        badge: 'FRONTEND AGILITY',
      },
      {
        title: 'Satirical Pitching',
        tagline: 'Defending chaos with straight-faced charisma.',
        desc: 'Presenting an intentionally terrible product taught students how to craft compelling product narratives and entertain an audience.',
        emoji: '🎤',
        color: 'bg-[#FFE8D6]',
        badge: 'COMMUNICATION',
      },
      {
        title: 'Resilient Team Dynamic',
        tagline: 'High pressure, zero stress.',
        desc: 'When the goal is to make something absurd, fear of failure disappears and raw creativity takes the wheel.',
        emoji: '🤝',
        color: 'bg-[#FFD9E8]',
        badge: 'TEAM BONDING',
      },
    ],
    winners: [
      {
        title: 'The Runaway Login Portal',
        badge: 'MOST FRUSTRATING',
        badgeColor: 'bg-[#FF4757]',
        team: ['Aarav Sharma', 'Neha Joshi', 'Tanmay Roy'],
        desc: 'A login page where username fields swap positions on every keystroke and the submit button accelerates away from the mouse cursor with momentum physics.',
        tech: ['React', 'Framer Motion', 'Canvas 2D'],
        mockupType: 'runaway-btn',
      },
      {
        title: 'Windows 93 Chaos Edition',
        badge: 'MOST CHAOTIC',
        badgeColor: 'bg-[#6C5CE7]',
        team: ['Rohan Kulkarni', 'Ananya Deshmukh'],
        desc: 'A complete faux operating system with fake BSODs, unclosable popups that duplicate when you click "X", and backward audio drivers.',
        tech: ['TypeScript', 'Tailwind', 'Web Audio API'],
        mockupType: 'win93',
      },
      {
        title: 'Volume Slider by Microphone Screaming',
        badge: 'JUDGES\' FAVORITE',
        badgeColor: 'bg-[#FFA502]',
        team: ['Vikram Patil', 'Siddharth Nair', 'Kavya Rao'],
        desc: 'A media player where you must yell at 90+ decibels into your mic to turn up the volume. If you whisper, it pauses and insults your music taste.',
        tech: ['Web Audio API', 'HTML5 Media', 'Vanilla JS'],
        mockupType: 'shouting-slider',
      },
      {
        title: 'Terms of Service Word Search',
        badge: 'PERFECTLY TERRIBLE',
        badgeColor: 'bg-[#10AC84]',
        team: ['Pooja Hegde', 'Manish Verma'],
        desc: 'You cannot proceed with checkout until you solve a randomized word search containing legal jargon. One wrong click resets the entire shopping cart.',
        tech: ['React', 'CSS Grid', 'LocalStorage'],
        mockupType: 'tos-wordsearch',
      },
    ],
    quotes: [
      {
        quote: 'I have never been so proud of making something this completely and utterly terrible.',
        author: 'Aarav Sharma',
        role: '1st Year Computing • Team BuggyBois',
        color: 'bg-[#FFF385]',
        rotation: '-rotate-2',
      },
      {
        quote: 'I think our team accidentally invented a monetization strategy for shady airline booking sites.',
        author: 'Ananya Deshmukh',
        role: '2nd Year AI & Data Science',
        color: 'bg-[#FFD1E3]',
        rotation: 'rotate-2',
      },
      {
        quote: 'The judge tried to click the submit button for three straight minutes until his wrist cramped. 10/10 hackathon.',
        author: 'Rohan Kulkarni',
        role: 'Core Member • ATC NIAT',
        color: 'bg-[#E1DCFF]',
        rotation: '-rotate-1',
      },
      {
        quote: 'This button clearly has trust issues. Best 4 hours spent on campus this semester!',
        author: 'Prof. S. Joshi',
        role: 'Faculty Mentor & Hackathon Judge',
        color: 'bg-[#D4F8E8]',
        rotation: 'rotate-1',
      },
    ],
  },

  'git-github-gsoc': {
    id: 'git-github-gsoc',
    title: 'GIT & GITHUB: ROAD TO GSOC',
    category: 'WORKSHOP',
    tagline: 'Learn. Contribute. Build in public.',
    date: '7 February 2026',
    venue: 'Tech Auditorium, NIAT Pune',
    organizedBy: 'Advanced Tech Club • Open Source Wing',
    eventType: 'Full-Day Interactive Bootcamp & PR Sprint',
    coverUrl: '/events/git-workshop-poster.jpg',
    heroTheme: {
      accentColor: '#2E86DE',
      badgeBg: 'bg-[#2E86DE]',
      bgPattern: 'bg-[#FAF7F0]',
    },
    stats: [
      { label: 'Attendees', value: '180+', emoji: '👥' },
      { label: 'PRs Merged Upstream', value: '45+', emoji: '🌿' },
      { label: 'GSoC Mentors', value: '3 Leads', emoji: '🎓' },
      { label: 'Repos Forked', value: '210+', emoji: '🐙' },
      { label: 'Git Conflicts Resolved', value: '88', emoji: '⚔️' },
      { label: 'Open Source Swag Packs', value: '50+', emoji: '🎁' },
    ],
    about: {
      heading: 'WHAT WAS THIS ALL ABOUT?',
      subheading: 'Demystifying open-source workflows from terminal zero to merged PR.',
      paragraphs: [
        'Open source can feel intimidating. Between cryptic rebase errors, upstream branch syncs, and formal contribution guidelines, many students never submit their first pull request.',
        'The Road to GSoC workshop brought together Google Summer of Code alumni, Linux kernel contributors, and 180+ students for an intensive hands-on lab.',
        'We covered rebase vs merge, interactive cherry-picking, GPG signing, crafting proposal documents, and real-time live PR reviews with upstream maintainers.',
      ],
      pullQuote: 'Your GitHub graph isn\'t just green squares—it\'s your proof of craftsmanship and collaboration.',
      stickyNote: '🚀 45 pull requests were merged upstream into live production repositories by the end of the day!',
    },
    mission: [
      {
        step: '01',
        title: 'Master The Terminal',
        desc: 'Drop the GUI. Learn raw Git plumbing, refs, staging trees, and commit hashes.',
        iconName: 'terminal',
      },
      {
        step: '02',
        title: 'Fork & Clone Repos',
        desc: 'Configure remote upstream tracking, branch conventions, and clean history.',
        iconName: 'git-branch',
      },
      {
        step: '03',
        title: 'Survive Merge Conflicts',
        desc: 'Battle through multi-author branch collision drills in our custom conflict simulator.',
        iconName: 'shield',
      },
      {
        step: '04',
        title: 'Craft The Proposal',
        desc: 'Review winning GSoC proposal templates from Python Software Foundation and CNCF.',
        iconName: 'file-text',
      },
      {
        step: '05',
        title: 'Ship Upstream PR',
        desc: 'Submit your code live to open-source maintainers and get real-time code reviews.',
        iconName: 'check-circle',
      },
    ],
    highlights: [
      {
        id: 'gh1',
        title: 'Live Merge Conflict Arena',
        caption: '30 teams simultaneously pushing to a single master branch to debug conflict markers live on the auditorium screen.',
        type: 'screenshot',
        badge: 'HANDS-ON',
        color: 'bg-[#D6EEFF]',
        rotation: '-rotate-2',
      },
      {
        id: 'gh2',
        title: '1-on-1 GSoC Proposal Teardown',
        caption: 'Alumni mentors reviewed 40+ student proposal drafts for CNCF, Mozilla, and OpenCV.',
        type: 'polaroid',
        badge: 'MENTORSHIP',
        color: 'bg-[#E1DCFF]',
        rotation: 'rotate-2',
      },
      {
        id: 'gh3',
        title: 'Upstream PR Stampede',
        caption: 'Over 45 real documentation, bugfix, and test suite PRs merged before sunset.',
        type: 'sticky',
        badge: 'REAL IMPACT',
        color: 'bg-[#D4F8E8]',
        rotation: '-rotate-1',
      },
      {
        id: 'gh4',
        title: 'GitHub Swag Extravaganza',
        caption: 'Invertocat plushies, stickers, and GitHub Student Developer Pack walkthroughs.',
        type: 'screenshot',
        badge: 'COMMUNITY',
        color: 'bg-[#FFF9DB]',
        rotation: 'rotate-1',
      },
    ],
    gallery: [
      {
        id: 'ghg1',
        title: 'Workshop Squad & Organizers',
        caption: 'Organizing leads, mentors, and student builders gathered in front of the Tech Audi main screen.',
        tapeColor: '#2E86DE',
        rotation: '-rotate-1',
        category: 'Squad',
        svgSceneType: 'hacking',
        imgUrl: '/events/git-workshop-group.jpg',
      },
      {
        id: 'ghg2',
        title: 'Live Terminal CLI Demonstration',
        caption: 'Presenter breaking down PowerShell & Git CLI paths on the main auditorium screen.',
        tapeColor: '#2E86DE',
        rotation: '-rotate-2',
        category: 'Auditorium',
        svgSceneType: 'presentation',
        imgUrl: '/events/git-workshop-terminal-demo.jpg',
      },
      {
        id: 'ghg3',
        title: 'Speaker Presentation & GSoC Roadmap',
        caption: 'Lead mentor sharing the journey from campus coder to open-source maintainer from the podium.',
        tapeColor: '#FFE600',
        rotation: 'rotate-1',
        category: 'Mentorship',
        svgSceneType: 'presentation',
        imgUrl: '/events/git-workshop-speaker-podium.jpg',
      },
      {
        id: 'ghg4',
        title: 'Pair Debugging & Merge Conflicts',
        caption: 'Students leaning in together to resolve upstream branch sync and Git conflicts during the live lab sprint.',
        tapeColor: '#FF6B6B',
        rotation: '-rotate-1',
        category: 'Live Sprint',
        svgSceneType: 'hacking',
        imgUrl: '/events/git-workshop-debugging-group.jpg',
      },
      {
        id: 'ghg5',
        title: 'QR Code Check-In & Entry Pass',
        caption: 'Attendees scanning their digital event passes on mobile for seamless lab admission.',
        tapeColor: '#2ED573',
        rotation: 'rotate-2',
        category: 'Check-In',
        svgSceneType: 'laughing',
        imgUrl: '/events/git-workshop-qr-checkin.jpg',
      },
      {
        id: 'ghg6',
        title: 'Handwritten Git Cheatsheet Notes',
        caption: 'Student taking structured notes on git init, commit, branch, and remote origin commands.',
        tapeColor: '#FFA502',
        rotation: 'rotate-1',
        category: 'Notes',
        svgSceneType: 'presentation',
        imgUrl: '/events/git-workshop-notes-closeup.jpg',
      },
      {
        id: 'ghg7',
        title: 'Focused Code Sprint & Terminal Drill',
        caption: 'Rows of students actively practicing git rebase and cherry-pick commands on their laptops.',
        tapeColor: '#6C5CE7',
        rotation: '-rotate-2',
        category: 'Hands-On',
        svgSceneType: 'hacking',
        imgUrl: '/events/git-workshop-attendees-coding.jpg',
      },
      {
        id: 'ghg8',
        title: 'Interactive Q&A Session',
        caption: 'Student asking questions into the microphone about open-source licensing and GSoC proposal reviews.',
        tapeColor: '#FF6B6B',
        rotation: 'rotate-2',
        category: 'Q&A',
        svgSceneType: 'presentation',
        imgUrl: '/events/git-workshop-qa-mic.jpg',
      },
      {
        id: 'ghg9',
        title: 'Git Installation & Environment Setup',
        caption: 'Participant setting up Git for Windows v2.53 on their custom circuit skin laptop.',
        tapeColor: '#A29BFE',
        rotation: '-rotate-2',
        category: 'Setup',
        svgSceneType: 'hacking',
        imgUrl: '/events/git-workshop-laptop-setup.jpg',
      },
    ],
    learnings: [
      {
        title: 'Advanced Git Tree Plumbing',
        tagline: 'Interactive rebase, squash, cherry-pick.',
        desc: 'Mastering Git beyond basic add/commit/push to keep contribution histories pristine and maintainable.',
        emoji: '🌿',
        color: 'bg-[#D6EEFF]',
        badge: 'VERSION CONTROL',
      },
      {
        title: 'Open Source Community Etiquette',
        tagline: 'Issue triage & PR communication.',
        desc: 'Writing structured pull request summaries, respecting CODEOWNERS, and providing reproducible bug reports.',
        emoji: '🤝',
        color: 'bg-[#D4F8E8]',
        badge: 'COLLABORATION',
      },
      {
        title: 'GSoC Strategy & Proposal Writing',
        tagline: 'Architecting 350-hour student roadmaps.',
        desc: 'Understanding how open source organizations evaluate proposal feasibility, milestones, and deliverable timelines.',
        emoji: '📝',
        color: 'bg-[#FFE8D6]',
        badge: 'PROPOSAL WRITING',
      },
      {
        title: 'Continuous Integration Workflows',
        tagline: 'GitHub Actions & automated testing.',
        desc: 'Triggering automated linting, test suites, and Docker matrix validation on every push.',
        emoji: '🤖',
        color: 'bg-[#E1DCFF]',
        badge: 'DEVOPS BASICS',
      },
    ],
    winners: [
      {
        title: 'Top Upstream Contributor',
        badge: 'MOST MERGED PRS',
        badgeColor: 'bg-[#2E86DE]',
        team: ['Priyansh Sharma'],
        desc: 'Successfully authored and merged 4 bug fixes into the official VS Code extension ecosystem in a single afternoon.',
        tech: ['TypeScript', 'VSCode API', 'Git'],
        mockupType: 'runaway-btn',
      },
      {
        title: 'Best GSoC Proposal Draft',
        badge: 'PROPOSAL CHAMPION',
        badgeColor: 'bg-[#10AC84]',
        team: ['Ishita Kulkarni'],
        desc: 'Drafted an exceptional 12-page proposal on LLM-based fuzz testing for Rust crates.',
        tech: ['Rust', 'LLVM', 'Markdown'],
        mockupType: 'win93',
      },
    ],
    quotes: [
      {
        quote: 'I used to be terrified of merge conflicts. Now I actually understand what the HEAD pointer is doing.',
        author: 'Manav Gupta',
        role: '1st Year Computer Engineering',
        color: 'bg-[#D6EEFF]',
        rotation: '-rotate-2',
      },
      {
        quote: 'Seeing that green "Merged" badge live for the first time gave me goosebumps. Best Saturday of my year.',
        author: 'Pooja Patil',
        role: '2nd Year IT • NIAT Pune',
        color: 'bg-[#FFF385]',
        rotation: 'rotate-2',
      },
    ],
  },

  'mst-blockchain': {
    id: 'mst-blockchain',
    title: 'MST BLOCKCHAIN WORKSHOP',
    category: 'WORKSHOP',
    tagline: 'Exploring decentralized technology.',
    date: '27 February 2026',
    venue: 'Computer Wing, NIAT Pune',
    organizedBy: 'Advanced Tech Club • Web3 & Systems',
    eventType: 'Hands-on Smart Contract Engineering Lab',
    coverUrl: '/events/blockchain-workshop-poster.png',
    heroTheme: {
      accentColor: '#10AC84',
      badgeBg: 'bg-[#10AC84]',
      bgPattern: 'bg-[#FAF7F0]',
    },
    stats: [
      { label: 'Builders', value: '140+', emoji: '👥' },
      { label: 'Smart Contracts', value: '60+', emoji: '⛓️' },
      { label: 'Testnet TXs', value: '1,200+', emoji: '⚡' },
      { label: 'Gas Saved in Contest', value: '42%', emoji: '⛽' },
      { label: 'DApps Deployed', value: '25+', emoji: '🌐' },
    ],
    about: {
      heading: 'WHAT WAS THIS ALL ABOUT?',
      subheading: 'Moving past crypto hype into real cryptographic consensus & smart contracts.',
      paragraphs: [
        'Decentralized systems are grounded in rigorous computer science: cryptographic hashing, Merkle trees, state machines, and consensus protocols.',
        'The MST Blockchain Workshop stripped away the financial buzzwords to teach 140+ students the engineering reality of Ethereum Virtual Machines, Solidity development, and EVM gas optimization.',
        'Every student coded, tested, and deployed their own decentralized voting system and peer-to-peer micro-escrow smart contracts onto live Ethereum testnets.',
      ],
      pullQuote: 'Blockchain isn\'t magic—it\'s distributed systems and applied cryptography executed in public.',
      stickyNote: '🔐 Over 1,200 verified transactions were broadcast to Sepolia testnet during our 4-hour live lab!',
    },
    mission: [
      {
        step: '01',
        title: 'Cryptographic Foundations',
        desc: 'Understand SHA-256, Elliptic Curve cryptography (ECDSA), and public-private keypairs.',
        iconName: 'key',
      },
      {
        step: '02',
        title: 'Solidity Deep Dive',
        desc: 'Write robust smart contracts with memory vs storage management and reentrancy guards.',
        iconName: 'code',
      },
      {
        step: '03',
        title: 'Hardhat & Local Node',
        desc: 'Spin up local EVM testnets, write automated unit tests, and simulate edge failure cases.',
        iconName: 'server',
      },
      {
        step: '04',
        title: 'Gas Optimization Arena',
        desc: 'Compete to minimize bytecode storage slots and execution gas consumption.',
        iconName: 'zap',
      },
      {
        step: '05',
        title: 'Frontend Web3 Integration',
        desc: 'Connect ethers.js and Wagmi to build an interactive voting dashboard for NIAT campus.',
        iconName: 'globe',
      },
    ],
    highlights: [
      {
        id: 'bc1',
        title: 'Gas Golfing Challenge',
        caption: 'Builders competed to compress a voter registration contract to the absolute lowest bytecode gas cost.',
        type: 'screenshot',
        badge: 'OPTIMIZATION',
        color: 'bg-[#E8F5E9]',
        rotation: '-rotate-2',
      },
      {
        id: 'bc2',
        title: 'Reentrancy Attack Simulation',
        caption: 'Students successfully drained a mock vulnerable DAO contract to understand the famous DAO hack.',
        type: 'polaroid',
        badge: 'SECURITY AUDIT',
        color: 'bg-[#FFE8D6]',
        rotation: 'rotate-2',
      },
    ],
    gallery: [
      {
        id: 'bcg1',
        title: 'MST Blockchain Squad & Participants',
        caption: '100+ builders, speakers, and club members gathered in the auditorium at NIAT Pune.',
        tapeColor: '#10AC84',
        rotation: '-rotate-1',
        category: 'Squad',
        svgSceneType: 'hacking',
        imgUrl: '/events/blockchain-workshop-group.jpg',
      },
      {
        id: 'bcg2',
        title: 'Distributed Ledger Architecture Keynote',
        caption: 'Speaker breaking down distributed, transparent, and immutable blockchain databases on stage.',
        tapeColor: '#FFE600',
        rotation: 'rotate-1',
        category: 'Keynote',
        svgSceneType: 'presentation',
        imgUrl: '/events/blockchain-workshop-speaker-presentation.jpg',
      },
      {
        id: 'bcg3',
        title: 'Campus Verse Swag & Exclusive T-Shirts',
        caption: 'Winners and attendees proudly showcasing their custom-designed MST Blockchain merch.',
        tapeColor: '#6C5CE7',
        rotation: '-rotate-2',
        category: 'Swag',
        svgSceneType: 'trophy',
        imgUrl: '/events/blockchain-workshop-swag-tshirts.jpg',
      },
      {
        id: 'bcg4',
        title: 'Mentor Felicitation & Swag Handover',
        caption: 'Speaker and organizing lead presenting the limited-edition Campus Verse graphic tee on stage.',
        tapeColor: '#FF6B6B',
        rotation: 'rotate-2',
        category: 'Felicitation',
        svgSceneType: 'trophy',
        imgUrl: '/events/blockchain-workshop-swag-handover.jpg',
      },
      {
        id: 'bcg5',
        title: 'Deep Focus & Testnet Deployment',
        caption: 'Students in the auditorium engaged in live Solidity coding and smart contract testing.',
        tapeColor: '#2ED573',
        rotation: '-rotate-1',
        category: 'Auditorium',
        svgSceneType: 'hacking',
        imgUrl: '/events/blockchain-workshop-attentive-student.jpg',
      },
      {
        id: 'bcg6',
        title: 'Packed Auditorium & Live Keynote',
        caption: 'Wide-angle view of 140+ students filling the tech auditorium for the Campus Verse session.',
        tapeColor: '#FFA502',
        rotation: 'rotate-1',
        category: 'Auditorium',
        svgSceneType: 'presentation',
        imgUrl: '/events/blockchain-workshop-packed-auditorium.jpg',
      },
    ],
    learnings: [
      {
        title: 'Solidity & EVM Architecture',
        tagline: 'State storage slots, memory, and calldata.',
        desc: 'Writing secure smart contracts while accounting for immutability and byte-level efficiency.',
        emoji: '⛓️',
        color: 'bg-[#E8F5E9]',
        badge: 'SMART CONTRACTS',
      },
      {
        title: 'Cryptographic Primitives',
        tagline: 'Merkle trees, keccak256, and signatures.',
        desc: 'Verifying whitelists and decentralized proof-of-membership using mathematical proofs.',
        emoji: '🔐',
        color: 'bg-[#D6EEFF]',
        badge: 'CRYPTOGRAPHY',
      },
    ],
    winners: [
      {
        title: 'Gas Golfing 1st Place',
        badge: 'LOWEST GAS CONSUMPTION',
        badgeColor: 'bg-[#10AC84]',
        team: ['Harsh Vardhan', 'Devendra Singh'],
        desc: 'Reduced voter registry execution from 84,000 gas down to 21,300 gas using custom assembly (Yul) packing.',
        tech: ['Solidity', 'Yul', 'Hardhat'],
        mockupType: 'shouting-slider',
      },
    ],
    quotes: [
      {
        quote: 'Actually deploying a contract to a live testnet and inspecting the state on Etherscan demystified everything for me.',
        author: 'Rhea Sen',
        role: '3rd Year Computer Engineering',
        color: 'bg-[#E8F5E9]',
        rotation: '-rotate-2',
      },
    ],
  },
};

// Explicit slug aliases for route compatibility
eventsArchive['git-github-road-to-gsoc'] = eventsArchive['git-github-gsoc'];
eventsArchive['mst-blockchain-workshop'] = eventsArchive['mst-blockchain'];


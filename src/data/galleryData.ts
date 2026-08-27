export type GalleryCategory = 'All' | 'Events' | 'Workshops' | 'Behind the Scenes' | 'Projects';

export type GalleryFormat = 'polaroid' | 'pinned' | 'ticket' | 'torn-paper' | 'screenshot' | 'sticky';

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: 'Events' | 'Workshops' | 'Behind the Scenes' | 'Projects';
  format: GalleryFormat;
  date: string;
  location: string;
  tapeColor?: string;
  pinColor?: string;
  rotation?: string;
  color?: string;
  svgSceneType: 
    | 'worst-ui-demo'
    | 'git-push-panic'
    | 'blockchain-blocks'
    | 'organized-chaos'
    | 'robot-avoid'
    | 'pizza-stack'
    | 'gsoc-merged'
    | 'late-night-debug'
    | 'solder-station'
    | 'hackathon-podium'
    | 'drone-flight'
    | 'sticky-quote';
  imgUrl?: string;
}

export const galleryMemories: GalleryItem[] = [
  {
    id: 'mem-1',
    title: 'Worst UI/UX Squad',
    caption: '80+ makers breaking every rule in NIAT Lab 5.0.',
    category: 'Events',
    format: 'polaroid',
    date: 'Dec 13, 2025',
    location: 'Lab 5.0 • NIAT Pune',
    tapeColor: '#FFE600',
    rotation: '-rotate-2',
    svgSceneType: 'worst-ui-demo',
    imgUrl: '/events/worst-ui-ux-group.jpg',
  },
  {
    id: 'mem-2',
    title: 'Git Merge Conflicts War',
    caption: 'Live CLI debugging and upstream PRs in Tech Auditorium.',
    category: 'Workshops',
    format: 'screenshot',
    date: 'Feb 07, 2026',
    location: 'Tech Auditorium',
    rotation: 'rotate-1',
    svgSceneType: 'git-push-panic',
    imgUrl: '/events/git-workshop-terminal-demo.jpg',
  },
  {
    id: 'mem-3',
    title: 'MST Blockchain Sprint',
    caption: '100+ builders, smart contract deployment, and Campus Verse merch.',
    category: 'Workshops',
    format: 'pinned',
    date: 'Feb 27, 2026',
    location: 'Computer Wing & Lab 5.0',
    pinColor: '#FF4757',
    rotation: '-rotate-1',
    svgSceneType: 'blockchain-blocks',
    imgUrl: '/events/blockchain-workshop-group.jpg',
  },
  {
    id: 'mem-4',
    title: 'Lab 5.0 Chaos & Cheering',
    caption: 'When code breaks and everyone bursts into laughter.',
    category: 'Behind the Scenes',
    format: 'torn-paper',
    date: 'Dec 13, 2025',
    location: 'Lab 5.0 Greenroom',
    tapeColor: '#6C5CE7',
    rotation: 'rotate-2',
    svgSceneType: 'organized-chaos',
    imgUrl: '/events/worst-ui-ux-cheering.jpg',
  },
  {
    id: 'mem-5',
    title: 'ROS 2 Rover Milestone',
    caption: 'When the robot actually avoids the wall on the first try.',
    category: 'Projects',
    format: 'polaroid',
    date: 'Apr 18, 2026',
    location: 'ATC 5.0 Lab Bench',
    tapeColor: '#2ED573',
    rotation: '-rotate-3',
    svgSceneType: 'robot-avoid',
  },
  {
    id: 'mem-6',
    title: 'Hackathon Fuel',
    caption: 'Pizza boxes stacked higher than our commit history.',
    category: 'Behind the Scenes',
    format: 'pinned',
    date: 'Mar 30, 2026',
    location: 'Hostel Quad',
    pinColor: '#FFA502',
    rotation: 'rotate-2',
    svgSceneType: 'pizza-stack',
  },
  {
    id: 'mem-7',
    title: 'GSoC Pull Request Bell',
    caption: 'The moment the pull request was merged upstream.',
    category: 'Workshops',
    format: 'ticket',
    date: 'Apr 05, 2026',
    location: 'Open Source Wing',
    rotation: '-rotate-1',
    svgSceneType: 'gsoc-merged',
  },
  {
    id: 'mem-8',
    title: 'Late Night Lab Run',
    caption: 'Debugging at 3:14 AM because Pi.',
    category: 'Behind the Scenes',
    format: 'screenshot',
    date: 'Apr 20, 2026',
    location: 'Lab 5.0 Station 3',
    rotation: 'rotate-3',
    svgSceneType: 'late-night-debug',
  },
  {
    id: 'mem-9',
    title: 'First Autonomous Drone Test',
    caption: 'Hover mode unlocked. No windows were damaged in the process.',
    category: 'Projects',
    format: 'polaroid',
    date: 'Apr 22, 2026',
    location: 'Campus Sports Arena',
    tapeColor: '#00D2D3',
    rotation: '-rotate-2',
    svgSceneType: 'drone-flight',
  },
  {
    id: 'mem-10',
    title: 'SMD Soldering Sprint',
    caption: 'Soldering tiny 0603 resistors with steady student hands.',
    category: 'Projects',
    format: 'torn-paper',
    date: 'Apr 15, 2026',
    location: 'Hardware Bench',
    tapeColor: '#FF6B6B',
    rotation: 'rotate-1',
    svgSceneType: 'solder-station',
  },
  {
    id: 'mem-11',
    title: 'CodeSprint Champions',
    caption: 'Gold trophy in hand, 0 hours of sleep.',
    category: 'Events',
    format: 'pinned',
    date: 'Apr 24, 2026',
    location: 'NIAT Main Stage',
    pinColor: '#FFE600',
    rotation: '-rotate-1',
    svgSceneType: 'hackathon-podium',
  },
  {
    id: 'mem-12',
    title: 'Golden Lab Rule #1',
    caption: 'If it works, do not touch it. If it does not work, blame cache.',
    category: 'Behind the Scenes',
    format: 'sticky',
    date: 'Forever',
    location: 'Lab 5.0 Whiteboard',
    color: '#FFF9DB',
    rotation: 'rotate-3',
    svgSceneType: 'sticky-quote',
  },
];

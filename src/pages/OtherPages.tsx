import React from 'react';
import { PlaceholderPage } from './PlaceholderPage';

export const LabPage: React.FC = () => (
  <PlaceholderPage 
    title="ATC 5.0 LAB" 
    subtitle="Where Ideas Become Hardware. Rapid Prototyping, ROS, and PCB Stations." 
    nextUp={true}
  />
);

export const TeamPage: React.FC = () => (
  <PlaceholderPage 
    title="MEET THE SQUAD" 
    subtitle="The student leads, core mentors, and builders making ATC happen." 
  />
);

export const GalleryPage: React.FC = () => (
  <PlaceholderPage 
    title="ATC GALLERY" 
    subtitle="Memories, hackathon sleepless nights, lab builds, and tech triumphs." 
  />
);

export const JoinPage: React.FC = () => (
  <PlaceholderPage 
    title="JOIN ATC NIAT" 
    subtitle="Ready to build the future? Applications open for all engineering disciplines." 
  />
);

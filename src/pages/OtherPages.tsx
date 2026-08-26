import React from 'react';
import { PlaceholderPage } from './PlaceholderPage';

export const GalleryPage: React.FC = () => (
  <PlaceholderPage 
    title="ATC GALLERY" 
    subtitle="Memories, hackathon sleepless nights, lab builds, and tech triumphs." 
    nextUp={true}
  />
);

export const JoinPage: React.FC = () => (
  <PlaceholderPage 
    title="JOIN ATC NIAT" 
    subtitle="Ready to build the future? Applications open for all engineering disciplines." 
  />
);

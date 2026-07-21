import { useState } from 'react';
import { ProjectContext } from './context/ProjectContext';
import { ScrollProgress } from './components/ScrollProgress';
import Nav from './components/Nav';
import Hero from './components/Hero';
import { Marquee } from './components/Marquee';
import { ClientLogos } from './components/ClientLogos';
import { FeaturedShowcase } from './components/FeaturedShowcase';
import { ArchiveList } from './components/ArchiveList';
import { AboutSection } from './components/AboutSection';
import { HighlightsStrip } from './components/HighlightsStrip';
import Footer from './components/Footer';
import ProjectDetailOverlay from './components/ProjectDetailOverlay';

export default function App() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <ProjectContext.Provider value={{ activeProject, setActiveProject }}>
      <ScrollProgress />
      <Nav />
      <Hero />
      <Marquee />
      <ClientLogos />
      <FeaturedShowcase />
      <ArchiveList />
      <AboutSection />
      <HighlightsStrip />
      <Footer />
      <ProjectDetailOverlay />
    </ProjectContext.Provider>
  );
}

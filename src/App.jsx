import { useState } from 'react';
import { ProjectContext } from './context/ProjectContext';
import { CustomCursor } from './components/CustomCursor';
import { EtherealBackground } from './components/EtherealBackground';
import { ScrollProgress } from './components/ScrollProgress';
import Nav from './components/Nav';
import Hero from './components/Hero';
import { Marquee } from './components/Marquee';
import { StatementSection } from './components/StatementSection';
import { ClientLogos } from './components/ClientLogos';
import { FeaturedShowcase } from './components/FeaturedShowcase';
import { PhilosophySection } from './components/PhilosophySection';
import { ArchiveList } from './components/ArchiveList';
import { AboutSection } from './components/AboutSection';
import { HighlightsStrip } from './components/HighlightsStrip';
import Footer from './components/Footer';
import ProjectDetailOverlay from './components/ProjectDetailOverlay';

export default function App() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <ProjectContext.Provider value={{ activeProject, setActiveProject }}>
      <CustomCursor />
      <EtherealBackground />
      <ScrollProgress />
      <Nav />
      <Hero />
      <Marquee />
      <StatementSection />
      <ClientLogos />
      <FeaturedShowcase />
      <ArchiveList />
      <PhilosophySection />
      <AboutSection />
      <HighlightsStrip />
      <Footer />
      <ProjectDetailOverlay />
    </ProjectContext.Provider>
  );
}

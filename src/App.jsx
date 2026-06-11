import { useState } from 'react';
import { ProjectContext } from './context/ProjectContext';
import { Grain } from './components/Grain';
import Nav from './components/Nav';
import Hero from './components/Hero';
import { ClientLogos } from './components/ClientLogos';
import { CaseStudies } from './components/CaseStudies';
import { WorkIndex } from './components/WorkIndex';
import { About } from './components/About';
import Footer from './components/Footer';
import ProjectDetailOverlay from './components/ProjectDetailOverlay';

export default function App() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <ProjectContext.Provider value={{ activeProject, setActiveProject }}>
      <Grain />
      <Nav />
      <Hero />
      <ClientLogos />
      <CaseStudies />
      <WorkIndex />
      <About />
      <Footer />
      <ProjectDetailOverlay />
    </ProjectContext.Provider>
  );
}

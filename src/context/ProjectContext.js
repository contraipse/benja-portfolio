import { createContext } from 'react';

export const ProjectContext = createContext({
  activeProject: null,
  setActiveProject: () => {},
});

import logos from '../../../assets/svgs/index';

export const initialNewProjectFormConfig = {
  name: '',
  author: '',
  projectLogo: null,
  description: '',
  technology: 'React',
  language: 'JavaScript',
  styling: 'React Bootstrap',
  buildTool: 'Vite',
  layout: '',
};

export const technologyOptions = [
  { label: 'React', logo: logos.reactLogo },
  { label: 'Vue', logo: logos.vueLogo },
  { label: 'Angular', logo: logos.angularLogo },
];

export const languageOptions = [
  { label: 'JavaScript', logo: logos.jsLogo },
  { label: 'TypeScript', logo: logos.tsLogo },
];

export const stylingOptions = [
  { label: 'Bootstrap', logo: logos.bootstrapLogo },
  { label: 'React Bootstrap', logo: logos.reactBootstrap },
  { label: 'Chakra UI', logo: logos.chakraUI },
  { label: 'Material UI', logo: logos.materialUI },
];

export const buildToolOptions = [
  { label: 'Create React App', logo: logos.reactLogo },
  { label: 'Vite', logo: logos.viteLogo },
];

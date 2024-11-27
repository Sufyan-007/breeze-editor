import logos from '../../../assets/svgs/index';

export const initialNewProjectFormConfig = {
  name: '',
  author: '',
  logo: null,
  description: '',
  technology: 'React',
  language: 'JavaScript',
  styling: ['React Bootstrap'],
  buildTool: 'Vite',
  layout: '',
};

export const technologyOptions = [
  { label: 'React', logo: logos.reactLogo },
  { label: 'Vue', logo: logos.vueLogo, disabled: true },
  { label: 'Angular', logo: logos.angularLogo, disabled: true },
];

export const languageOptions = [
  { label: 'JavaScript', logo: logos.jsLogo },
  { label: 'TypeScript', logo: logos.tsLogo, disabled: true },
];

export const stylingOptions = [
  { label: 'Bootstrap', logo: logos.bootstrapLogo, disabled: true },
  { label: 'React Bootstrap', logo: logos.reactBootstrap },
  { label: 'Chakra UI', logo: logos.chakraUI, disabled: true },
  { label: 'Material UI', logo: logos.materialUI, disabled: true },
];

export const buildToolOptions = [
  { label: 'Create React App', logo: logos.reactLogo, disabled: true },
  { label: 'Vite', logo: logos.viteLogo },
];

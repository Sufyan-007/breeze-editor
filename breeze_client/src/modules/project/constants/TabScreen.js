export const getAvailableTabs = (tag) => {
  switch (tag) {
    case 'COMPONENT':
      return ['code', 'preview'];
    case 'MODULE':
      return ['code', 'config'];
    case 'SERVICE-CONFIG':
    case 'CUSTOM_UPLOAD':
    case 'SETTINGS':
      return ['config'];
    case 'ROUTING':
    case 'PACKAGE_CONFIG':
      return ['config', 'code'];
    default:
      return ['code', 'preview'];
  }
};

export const getLanguageFromExtension = (extension) => {
  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    default:
      return 'javascript';
  }
};

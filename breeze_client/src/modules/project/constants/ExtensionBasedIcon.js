export const getIconClass = (extension) => {
  switch (extension) {
    case 'SX':
      return 'bi-filetype-jsx';
    case 'js':
      return 'bi-filetype-js';
    case 'json':
      return 'bi-filetype-json';
    case 'html':
      return 'bi-filetype-html';
    case 'css':
      return 'bi-filetype-css';
    default:
      return 'bi-file-earmark';
  }
};

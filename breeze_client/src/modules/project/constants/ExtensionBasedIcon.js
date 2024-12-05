export const getIconClass = (extension) => {
  switch (extension) {
    case 'SX':
    case 'jsx':
      return { iconClass: 'bi-filetype-jsx', color: '#A57CE8' };
    case 'js':
      return { iconClass: 'bi-filetype-js', color: '#A57CE8' };
    case 'json':
      return { iconClass: 'bi-filetype-json', color: '#568D2A' };
    case 'html':
      return { iconClass: 'bi-filetype-html', color: '#E34F26' };
    case 'css':
      return { iconClass: 'bi-filetype-css', color: '#80C2FF' };
    case 'scss':
      return { iconClass: 'bi-filetype-scss', color: '#80C2FF' };
    case 'config':
      return { iconClass: 'bi bi-file-earmark-code', color: '#6495ED' };
    default:
      return { iconClass: 'bi-file-earmark', color: '#6C757D' };
  }
};

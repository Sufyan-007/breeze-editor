import React from 'react';
import logos from '../../../assets/svgs/index';

export const folderOptions = (
  nodeId,
  handleContextMenuSelection,
  handleRename,
  handleContextMenuFolder,
  handleRemoveNode
) => [
  {
    label: 'Add Folder',
    value: () => handleContextMenuFolder(nodeId),
    icon: React.createElement('i', { className: 'bi bi-folder-plus' }),
  },
  {
    label: 'Add Component',
    value: () => handleContextMenuSelection(nodeId, 'COMPONENTS'),
    icon: React.createElement('img', {
      src: logos.componentsLogo,
      alt: 'Components',
    }),
  },
  {
    label: 'Add Service',
    value: () => handleContextMenuSelection(nodeId, 'CODE_FILE'),
    icon: React.createElement('img', {
      src: logos.servicesLogo,
      alt: 'Services',
    }),
  },
  {
    label: 'Add Hook',
    value: () => handleContextMenuSelection(nodeId, 'HOOKS'),
    icon: React.createElement('img', { src: logos.routesLogo, alt: 'Routes' }),
  },
  {
    label: 'Add Custom File',
    value: () => handleContextMenuSelection(nodeId, 'CUSTOM'),
    icon: React.createElement('i', { className: 'bi bi-file-earmark-code' }),
  },
  {
    label: 'Rename Folder',
    value: () => handleRename(nodeId),
    icon: React.createElement('i', { className: 'bi bi-pencil-square' }),
  },
  {
    label: 'Delete Folder',
    value: () => handleRemoveNode(nodeId),
    icon: React.createElement('i', { className: 'bi bi-trash' }),
  },
];

export const fileOptions = (nodeId, handleRename, handleRemoveNode) => [
  {
    label: 'Rename File',
    value: () => handleRename(nodeId),
    icon: React.createElement('i', { className: 'bi bi-pencil-square' }),
  },
  {
    label: 'Delete File',
    value: () => handleRemoveNode(nodeId),
    icon: React.createElement('i', { className: 'bi bi-trash' }),
  },
];
export const addFileOptions = (nodeId, handleContextMenuSelection) => [
  {
    label: 'Add Component',
    value: () => handleContextMenuSelection(nodeId, 'COMPONENTS'),
    icon: React.createElement('img', {
      src: logos.componentsLogo,
      alt: 'Components',
    }),
  },
  {
    label: 'Add Service',
    value: () => handleContextMenuSelection(nodeId, 'CODE_FILE'),
    icon: React.createElement('img', {
      src: logos.servicesLogo,
      alt: 'Services',
    }),
  },
  {
    label: 'Add Hook',
    value: () => handleContextMenuSelection(nodeId, 'HOOKS'),
    icon: React.createElement('img', { src: logos.routesLogo, alt: 'Routes' }),
  },
  {
    label: 'Add Custom File',
    value: () => handleContextMenuSelection(nodeId, 'CUSTOM'),
    icon: React.createElement('i', { className: 'bi bi-file-earmark-code' }),
  },
];

import React from 'react';
import logos from '../../../assets/svgs/index';

export const folderOptions = (nodeId, handleContextMenuSelection, handleRename) => [
  {
    label: 'Add Components',
    value: () => handleContextMenuSelection(nodeId),
    icon: React.createElement('img', {
      src: logos.componentsLogo,
      alt: 'Components',
    }),
  },
  {
    label: 'Add Services',
    value: () => handleContextMenuSelection(nodeId),
    icon: React.createElement('img', {
      src: logos.servicesLogo,
      alt: 'Services',
    }),
  },
  {
    label: 'Add Routes',
    value: () => handleContextMenuSelection(nodeId),
    icon: React.createElement('img', { src: logos.routesLogo, alt: 'Routes' }),
  },
  {
    label: 'Add ApiClients',
    value: () => handleContextMenuSelection(nodeId),
    icon: React.createElement('i', { className: 'bi bi-file-earmark-code' }),
  },
  {
    label: 'Rename Folder',
    value: () => handleRename(nodeId),
    icon: React.createElement('i', { className: 'bi bi-pencil-square' }),
  },
  {
    label: 'Add Folder',
    value: () => handleContextMenuSelection(nodeId),
    icon: React.createElement('i', { className: 'bi bi-folder-plus' }),
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
    label: 'Add Components',
    value: () => handleContextMenuSelection(nodeId),
    icon: React.createElement('img', {
      src: logos.componentsLogo,
      alt: 'Components',
    }),
  },
  {
    label: 'Add Services',
    value: () => handleContextMenuSelection(nodeId),
    icon: React.createElement('img', {
      src: logos.servicesLogo,
      alt: 'Services',
    }),
  },
  {
    label: 'Add Routes',
    value: () => handleContextMenuSelection(nodeId),
    icon: React.createElement('img', { src: logos.routesLogo, alt: 'Routes' }),
  },
  {
    label: 'Add ApiClients',
    value: () => handleContextMenuSelection(nodeId),
    icon: React.createElement('i', { className: 'bi bi-file-earmark-code' }),
  },
];

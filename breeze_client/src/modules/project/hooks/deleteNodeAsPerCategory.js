import { deleteFileAction } from '../../resource-configuration/redux/resourcesActions';

export const deleteNodeAsPerCategory = async (node, dispatch, projectName) => {
  let response;

  switch (node.tag) {
    case 'RESOURCE':
    case 'CUSTOM':
      response = await dispatch(deleteFileAction({ fileId: node.id, projectName: projectName }));
      break;
    case 'COMPONENT':
      // here write your code
      break;
    case 'SERVICE':
      // here write your code
      break;
    default:
      console.error('Unknown category for delete');
      return null;
  }
  return response;
};

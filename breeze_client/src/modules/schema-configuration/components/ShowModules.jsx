import { useDispatch, useSelector } from 'react-redux';
import { schemaTemplate } from '../constants/templates';
import { useEffect, useState } from 'react';
import { fetchSchemas, handleDeleteSchema } from '../redux/schemaConfigActions';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { deleteSchemaFromList } from '../redux/schemaConfigReducers';
import { deleteModuleById, fetchModules } from '../../service-configuration/redux/ApiClientActions';

function ShowModules({ setView, moduleId, title, setSelectedModule, setCurrentSchema, setSelectedSchema }) {
  const schemaList = useSelector((state) => state.schemas.schemaList[moduleId]);
  const allSchemas = useSelector(
    (state) => state.schemas.schemaList,
    (prevFiles, nextFiles) => {
      return isEqual(prevFiles, nextFiles);
    }
  );
  const [isOpen, setIsOpen] = useState(false);
  const { projectName } = useParams();
  const dispatch = useDispatch();

  const toggleModuleExpand = () => {
    setIsOpen(!isOpen);
  };

  const deleteSchema = async (id) => {
    const res = await dispatch(
      handleDeleteSchema({ projectName, payload: { schemaId: id, moduleId: moduleId } })
    ).unwrap();
    if (res && res.message) dispatch(deleteSchemaFromList({ schemaId: id, moduleId: moduleId }));
  };

  const handleDeleteModule = async (moduleId) => {
    await dispatch(deleteModuleById({ projectName, payload: { moduleId } })).unwrap();
    await dispatch(fetchModules({ projectName, payload: { category: 'api_client' } })).unwrap();
  };

  useEffect(() => {
    if (Object.keys(allSchemas).length === 0 && moduleId) {
      dispatch(fetchSchemas({ projectName, payload: { category: 'models', module: moduleId } })).unwrap();
    }
  }, [dispatch, moduleId, projectName, allSchemas]);
  return (
    <>
      <div
        className="br-background-secondary mt-2 "
        style={{ cursor: 'pointer' }}
        onClick={() => {
          toggleModuleExpand();
          setSelectedModule(moduleId);
        }}
      >
        <div className="d-flex justify-content-between">
          <span className="p-1 mx-1 br-text-primary">{title.length > 30 ? `${title.slice(0, 30)}...` : title}</span>
          <div className="mt-1">
            <i
              className="bi bi-plus-circle mx-1 mt-1"
              style={{ cursor: 'pointer' }}
              title="add-schema"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSchema(schemaTemplate);
                setSelectedModule(moduleId);
                setSelectedSchema('');
                setView('SCHEMA_CONFIG');
              }}
            ></i>
            <i
              className="bi bi-trash mx-1 mt-1"
              style={{ cursor: 'pointer' }}
              title="delete-module"
              onClick={() => handleDeleteModule(moduleId)}
            ></i>
          </div>
        </div>
      </div>
      {isOpen &&
        (schemaList && Object.keys(schemaList).length > 0 ? (
          Object.entries(schemaList).map(([key, schema]) => (
            <div
              className="ps-2 my-1"
              style={{ cursor: 'pointer' }}
              key={key}
              onClick={() => {
                setSelectedSchema(key);
                setCurrentSchema(schema);
                setView('SCHEMA_CONFIG');
              }}
            >
              <div className="d-flex justify-content-between">
                <span className="p-1 mx-1 br-text-primary">
                  <i className="bi bi-dot"></i>
                  {schema.name.length > 30 ? `${schema.name.slice(0, 30)}...` : schema.name}
                </span>

                <div>
                  {schema.isUnresolved && <i className="bi bi-exclamation-circle text-danger mx-2 mt-1"></i>}
                  <i
                    className="bi bi-trash mx-1 mt-1"
                    style={{ cursor: 'pointer' }}
                    title="delete-schema"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSchema(key);
                    }}
                  ></i>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="br-text-primary mx-3 my-1">No Schema available</div>
        ))}
    </>
  );
}
ShowModules.propTypes = {
  setView: PropTypes.func.isRequired,
  moduleId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  setSelectedModule: PropTypes.func.isRequired,
  setCurrentSchema: PropTypes.func.isRequired,
  setSelectedSchema: PropTypes.func.isRequired,
};
export default ShowModules;

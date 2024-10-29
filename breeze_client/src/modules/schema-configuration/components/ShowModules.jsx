import { useDispatch, useSelector } from 'react-redux';
import { schemaTemplate } from '../constants/templates';
import { useEffect, useState } from 'react';
import { fetchSchemas } from '../redux/schemaConfigActions';
import { useParams } from 'react-router-dom';

function ShowModules({ setView, moduleId, title, setSelectedModule, setCurrentSchema, setSelectedSchema }) {
  const schemaList = useSelector((state) => state.schemas.schemaList[moduleId]);
  const [isOpen, setIsOpen] = useState(false);
  const { projectName } = useParams();
  const dispatch = useDispatch();

  const toggleModuleExpand = () => {
    if (!isOpen) {
      dispatch(fetchSchemas({ projectName, payload: { category: 'models', module: moduleId } })).unwrap();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    console.log(moduleId, 'moduleis');
    dispatch(fetchSchemas({ projectName, payload: { category: 'models', module: moduleId } })).unwrap();
  }, [dispatch, moduleId, projectName]);
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
          <span className="p-1 mx-1 br-text-primary">{title}</span>
          <i
            className="bi bi-plus-circle mx-1 mt-1"
            style={{ cursor: 'pointer' }}
            title="add-schema"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSchema(schemaTemplate);
              setSelectedModule(moduleId);
              setView('SCHEMA_CONFIG');
            }}
          ></i>
        </div>
      </div>
      {isOpen &&
        schemaList &&
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
            <i className="bi bi-dot"></i> {schema.name}
          </div>
        ))}
    </>
  );
}

export default ShowModules;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModules } from '../../service-configuration/redux/ApiClientActions';
import { editSchema, fetchSchemas } from '../../schema-configuration/redux/schemaConfigActions';
import ObjectDetails from '../components/ObjectDetails';
import { CustomButtonField, CustomTextInput } from '../../../common/fields';
import AddModule from '../../service-configuration/components/AddModule';
import { schemaTemplate } from '../constants/templates';

function SchemaSettings() {
  const { moduleList } = useSelector((state) => state.services);
  const { schemaList } = useSelector((state) => state.schemas);
  const [expandedModule, setExpandedModule] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [view, setView] = useState('ADD_MODULE');
  const [currentSchema, setCurrentSchema] = useState({});
  const { projectName } = useParams();
  const dispatch = useDispatch();
  // console.log('chanhe>>', currentSchema);

  useEffect(() => {
    dispatch(fetchModules({ projectName, payload: { category: 'api_client' } })).unwrap();
  }, [dispatch, projectName]);

  const toggleModuleExpand = (moduleId) => {
    dispatch(fetchSchemas({ projectName, payload: { category: 'models', module: moduleId } })).unwrap();
    setExpandedModule((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]));
  };

  const updateSchema = async (schema) => {
    // console.log(schema);
    setCurrentSchema({ ...schema });
  };

  const handleChange = (newName) => {
    const updatedSchema = { ...currentSchema };
    updatedSchema['name'] = newName;
    setCurrentSchema({ ...updatedSchema });
  };

  const handleSubmit = async () => {
    await dispatch(
      editSchema({
        projectName,
        payload: { moduleId: selectedModule, details: currentSchema, schemaId: selectedSchema, editedName: '' },
      })
    ).unwrap();
    await dispatch(fetchSchemas({ projectName, payload: { category: 'models', module: selectedModule } })).unwrap();
  };

  return (
    <div className="container-fluid h-100 overflow-auto">
      <div className="row h-100 br-background-primary">
        <div className="col-sm-3 h-100" style={{ borderRight: '1px solid rgba(128, 128, 128, 0.5)' }}>
          <div className="mt-2 d-flex justify-content-between">
            <h5 className="mt-1 br-text-primary">Schema Configuration</h5>
            <i
              className="bi bi-plus-circle mx-1 mt-1"
              title="add-module"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setView('ADD_MODULE');
              }}
            ></i>
          </div>
          {Object.keys(moduleList).length === 0 ? (
            <div className="text-center mt-4">No modules present</div>
          ) : (
            Object.entries(moduleList).map(([key, module]) => (
              <>
                <div
                  className="br-background-secondary mt-2 "
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    toggleModuleExpand(key);
                    setSelectedModule(key);
                  }}
                >
                  <div className="d-flex justify-content-between">
                    <span className="p-1 mx-1 br-text-primary">{module.title}</span>
                    <i
                      className="bi bi-plus-circle mx-1 mt-1"
                      style={{ cursor: 'pointer' }}
                      title="add-schema"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSchema(schemaTemplate);
                        setSelectedModule(key);
                        setView('SCHEMA_CONFIG');
                      }}
                    ></i>
                  </div>
                </div>
                {expandedModule.includes(key) &&
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
            ))
          )}
        </div>
        {view === 'SCHEMA_CONFIG' && (
          <div className="col-sm-9 mt-2 d-flex flex-column justify-content-between ">
            <div>
              <div className="br-background-secondary d-flex justify-content-center">
                <h5 className="mt-1 br-text-primary">Schema Details</h5>
              </div>
              <div className="row my-3">
                <div className="col-sm-3">
                  <label className="br-text-primary">Name:</label>
                </div>
                <div className="col-sm-9">
                  <CustomTextInput
                    className="form-control br-form-control form-control-sm"
                    placeholder="Name"
                    value={currentSchema?.name}
                    onChange={(value) => handleChange(value)}
                  />
                </div>
              </div>
              <div className="row">
                <ObjectDetails objectData={currentSchema} onUpdate={updateSchema} moduleId={selectedModule} />
              </div>
            </div>
            <div className="d-flex justify-content-end mb-3">
              <CustomButtonField label="Update" onClick={handleSubmit} className="btn btn-filled med-font" />
            </div>
          </div>
        )}
        {view === 'ADD_MODULE' && (
          <div className="col-sm-9 mt-2">
            <AddModule />
          </div>
        )}
      </div>
    </div>
  );
}

export default SchemaSettings;

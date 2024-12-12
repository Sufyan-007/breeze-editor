import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import { elementAttributes } from '../../constants/AllELements';
import { getAllProps } from '../../services/componentListService';
const PropsConfig = ({ selectedCategory, component = null, library = '', setconfiguredPropsList }) => {
  const [props, setProps] = useState({});
  const { projectName } = useParams();
  useEffect(() => {
    async function fetchData() {
      try {
        if (selectedCategory === 'html') {
          const propList = elementAttributes.data[component[1]] || {};
          setProps(propList);
          setconfiguredPropsList({});
        } else {
          const match = library.match(/^(.*)@([^@]+)$/);
          const libName = match ? match[1] : null;
          const version = match ? match[2] : null;

          const payLoad = {
            category: selectedCategory,
            resource: selectedCategory === 'components' ? component[0] : component[1],
            select: ['props'],
            libname: libName,
            libversion: version,
            module: 'component',
          };

          const propList = await getAllProps(projectName, payLoad);
          setProps(propList);
          setconfiguredPropsList({});
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    }
    if (component !== null) fetchData();
  }, [selectedCategory, component, library, projectName]);

  if (!component) return null;
  const handlePropChange = (e, prop_name) => {
    const newValue = e.target.value;

    setconfiguredPropsList((prev) => ({
      ...prev,
      [prop_name]: newValue,
    }));
  };

  return (
    <>
      <div
        style={{
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          height: 'auto',
          maxHeight: '20rem',
          borderRadius: '.7rem',
          marginTop: '1rem',
          // border: '1px solid #f0f0f0',
        }}
      >
        <div>
          {props?.props && Object.values(props.props).length > 0 ? (
            Object.values(props.props).map((property) => (
              <div
                key={property.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '.2rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  marginBottom: '.5rem',
                }}
                data-bs-toggle="tooltip"
                data-bs-placement="top" // Options: top, bottom, left, right
                title={property.type}
              >
                <span className="br-text-primary">{property.prop_name}</span>
                <span>
                  <input
                    className="form-control-sm w-100 br-background-secondary br-text-primary border-0 removeFocusedBorder"
                    type="text"
                    defaultValue={property.default_value}
                    onChange={(e) => handlePropChange(e, property.prop_name)}
                  />
                </span>
              </div>
            ))
          ) : (
            <p className="br-text-primary ps-4">No props available</p>
          )}
        </div>
      </div>
    </>
  );
};

PropsConfig.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  component: PropTypes.arrayOf(PropTypes.string),
  library: PropTypes.string,
};

PropsConfig.defaultProps = {
  component: null,
  library: '',
};
export default PropsConfig;

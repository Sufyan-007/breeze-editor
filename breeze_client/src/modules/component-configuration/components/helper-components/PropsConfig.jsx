import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';

import { getAllProps } from '../../services/componentListService';
const PropsConfig = ({ selectedCategory, component = null, library = '' }) => {
  const [props, setProps] = useState({});
  const { projectName } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const match = library.match(/^(.*)@([^@]+)$/);
        const libName = match ? match[1] : null;
        const version = match ? match[2] : null;
        const payLoad = {
          category: selectedCategory,
          resource: component,
          select: ['props'],
          libname: libName,
          libversion: version,
        };

        const propList = await getAllProps(projectName, payLoad);
        setProps(propList?.data);
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    }
    if (component !== null) fetchData();
  }, [selectedCategory, component, library, projectName]);

  if (!component) return null;

  return (
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
      {props?.props &&
        Object.values(props.props).map((property) => (
          <div
            key={property.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '.2rem',
              //   borderBottom: '1px solid #f0f0f0',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              marginBottom: '.5rem',
            }}
          >
            <span>{property.prop_name}</span>

            <span>
              <input
                className="form-control br-background-secondary br-text-primary border-0 removeFocusedBorder"
                type="text"
                defaultValue={property.default_value}
              />
            </span>
          </div>
        ))}
    </div>
  );
};

PropsConfig.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  component: PropTypes.object,
  library: PropTypes.string,
};
export default PropsConfig;

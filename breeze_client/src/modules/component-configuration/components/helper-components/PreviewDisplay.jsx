import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getProjectPort } from '../../services/componentListService';
import PreviewCustomStyling from './PreviewCustomStyling';
import PropTypes from 'prop-types';

const PreviewDisplay = ({ showPreview, component, library = null, propsList }) => {
  const [projectPort, setProjectPort] = useState(3000);
  const { projectName } = useParams();
  const sandboxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  };

  const [styles, setStyles] = useState({
    margin: '',
    marginTop: '',
    marginRight: '',
    marginBottom: '',
    marginLeft: '',
    padding: '',
    paddingTop: '',
    paddingRight: '',
    paddingBottom: '',
    paddingLeft: '',
    width: '',
    minWidth: '',
    maxWidth: '',
    height: '',
    minHeight: '',
    maxHeight: '',
    borderWidth: '',
    borderStyle: '',
    borderColor: '',
    color: '',
    backgroundColor: '',
    fontSize: '',
    fontFamily: '',
    fontWeight: '',
    fontStyle: '',
  });
  useEffect(() => {
    const fetchPort = async () => {
      const port = await getProjectPort(projectName);
      setProjectPort(port.port);
    };

    fetchPort();
  }, [projectName]);

  useEffect(() => {
    const handler = (message) => {
      if (message.data.source === 'APP') {
        if (message.data.type === 'request') {
          if (message.data.request.type === 'props') {
            const iframe = document.getElementById('iFrame');

            iframe.contentWindow.postMessage(
              {
                type: 'resource',
                resource: { type: 'props', props: convertObject(propsList) },
              },
              '*'
            );
            // iframe.contentWindow.postMessage(
            //   {
            //     type: 'resource',
            //     resource: { type: 'style', style: ' bg-dark' },
            //   },
            //   '*'
          }
        }
      }
    };

    window.addEventListener('message', handler);

    return () => {
      window.removeEventListener('message', handler);
    };
  }, []);

  //   useEffect(() => {
  //     const iframe = document.getElementById('iFrame');
  //     iframe.contentWindow.postMessage(
  //       {
  //         type: 'resource',
  //         resource: { type: 'component', component: config },
  //       },
  //       '*'
  //     );
  //   }, []);
  useEffect(() => {
    const handler = (message) => {
      if (message.data.source === 'APP') {
        // if (message.data.type === 'elementDrop') {
        //   messageListener.onElementDrop(message.data);
        // }
        if (message.data.type === 'request') {
          const request = message.data.request;
          if (request.type === 'component') {
            let libName;
            if (library.includes('@')) {
              const match = library.match(/^(.*)@([^@]+)$/);
              libName = match ? match[1] : null;
            } else {
              libName = library;
            }

            // const version = match ? match[2] : null;
            const iframe = document.getElementById('iFrame');
            iframe.contentWindow.postMessage(
              {
                type: 'resource',
                resource: {
                  isPreview: true,
                  type: 'component',
                  component: { name: component, library: libName, sandboxStyle: sandboxStyle },
                },
              },
              '*'
            );
          }
        }
      }
    };
    window.addEventListener('message', handler);
    setTimeout(async () => {
      const iframe = document.getElementById('iFrame');

      if (iframe) {
        iframe.contentWindow.postMessage({ func: '()=>{console.log(" Hello World") }' }, '*');
      }
    }, 500);
    return () => {
      window.removeEventListener('message', handler);
    };
  }, []);
  useEffect(() => {
    let libName;
    if (library.includes('@')) {
      const match = library.match(/^(.*)@([^@]+)$/);
      libName = match ? match[1] : null;
    } else {
      libName = library;
    }

    // const version = match ? match[2] : null;
    const iframe = document.getElementById('iFrame');
    iframe.contentWindow.postMessage(
      {
        type: 'resource',
        resource: {
          isPreview: true,
          type: 'component',
          component: { name: component, library: libName, sandboxStyle: sandboxStyle, styles: styles },
        },
      },
      '*'
    );
    iframe.contentWindow.postMessage(
      {
        type: 'resource',
        resource: { type: 'props', props: convertObject(propsList) },
      },
      '*'
    );
  }, [showPreview, styles]);
  const convertObject = (inputObj) => {
    const result = {};
    // Iterate through the keys at the top level
    Object.keys(inputObj).forEach((key) => {
      // Extract the second-level object's values (assuming the desired value is the last key)
      const innerObj = inputObj[key];
      const values = Object.values(innerObj);

      // Take the last value (e.g., "e" from {b: "c", d: "e"})
      result[key] = values[values.length - 1];
    });
    return result;
  };

  return (
    <div className="d-flex justify-content-between">
      <div
        className=" iframe-container mt-2 w-50 "
        // style={{
        //   width: '250px',
        //   height: '150px',
        //   padding: '0',
        //   overflow: 'hidden',
        // }}
      >
        <iframe
          // src={`http://localhost:5174/breeze/sandbox`}
          src={`${import.meta.env.VITE_GENERATED_PROJECT_DOMAIN}:${projectPort}/breeze/sandbox`}
          title="Preview"
          width="100%"
          height="100%"
          id="iFrame"
          // style={{
          //   transform: 'scale(0.8)',

          //   transformOrigin: '0 0',
          // }}
        ></iframe>
      </div>

      <PreviewCustomStyling styles={styles} setStyles={setStyles} />
    </div>
  );
};
PreviewDisplay.propTypes = {
  showPreview: PropTypes.number,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  library: PropTypes.string,
  propsList: PropTypes.object,
};
export default PreviewDisplay;

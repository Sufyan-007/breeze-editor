import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import BreezeOffCanvas from '../common/display/offcanvas/BreezeOffcanvas';
import PropTypes from 'prop-types';

const OffcanvasContext = createContext();

export const useOffcanvas = () => useContext(OffcanvasContext);

export const OffcanvasProvider = ({ children }) => {
  const [offcanvasConfig, setOffcanvasConfig] = useState({
    isVisible: false,
    content: null,
    title: 'Breeze Off-canvas',
    placement: 'end',
    backdrop: true,
    size: '50%',
  });

  const showOffcanvas = useCallback((component, newTitle, newPlacement, newBackdrop, newSize) => {
    setOffcanvasConfig({
      isVisible: true,
      content: component,
      title: newTitle || 'Breeze Off-canvas',
      placement: newPlacement || 'end',
      backdrop: newBackdrop !== undefined ? newBackdrop : true,
      size: newSize || '40%',
    });
  }, []);

  const closeOffcanvas = useCallback(() => {
    setOffcanvasConfig((prevConfig) => ({
      ...prevConfig,
      isVisible: false,
      content: null,
    }));
  }, []);

  const setOffcanvasSize = useCallback((newSize) => {
    setOffcanvasConfig((prevConfig) => ({
      ...prevConfig,
      size: newSize,
    }));
  }, []);

  const contextValue = useMemo(
    () => ({
      showOffcanvas,
      closeOffcanvas,
      setOffcanvasSize,
    }),
    [showOffcanvas, closeOffcanvas, setOffcanvasSize]
  );

  return (
    <OffcanvasContext.Provider value={contextValue}>
      {children}

      <BreezeOffCanvas
        show={offcanvasConfig.isVisible}
        onClose={closeOffcanvas}
        title={offcanvasConfig.title}
        placement={offcanvasConfig.placement}
        backdrop={offcanvasConfig.backdrop}
        size={offcanvasConfig.size}
      >
        {/* {offcanvasConfig.content ? <offcanvasConfig.content /> : null} Render content if available */}
        {offcanvasConfig.content}
      </BreezeOffCanvas>
    </OffcanvasContext.Provider>
  );
};

OffcanvasProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

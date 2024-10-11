import { useRef, useState } from 'react';
import PropTypes from 'prop-types';

function CustomFileUploadField({
  onFileSelect = () => {},
  accept = '*',
  disabled = false,
  style = {},
  spanStyle = {
    display: 'inline-block',
    textAlign: 'left',
    marginLeft: '20px',
    color: 'br-text-primary',
  },
  className = '',
  icon = null,
  autoFocus = false,
  formTarget = '',
  contentEditable = false,
  contextMenu = '',
  draggable = false,
  hidden = false,
  id = '',
  lang = '',
  spellCheck = true,
  tabIndex = 0,
  title = '',
  translate = 'yes',
  config = {},
  multiple = false,
  ...eventHandlers
}) {
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState('No file chosen');
  //handle file selection
  const handleFileChange = (event) => {
    const files = event.target.files;
    const fileName = multiple ? [...files].map((file) => file.name).join(', ') : files[0]?.name || 'No file chosen';
    setSelectedFileName(fileName);
    onFileSelect(multiple ? [...files] : files[0]);
  };

  //trigger the hidden file input
  const handleClick = () => {
    if (!disabled) fileInputRef.current.click();
  };

  return (
    <div className={config.groupClass || 'form-group'}>
      {config.outerlabel && (
        <label className="form-label br-text-primary med-font fw-semibold">{config.outerlabel}</label>
      )}
      <div
        onClick={handleClick}
        disabled={disabled}
        style={style}
        className={className ? className : config.className}
        autoFocus={autoFocus}
        formTarget={formTarget}
        contentEditable={contentEditable}
        contextMenu={contextMenu}
        draggable={draggable}
        hidden={hidden}
        id={id}
        lang={lang}
        spellCheck={spellCheck}
        tabIndex={tabIndex}
        title={title}
        translate={translate}
        {...eventHandlers}
      >
        {icon && <span style={{ marginRight: '10px' }}>{icon}</span>}
        <label>{config.innerlabel}</label>
        <span style={spanStyle}>{selectedFileName}</span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        className={
          config ? (config.className ? config.className : 'form-control br-form-control form-control-sm') : className
        }
        accept={accept}
        multiple={multiple}
        disabled={disabled}
      />
    </div>
  );
}

CustomFileUploadField.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  label: PropTypes.string,
  accept: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  spanStyle: PropTypes.object,
  className: PropTypes.string,
  icon: PropTypes.node,
  autoFocus: PropTypes.bool,
  formTarget: PropTypes.oneOf(['_self', '_blank', '_parent', '_top']),
  contentEditable: PropTypes.bool,
  contextMenu: PropTypes.string,
  draggable: PropTypes.bool,
  hidden: PropTypes.bool,
  id: PropTypes.string,
  lang: PropTypes.string,
  spellCheck: PropTypes.bool,
  tabIndex: PropTypes.number,
  title: PropTypes.string,
  translate: PropTypes.oneOf(['yes', 'no']),
  config: PropTypes.object, // Custom config object for classes
  multiple: PropTypes.bool, // Allow multiple file uploads
};

export default CustomFileUploadField;

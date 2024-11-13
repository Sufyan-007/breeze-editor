import PropTypes from 'prop-types';

function CustomButtonField({
  label,
  onClick = () => {},
  type = 'button',
  disabled = false,
  style = {},
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
  config,
  ...eventHandlers
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={className || config?.className || 'btn btn-sm btn-primary'}
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
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}

CustomButtonField.propTypes = {
  config: PropTypes.any,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  icon: PropTypes.node,
  autoFocus: PropTypes.bool,
  formTarget: PropTypes.oneOf(['_self', '_blank', '_parent', '_top']),
  contentEditable: PropTypes.bool,
  contextMenu: PropTypes.string,
  dir: PropTypes.oneOf(['ltr', 'rtl']),
  draggable: PropTypes.bool,
  hidden: PropTypes.bool,
  id: PropTypes.string,
  lang: PropTypes.string,
  spellCheck: PropTypes.bool,
  tabIndex: PropTypes.number,
  title: PropTypes.string,
  translate: PropTypes.oneOf(['yes', 'no']),
};

export default CustomButtonField;

import PropTypes from 'prop-types';

function CustomButtonField({
  label = 'Button',
  onClick = () => {},
  type = 'button',
  disabled = false,
  style = {},
  className = '',
  icon = null,
  name = '',
  value = '',
  autoFocus = false,
  form = '',
  formAction = '',
  formEncType = '',
  formMethod = '',
  formNoValidate = false,
  formTarget = '',
  contentEditable = false,
  contextMenu = '',
  dir = 'ltr',
  draggable = false,
  hidden = false,
  id = '',
  lang = '',
  spellCheck = true,
  tabIndex = 0,
  title = '',
  translate = 'yes',
  ...eventHandlers
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={className}
      name={name}
      value={value}
      autoFocus={autoFocus}
      form={form}
      formAction={formAction}
      formEncType={formEncType}
      formMethod={formMethod}
      formNoValidate={formNoValidate}
      formTarget={formTarget}
      contentEditable={contentEditable}
      contextMenu={contextMenu}
      dir={dir}
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
      {icon && <span className="button-icon">{icon}</span>}
      {label}
    </button>
  );
}

CustomButtonField.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  icon: PropTypes.node,
  name: PropTypes.string,
  value: PropTypes.string,
  autoFocus: PropTypes.bool,
  form: PropTypes.string,
  formAction: PropTypes.string,
  formEncType: PropTypes.oneOf(['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain']),
  formMethod: PropTypes.oneOf(['GET', 'POST']),
  formNoValidate: PropTypes.bool,
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

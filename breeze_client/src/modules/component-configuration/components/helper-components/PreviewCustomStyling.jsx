import { useState } from 'react';
import '../../styles/addElement.css';
import PropTypes from 'prop-types';
const PreviewCustomStyling = ({ styles, setStyles }) => {
  const [openSection, setOpenSection] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // if (name !== 'borderStyle' && name !== 'borderColor') {
    //   const newValue = value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters
    //   setStyles((prevStyles) => ({
    //     ...prevStyles,
    //     [name]: newValue ? `${newValue}px` : '', // Append 'px' if the value is numeric
    //   }));
    // } else {
    // For borderStyle and borderColor, no 'px' logic
    setStyles((prevStyles) => ({
      ...prevStyles,
      [name]: value,
    }));
    // }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="container mt-2 w-50">
      {/* Space Settings */}
      <div className="accordion-item border">
        <h2 className="accordion-header" onClick={() => toggleSection('margin')} style={{ cursor: 'pointer' }}>
          <button className="accordion-button p-1" type="button">
            <span className="w-50 br-text-primary"> Margin</span>
            <span className="w-50 text-end">{openSection === 'margin' ? '-' : '+'}</span>
          </button>
        </h2>
        {openSection === 'margin' && (
          <div className="accordion-body p-1 input-group">
            <input
              type="text"
              name="margin"
              placeholder="Margin"
              value={styles.margin}
              // value={styles.margin.replace('px', '')}

              onChange={handleChange}
              className="form-control-sm mb-1 w-100 br-background-secondary br-text-primary border-0"
            />
            <div className="d-flex flex-wrap justify-content-between w-100  ">
              <input
                type="text"
                name="marginTop"
                placeholder="Margin Top"
                value={styles.marginTop}
                onChange={handleChange}
                className="form-control-sm mb-1 addELementWidth40 br-background-secondary br-text-primary border-0"
              />

              <input
                type="text"
                name="marginRight"
                placeholder="Margin Right"
                value={styles.marginRight}
                onChange={handleChange}
                className="form-control-sm mb-1 addELementWidth40 br-background-secondary br-text-primary border-0"
              />
              <input
                type="text"
                name="marginBottom"
                placeholder="Margin Bottom"
                value={styles.marginBottom}
                onChange={handleChange}
                className="form-control-sm mb-1 addELementWidth40 br-background-secondary br-text-primary border-0"
              />
              <input
                type="text"
                name="marginLeft"
                placeholder="Margin Left"
                value={styles.marginLeft}
                onChange={handleChange}
                className="form-control-sm mb-1 addELementWidth40 br-background-secondary br-text-primary border-0"
              />
            </div>
          </div>
        )}
      </div>
      {/* {Padding} */}
      <div className="accordion-item border">
        <h2 className="accordion-header" onClick={() => toggleSection('padding')} style={{ cursor: 'pointer' }}>
          <button className="accordion-button p-1" type="button">
            <span className="w-50 br-text-primary">Padding</span>
            <span className="w-50 text-end">{openSection === 'padding' ? '-' : '+'}</span>
          </button>
        </h2>
        {openSection === 'padding' && (
          <div className="accordion-body p-1 input-group">
            <input
              type="text"
              name="padding"
              placeholder="Padding"
              value={styles.padding}
              onChange={handleChange}
              className="form-control-sm mb-1 w-100 br-background-secondary br-text-primary border-0"
            />
            <div className="d-flex flex-wrap justify-content-between w-100 ">
              <input
                type="text"
                name="paddingTop"
                placeholder="Padding Top"
                value={styles.paddingTop}
                onChange={handleChange}
                className="form-control-sm mb-1 addELementWidth40 br-background-secondary br-text-primary border-0"
              />
              <input
                type="text"
                name="paddingRight"
                placeholder="Padding Right"
                value={styles.paddingRight}
                onChange={handleChange}
                className="form-control-sm mb-1 addELementWidth40 br-background-secondary br-text-primary border-0"
              />
              <input
                type="text"
                name="paddingBottom"
                placeholder="Padding Bottom"
                value={styles.paddingBottom}
                onChange={handleChange}
                className="form-control-sm mb-1 addELementWidth40 br-background-secondary br-text-primary border-0"
              />
              <input
                type="text"
                name="paddingLeft"
                placeholder="Padding Left"
                value={styles.paddingLeft}
                onChange={handleChange}
                className="form-control-sm mb-1 addELementWidth40 br-background-secondary br-text-primary border-0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Size Settings */}
      <div className="accordion-item border">
        <h2 className="accordion-header" onClick={() => toggleSection('size')} style={{ cursor: 'pointer' }}>
          <button className="accordion-button collapsed p-1" type="button">
            <span className="w-50 br-text-primary">Size </span>
            <span className="w-50 text-end">{openSection === 'size' ? '-' : '+'}</span>
          </button>
        </h2>
        {openSection === 'size' && (
          <div className="accordion-body p-1">
            <p className="m-1 br-text-primary">Width</p>
            <div className="d-flex flex-wrap justify-content-between w-100 ">
              <input
                type="text"
                name="width"
                placeholder="Width"
                value={styles.width}
                onChange={handleChange}
                className="form-control-sm mb-1 w-25 br-background-secondary br-text-primary border-0"
              />
              <input
                type="text"
                name="minWidth"
                placeholder="Min Width"
                value={styles.minWidth}
                onChange={handleChange}
                className="form-control-sm mb-1 w-25 br-background-secondary br-text-primary border-0"
              />
              <input
                type="text"
                name="maxWidth"
                placeholder="Max Width"
                value={styles.maxWidth}
                onChange={handleChange}
                className="form-control-sm mb-1 w-25 br-background-secondary br-text-primary border-0"
              />
            </div>
            <p className="m-1 br-text-primary">Height</p>
            <div className="d-flex flex-wrap justify-content-between w-100 ">
              <input
                type="text"
                name="height"
                placeholder="Height"
                value={styles.height}
                onChange={handleChange}
                className="form-control-sm mb-1 w-25 br-background-secondary br-text-primary border-0"
              />
              <input
                type="text"
                name="minHeight"
                placeholder="Min Height"
                value={styles.minHeight}
                onChange={handleChange}
                className="form-control-sm mb-1 w-25 br-background-secondary br-text-primary border-0"
              />
              <input
                type="text"
                name="maxHeight"
                placeholder="Max Height"
                value={styles.maxHeight}
                onChange={handleChange}
                className="form-control-sm mb-1 w-25 br-background-secondary br-text-primary border-0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Border Settings */}
      <div className="accordion-item border">
        <h2 className="accordion-header" onClick={() => toggleSection('border')} style={{ cursor: 'pointer' }}>
          <button
            className="accordion-button collapsed p-1 d-flex justify-content-between align-items-center"
            type="button"
          >
            <span className="w-50 br-text-primary">Border</span>
            <span className="w-50 text-end">{openSection === 'border' ? '-' : '+'}</span>
          </button>
        </h2>
        {openSection === 'border' && (
          <div className="accordion-body p-1">
            <div className="d-flex flex-wrap justify-content-between w-100 ">
              <input
                type="text"
                name="borderWidth"
                placeholder="Width"
                value={styles.borderWidth}
                onChange={handleChange}
                className="form-control-sm mb-1 w-25 br-background-secondary br-text-primary border-0 "
              />
              <input
                type="text"
                name="borderStyle"
                placeholder="Style"
                value={styles.borderStyle}
                onChange={handleChange}
                className="form-control-sm mb-1 w-25 br-background-secondary br-text-primary border-0"
              />
              <div className="d-flex align-items-center addELementWidth40 mb-1">
                <input
                  type="color"
                  name="borderColor"
                  value={styles.borderColor}
                  onChange={(e) => handleChange(e)}
                  className="form-control-color-sm  p-0 border-1"
                  style={{ width: '20%' }}
                />
                <input
                  type="text"
                  name="borderColor"
                  value={styles.borderColor}
                  onChange={(e) => handleChange(e)}
                  placeholder="color"
                  className="form-control-sm br-background-secondary br-text-primary  border-0"
                  style={{ width: '80%' }}
                />
              </div>
              {/* <input
                type="color"
                name="borderColor"
                placeholder="Color"
                value={styles.borderColor}
                onChange={handleChange}
                className="form-control-sm mb-1 w-25 br-background-secondary br-text-primary border-0 "
              /> */}
            </div>
          </div>
        )}
      </div>
      <div className="accordion-item text-properties border">
        <h2 className="accordion-header" onClick={() => toggleSection('text')} style={{ cursor: 'pointer' }}>
          <button
            className="accordion-button collapsed p-1 d-flex justify-content-between align-items-center"
            type="button"
          >
            <span className="w-50 br-text-primary">Text Properties</span>
            <span className="w-50 text-end">{openSection === 'text' ? '-' : '+'}</span>
          </button>
        </h2>
        {openSection === 'text' && (
          <div className="accordion-body p-1">
            <div className="d-flex flex-wrap justify-content-between w-100">
              {/* Text Color */}
              {/* <input
                type="color"
                name="color"
                title="Text Color"
                value={styles.color}
                onChange={handleChange}
                className="form-control-sm mb-1 addELementWidth40 br-background-secondary br-text-primary"
              /> */}
              <div className="d-flex align-items-center addELementWidth40 mb-1">
                <input
                  type="color"
                  name="color"
                  value={styles.color}
                  onChange={(e) => handleChange(e, 'color')}
                  className="form-control-color-sm  p-0 border-1"
                  style={{ width: '20%' }}
                />
                <input
                  type="text"
                  name="color"
                  value={styles.color}
                  onChange={(e) => handleChange(e)}
                  placeholder="color"
                  className="form-control-sm br-background-secondary br-text-primary  border-0"
                  style={{ width: '80%' }}
                />
              </div>
              {/* Background Color */}
              <div className="d-flex align-items-center addELementWidth40 mb-1">
                <input
                  type="color"
                  name="backgroundColor"
                  value={styles.backgroundColor}
                  onChange={(e) => handleChange(e, 'color')}
                  className="form-control-color-sm  p-0 border-1"
                  style={{ width: '20%' }}
                />
                <input
                  type="text"
                  name="backgroundColor"
                  value={styles.backgroundColor}
                  onChange={(e) => handleChange(e)}
                  placeholder="Background Color"
                  className="form-control-sm br-background-secondary br-text-primary  border-0"
                  style={{ width: '80%' }}
                />
              </div>

              {/* Text Decoration */}
              <select
                name="textDecoration"
                value={styles.textDecoration}
                onChange={handleChange}
                className="form-select-sm mb-1 addELementWidth40 br-background-secondary br-text-primary"
              >
                <option value="">Decoration</option>
                <option value="none">None</option>
                <option value="underline">Underline</option>
                <option value="line-through">Line Through</option>
                <option value="overline">Overline</option>
              </select>
              {/* Font Size */}
              <input
                type="text"
                name="fontSize"
                placeholder="Font Size"
                value={styles.fontSize}
                onChange={handleChange}
                className="form-control-sm mb-1 addELementWidth40 br-background-secondary br-text-primary border-0"
              />
              {/* Font Family */}
              <input
                type="text"
                name="fontFamily"
                placeholder="Font Family"
                value={styles.fontFamily}
                onChange={handleChange}
                className="form-control-sm mb-1 addELementWidth40 br-background-secondary br-text-primary border-0"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewCustomStyling;

PreviewCustomStyling.propTypes = {
  styles: PropTypes.shape({
    margin: PropTypes.string,
    marginTop: PropTypes.string,
    marginRight: PropTypes.string,
    marginBottom: PropTypes.string,
    marginLeft: PropTypes.string,
    padding: PropTypes.string,
    paddingTop: PropTypes.string,
    paddingRight: PropTypes.string,
    paddingBottom: PropTypes.string,
    paddingLeft: PropTypes.string,
    width: PropTypes.string,
    minWidth: PropTypes.string,
    maxWidth: PropTypes.string,
    height: PropTypes.string,
    minHeight: PropTypes.string,
    maxHeight: PropTypes.string,
    borderWidth: PropTypes.string,
    borderStyle: PropTypes.string,
    borderColor: PropTypes.string,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    fontSize: PropTypes.string,
    fontFamily: PropTypes.string,
    fontWeight: PropTypes.string,
    fontStyle: PropTypes.string,
  }),
  setStyles: PropTypes.func.isRequired, // Ensure setStyles is a function
};

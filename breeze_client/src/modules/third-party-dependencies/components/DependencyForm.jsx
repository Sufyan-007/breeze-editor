import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/thirdparty.css';
import { CustomButtonField, CustomRadioButtonField, CustomTextInput, CustomSelectField } from '../../../common/fields';
import { fetchDependencySuggestions } from '../services/ThirdPartyDependenciesService';

function DependencyForm({ onSubmit }) {
  const [query, setQuery] = useState({ name: '', version: '' });
  const [useLatestVersion, setUseLatestVersion] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimeoutRef = useRef(null);

  const handleInputChange = async (value) => {
    setQuery({ ...query, name: value });

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (value.length > 0) {
        const newSuggestions = await fetchDependencySuggestions(value);
        setSuggestions(newSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleRadioChange = (value) => {
    setUseLatestVersion(value === 'latest');
    if (value === 'latest') {
      setQuery({ ...query, version: '*' });
    } else {
      setQuery({ ...query, version: 'Select version' });
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    console.log('suggestion::>>', suggestion);
  };

  return (
    <div className="h-100">
      <form className="prop-config-form h-100">
        <div className="d-flex flex-column justify-content-between h-100">
          <div>
            <CustomTextInput
              name="query"
              value={query.name}
              onChange={(value) => handleInputChange(value)}
              config={{
                label: 'Search NPM package',
                groupClass: 'form-group mb-2',
              }}
            />

            <div className="suggestion-container">
              <div id="suggestions">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion" onClick={() => handleSuggestionClick(suggestion)}>
                    <div>{suggestion.name}</div>
                    <div>{suggestion.version}</div>
                  </div>
                ))}
              </div>
            </div>

            <CustomRadioButtonField
              name="latestVersion"
              value="latest"
              options={[{ label: 'Use Latest Version', value: 'latest' }]}
              onChange={(value) => handleRadioChange(value)}
              config={{ label: 'Use latest version', groupClass: 'form-check' }}
            />

            <CustomRadioButtonField
              name="selectVersion"
              value="select"
              options={[{ label: 'Select Version', value: 'select' }]}
              onChange={(value) => handleRadioChange(value)}
              config={{ label: 'Select Version version', groupClass: 'form-check' }}
            />

            <CustomSelectField
              name="version"
              value={query.version}
              onChange={(value) => setQuery({ ...query, version: value })}
              options={[
                { label: 'Select version', value: '' },
                { label: '1', value: '1' },
              ]}
              config={{ groupClass: 'form-group mb-2' }}
            />
          </div>

          <div className="d-flex justify-content-end">
            <CustomButtonField type="button" label="Submit" className="btn btn-filled med-font" onClick={onSubmit} />
          </div>
        </div>
      </form>
    </div>
  );
}

DependencyForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default DependencyForm;

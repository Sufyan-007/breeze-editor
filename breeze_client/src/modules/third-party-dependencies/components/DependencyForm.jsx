import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/thirdparty.css';
import { CustomButtonField, CustomRadioButtonField, CustomTextInput, CustomSelectField } from '../../../common/fields';
import { fetchDependencyVersions, fetchDependencySuggestions } from '../services/ThirdPartyDependenciesService';
import { BreezeLoader } from '../../../common/display';

function DependencyForm({ initialData, isEditMode, onSubmit }) {
  const [query, setQuery] = useState({ name: '', version: '' });
  const [useLatestVersion, setUseLatestVersion] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [versionOptions, setVersionOptions] = useState([]);
  const debounceTimeoutRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setQuery({ name: initialData.name, version: initialData.version });
      setUseLatestVersion(initialData.version === '*');
    }
  }, [initialData]);

  const handleInputChange = async (value) => {
    setQuery({ ...query, name: value });

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (value.length > 0) {
        setLoading(true);
        try {
          const newSuggestions = await fetchDependencySuggestions(value);
          setSuggestions(newSuggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 500);
  };
  const handleRadioChange = async (value) => {
    setUseLatestVersion(value === 'latest');
    if (value === 'latest') {
      setQuery({ ...query, version: '*' });
    } else if (query.name) {
      setLoading(true);
      try {
        const versions = await fetchDependencyVersions(query.name);
        setVersionOptions(versions.map((v) => ({ label: v, value: v })));
        setQuery({ ...query, version: versions[0] || '' });
      } catch (error) {
        console.error('Error fetching versions:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setQuery({ name: suggestion.name, version: '*' });
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(query);
    setQuery({ name: '', version: '*' });
    setUseLatestVersion(true);
  };

  return (
    <div className="h-100">
      {loading && <BreezeLoader />}
      <form className="prop-config-form h-100" onSubmit={handleSubmit}>
        <div className="d-flex flex-column justify-content-between h-100">
          <div>
            <CustomTextInput
              name="query"
              value={query.name}
              onChange={(value) => handleInputChange(value)}
              config={{
                label: 'Search NPM package',
                groupClass: 'form-group mb-2',
                disabled: isEditMode,
              }}
              placeholder={'Search..'}
            />

            {query.name.length > 1 && (
              <div className="suggestion-container">
                <div id="suggestions">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="suggestion" onClick={() => handleSuggestionClick(suggestion)}>
                      <div>{suggestion.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <CustomRadioButtonField
              name="latestVersion"
              value={useLatestVersion ? 'latest' : 'select'}
              options={[
                { label: 'Use Latest Version', value: 'latest' },
                { label: 'Select Version', value: 'select' },
              ]}
              onChange={(value) => handleRadioChange(value)}
              config={{
                label: 'Version',
                groupClass: 'form-group',
                className: 'form-check-input br-form-check-input me-1',
                labelClass: 'form-label br-text-primary med-font fw-semibold me-2',
              }}
            />

            {!useLatestVersion && (
              <CustomSelectField
                name="version"
                value={query.version}
                onChange={(value) => setQuery({ ...query, version: value })}
                options={versionOptions}
                config={{ groupClass: 'form-group mb-2' }}
              />
            )}
          </div>

          <div className="d-flex justify-content-end">
            <CustomButtonField type="submit" label="Submit" className="btn btn-filled med-font" />
          </div>
        </div>
      </form>
    </div>
  );
}

DependencyForm.propTypes = {
  initialData: PropTypes.shape({
    name: PropTypes.string,
    version: PropTypes.string,
  }),
  isEditMode: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};

export default DependencyForm;

import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import "./PackageModal.css";

const PackageModal = ({ onSubmit, onClose, editingPackage }) => {
  const [query, setQuery] = useState({ name: "", version: "" });
  const [useLatest, setUseLatest] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showVersionWarning, setShowVersionWarning] = useState(false);
  const debounceTimeoutRef = useRef(null);
  const isSubmitDisabled = !query.name || (!useLatest && !query.version);
  const isSuggestionSelected =
    query.name.length > 0 && suggestions.length === 0;

  useEffect(() => {
    if (onClose) {
      setQuery({ name: "", version: "" });
      setUseLatest(true);
      setSuggestions([]);
      setVersions([]);
    }
  }, [onClose]);

  useEffect(() => {
    if (editingPackage) {
      setQuery({ name: editingPackage.name, version: editingPackage.version });

      setUseLatest(editingPackage.version === "*");

      fetchVersions(editingPackage.name).then((allVersions) => {
        const sortedVersions = allVersions.sort((a, b) => (b > a ? 1 : -1));

        setVersions(sortedVersions);
      });
    }
  }, [editingPackage]);

  const fetchSuggestions = async (query) => {
    const response = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=${query}&size=10`
    );
    const data = await response.json();
    return data.objects.map((obj) => ({
      name: obj.package.name,
      version: obj.package.version,
    }));
  };

  const fetchVersions = async (packageName) => {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    const data = await response.json();
    return Object.keys(data.versions);
  };

  const handleInputChange = async (event) => {
    const newQuery = event.target.value;
    setQuery({ ...query, name: newQuery });

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (newQuery.length > 0) {
        const newSuggestions = await fetchSuggestions(newQuery);
        setSuggestions(newSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleSuggestionClick = async (suggestion) => {
    const allVersions = await fetchVersions(suggestion.name);
    const sortedVersions = allVersions.sort((a, b) => (b > a ? 1 : -1));
    setQuery({ name: suggestion.name, version: "*" });
    setSuggestions([]);
    setVersions(sortedVersions);
  };

  const handleModalSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (!useLatest && !query.version) {
        setShowVersionWarning(true); // Show version warning if version is not selected
        setIsLoading(false);
        return;
      }

      if (useLatest) {
        query.version = "*";
      }
      if (query.name) {
        onSubmit(query);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting package", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleRadioChange = (event) => {
    const { value } = event.target;
    setUseLatest(value === "latest");
    if (value === "latest") {
      setQuery({ ...query, version: "*" });
      setShowVersionWarning(false);
    } else {
      setQuery({ ...query, version: "Select version" });
    }
  };

  return (
    <Form onSubmit={handleModalSubmit}>
      <Form.Group>
        <Form.Label>Search NPM Package</Form.Label>
        <Form.Control
          type="text"
          value={query.name}
          onChange={handleInputChange}
          placeholder="Search NPM packages..."
          autoComplete="off"
          readOnly={!!editingPackage} null
          className={editingPackage ? "read-only-input" : ""}
        />
      </Form.Group>
      {query.name.length > 0 && !editingPackage && (
        <div className="suggestion-container">
          <div id="suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div>{suggestion.name}</div>
                <div>{suggestion.version}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {isSuggestionSelected && (
        <Form.Group className="mt-3">
          <Form.Check
            type="radio"
            label="Use latest version"
            name="versionOptions"
            value="latest"
            checked={useLatest}
            onChange={handleRadioChange}
          />
          <Form.Check
            type="radio"
            label="Select version"
            name="versionOptions"
            value="select"
            checked={!useLatest}
            onChange={handleRadioChange}
            className="mt-2"
          />
          {!useLatest && versions.length > 0 && (
            <Form.Control
              as="select"
              value={query.version}
              onChange={(e) => setQuery({ ...query, version: e.target.value })}
              className="mt-2"
            >
              <option value="">Select version</option>
              {versions.map((version, index) => (
                <option key={index} value={version}>
                  {version}
                </option>
              ))}
            </Form.Control>
          )}
            {showVersionWarning && (
            <Alert variant="warning" className="mt-2">
              Please select a version.
            </Alert>
          )}
        </Form.Group>
      )}
      <div className="button-container">
        <Button
          variant="secondary"
          className="close-button"
          onClick={handleCancel}
        >
          Close
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitDisabled || isLoading}
          className="submit-button"
        >
          {isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : !!editingPackage ? (
            "Update"
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </Form>
  );
};

export default PackageModal;

import { useState, useEffect, useCallback } from 'react';
import { getFileListBySearchTerm } from '../services/projectService';
import { getIconClass } from '../constants/ExtensionBasedIcon';
import { useTabContext } from '../context/TabContext';
import PropTypes from 'prop-types';
import '../styles/SearchInput.css';

const DEBOUNCE_DELAY = 500;

const SearchInput = ({ projectName, setShowSearch, setFileList, setLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [fileList, setFileListInternal] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { addTab, selectTab } = useTabContext();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedTerm.trim()) {
        setLoading(true);
        try {
          const payload = { searchTerm: debouncedTerm };
          const files = await getFileListBySearchTerm(projectName, payload);
          setFileListInternal(files.file_list);
          setFileList(files.file_list);
          setSelectedIndex(0);
        } catch (error) {
          console.error('Error fetching files:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setFileListInternal([]);
        setFileList([]);
        setSelectedIndex(0);
      }
    };

    fetchFiles();
  }, [debouncedTerm, projectName, setLoading, setFileList]);

  const handleFileClick = useCallback(
    (file) => {
      setShowSearch(false);
      addTab(file);
      selectTab(file);
    },
    [addTab, selectTab, setShowSearch]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, fileList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (fileList[selectedIndex]) {
        handleFileClick(fileList[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSearch(false);
    }
  };

  return (
    <div className="search-input-container">
      <input
        type="text"
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        autoFocus
        onKeyDown={handleKeyDown}
      />
      {fileList.length > 0 && (
        <div className="search-results">
          {fileList.map((file, index) => (
            <div
              key={file.id}
              onClick={() => handleFileClick(file)}
              className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
            >
              <i
                className={`bi ${getIconClass(file?.extension).iconClass}`}
                style={{ color: getIconClass(file?.extension).color }}
              />
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

SearchInput.propTypes = {
  projectName: PropTypes.string.isRequired,
  setShowSearch: PropTypes.func.isRequired,
  setFileList: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default SearchInput;

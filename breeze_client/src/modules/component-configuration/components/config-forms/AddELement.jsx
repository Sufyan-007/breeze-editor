import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import '../../styles/addElement.css';
import { CustomButtonField } from '../../../../common/fields';
import {
  getAllThirdPartyLibraries,
  getAllCustomComponents,
  getLibraryComponents,
} from '../../services/componentListService';
import PropsConfig from '../helper-components/PropsConfig';
import PreviewDisplay from '../helper-components/PreviewDisplay';
import htmlElements from '../../constants/AllELements';

const AddELement = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [allThirdPartyLibraries, setAllThirdPartyLibraries] = useState({});
  const [filteredComponentList, setFilteredComponentList] = useState([]);
  const [componentList, setComponentList] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [selectedElements, setSelectedElements] = useState([]);
  const [showPreview, setShowPreview] = useState(0);
  const [configuredPropsList, setconfiguredPropsList] = useState({});
  const { projectName } = useParams();
  useEffect(() => {
    async function fetchData() {
      const requestBody = {
        category: 'third_party',
      };

      try {
        const thirdPartyComponents = await getAllThirdPartyLibraries(projectName, requestBody);
        setAllThirdPartyLibraries(thirdPartyComponents);
      } catch (error) {
        console.error('Error fetching third-party libraries:', error);
      }
    }
    fetchData();
  }, [projectName]);

  useEffect(() => {
    async function fetchData() {
      setSearchValue('');
      setComponentList(null);
      setSelectedElements(null);
      setShowPreview(false);
      setFilteredComponentList([]);

      try {
        if (selectedCategory === 'third_party' && selectedSubCategory) {
          const match = selectedSubCategory.match(/^(.*)@([^@]+)$/);
          const libName = match ? match[1] : null;
          const version = match ? match[2] : null;

          if (libName && version) {
            const requestBodyThirdParty = {
              category: 'third_party',
              libname: libName,
              libversion: version,
              module: 'component',
            };

            const libraryComponents = await getLibraryComponents(projectName, requestBodyThirdParty);
            const componentsData = libraryComponents?.data || {};
            setComponentList(componentsData);
            setFilteredComponentList(Object.entries(componentsData));
          }
        } else if (selectedCategory === 'components') {
          const requestBodyCustomComponent = { category: 'components' };
          const customComponents = await getAllCustomComponents(projectName, requestBodyCustomComponent);
          setSelectedSubCategory(null);

          setComponentList(customComponents || {});
          setFilteredComponentList(Object.entries(customComponents || []));
        } else if (selectedCategory === 'html') {
          setComponentList(htmlElements || {});
          setSelectedSubCategory(null);
          setFilteredComponentList(Object.entries(htmlElements || []));
        }
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    }

    fetchData();
  }, [projectName, selectedCategory, selectedSubCategory]);

  useEffect(() => {
    const filtered = Object.entries(componentList || {}).filter(([key, name]) => {
      return name.toLowerCase().includes(searchValue.toLowerCase());
    });
    setFilteredComponentList(filtered);
  }, [searchValue, componentList]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  const handleSubCategoryChange = (event) => {
    setSelectedSubCategory(event.target.value);
  };

  function addELement(event) {
    event.preventDefault();
    console.log('Add ELement', selectedElements);
  }
  const handlePreviewClick = () => {
    setShowPreview((prev) => {
      // Check the current value of showPreview (prev)
      if (prev === 0) {
        return 1; // If it's 0, set to 1
      } else if (prev % 2 !== 0) {
        return 2; // If it's odd, set to 2
      } else {
        return 3; // If it's even (but not 0), set to 3
      }
    });
  };
  // console.log(filteredComponentList);
  return (
    <div>
      <div className="container">
        <div
          className={`d-flex w-100 ${
            selectedCategory === 'third_party' ? 'justify-content-between' : 'justify-content-end'
          }`}
        >
          <div className="">
            <select
              name="select_box"
              className=" form-select-sm selectpicker br-background-secondary br-text-primary border-0"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="" disabled selected>
                Select an option
              </option>
              <option key="html" value="html">
                Html
              </option>
              <option key="components" value="components">
                Components
              </option>
              <option key="Third_Party" value="third_party">
                Third_Party
              </option>
              <option key="Uploaded_Custom" value="uploaded_custom">
                Uploaded_Custom
              </option>
            </select>
          </div>
          {selectedCategory === 'third_party' && (
            <div>
              <select
                name="select_box"
                className="form-select-sm br-background-secondary br-text-primary border-0"
                onChange={handleSubCategoryChange}
                value={selectedSubCategory}
              >
                <option value="" disabled selected>
                  Select an option
                </option>
                {allThirdPartyLibraries.data && Object.keys(allThirdPartyLibraries.data).length > 0 ? (
                  Object.keys(allThirdPartyLibraries.data).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))
                ) : (
                  <option disabled>No options available</option>
                )}
              </select>
            </div>
          )}
        </div>
        <form
          className="sidebar-search pt-4 pb-2"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <input
            className="form-control-sm br-background-secondary br-text-primary border-0 removeFocusedBorder w-100"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={(event) => {
              // console.log('df');
              event.preventDefault();
              // if (event.target.value === '') {
              //   setSelectedElements(null);
              // }
              setSearchValue(event.target.value);
              // setShowPreview(0);
              setSelectedElements(null);
            }}
            value={searchValue}
          />
        </form>
        {!selectedElements?.length > 0 && (
          <div
            style={{
              overflowY: 'scroll',
              scrollbarWidth: 'none',
              height: 'auto',
              maxHeight: '20rem',
              borderRadius: '.7rem',
            }}
          >
            <ul className="list-group br-background-secondary">
              <li
                className="list-group-item p-1 text-center br-background-secondary br-text-primary  border-0"
                style={{
                  position: 'sticky',
                  top: '0',
                  zIndex: '1',
                }}
              >
                {' '}
                Suggestions
              </li>

              {filteredComponentList && filteredComponentList.length > 0 ? (
                filteredComponentList.map(([key, value]) => (
                  <li
                    className="list-group-item p-1 br-background-secondary br-text-primary listViewHover border-0 ps-4"
                    onClick={() => {
                      setSelectedElements([key, value]);
                      setSearchValue(value);
                    }}
                    key={key}
                  >
                    {value}
                  </li>
                ))
              ) : (
                <p className="br-text-primary ps-4"> No components available for the selected value.</p>
              )}
            </ul>
          </div>
        )}
        <div>
          {selectedElements?.length > 0 && (
            <PropsConfig
              selectedCategory={selectedCategory}
              component={selectedElements}
              library={selectedSubCategory}
              setconfiguredPropsList={setconfiguredPropsList}
            ></PropsConfig>
          )}
        </div>
      </div>

      <div className="pt-3 d-flex justify-content-between justify-content-end">
        <div>
          <CustomButtonField
            type="button"
            label="Preview"
            className="addELementbtn run-btn med-font"
            onClick={handlePreviewClick}
          />
        </div>
        <div>
          <CustomButtonField
            type="button"
            label="Add"
            className="addELementbtn run-btn med-font"
            onClick={addELement}
          />
        </div>
      </div>
      {showPreview != 0 && selectedElements?.length > 0 && (
        <PreviewDisplay
          showPreview={showPreview}
          // key={showPreview}
          component={selectedElements}
          library={selectedCategory === 'third_party' ? selectedSubCategory : selectedCategory}
          propsList={configuredPropsList}
        ></PreviewDisplay>
      )}
    </div>
  );
};

export default AddELement;

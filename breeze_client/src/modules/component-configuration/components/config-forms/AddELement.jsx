import { useState, useEffect } from 'react';
import { elements } from '../../constants/AllELements';
import '../../styles/addElement.css';
import { CustomButtonField } from '../../../../common/fields';
const Category = {
  ALL: 'All',
  HTML: 'HTML',
  THIRD_PARTY: 'THIRD_PARTY',
  CUSTOM: 'CUSTOM',
  UPLOADED_CUSTOM: 'UPLOADED_CUSTOM',
};

const AddELement = () => {
  const [selectedCategory, setSelectedCategory] = useState(Category.ALL);
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [filteredElements, setFilteredElements] = useState([]);
  const [allHtmlTags, setAllHtmlTags] = useState([]);
  const [allCustomTags, setAllCustomTags] = useState([]);
  const [allThirdPartyTags, setAllThirdPartyTags] = useState([]);
  const [allCustomThirdPartyTags, setAllCustomThirdPartyTags] = useState([]);
  const [displayTags, setDisplayTags] = useState([]);
  const [searchedValue, setSearchedValue] = useState('');
  const [selectedElements, setSelectedElements] = useState('');
  console.log(allCustomTags);
  useEffect(() => {
    let allHtmlTags = elements.HTML.map((obj) => {
      obj.type = 'HTML';
      return obj;
    });
    let allCustomTags = elements.CUSTOM.map((obj) => {
      obj.type = 'CUSTOM';
      return obj;
    });
    let allThirdPartyTags = [];
    for (const [key, value] of Object.entries(elements.THIRD_PARTY)) {
      allThirdPartyTags.push(
        ...value.map((obj) => {
          obj.type = 'THIRD_PARTY';
          obj.libraryName = key;
          return obj;
        })
      );
    }
    setAllHtmlTags([...allHtmlTags]);
    setAllCustomTags([...allCustomTags]);
    setAllThirdPartyTags([...allThirdPartyTags]);
    setFilteredElements([...allHtmlTags, ...allThirdPartyTags, ...allCustomTags]);
  }, []);

  useEffect(() => {
    if (selectedCategory === 'HTML') {
      setFilteredElements(allHtmlTags);
    } else if (selectedCategory === 'THIRD_PARTY') {
      if (selectedSubCategory === 'All') setFilteredElements(allThirdPartyTags);
      else {
        const filterByLibraryName = (selectedSubCategory) => {
          return allThirdPartyTags.filter((item) => item.libraryName === selectedSubCategory);
        };
        const filteredResults = filterByLibraryName(selectedSubCategory);

        setFilteredElements(filteredResults);
      }
    } else if (selectedCategory === 'CUSTOM') {
      setFilteredElements(allCustomTags);
    } else if (selectedCategory === 'UPLOADED_CUSTOM') {
      setFilteredElements(allCustomTags);
    } else {
      setFilteredElements([...allHtmlTags, ...allThirdPartyTags, ...allCustomTags]);
    }

    if (selectedCategory !== 'THIRD_PARTY') setSelectedSubCategory('All');
  }, [selectedCategory, selectedSubCategory]);

  useEffect(() => {
    const tempFilteredELements = filteredElements.filter((item) => item.name.toLowerCase().includes(searchedValue));
    setDisplayTags(tempFilteredELements);
  }, [filteredElements, searchedValue]);

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

  return (
    <div>
      <div className="container">
        <div
          className={`d-flex w-100 ${
            selectedCategory === 'THIRD_PARTY' ? 'justify-content-between' : 'justify-content-end'
          }`}
        >
          <div className="">
            <select
              name="select_box"
              className=" form-select-sm selectpicker br-background-secondary br-text-primary border-0"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          {selectedCategory === 'THIRD_PARTY' && (
            <div>
              <select
                name="select_box"
                className=" form-select-sm br-background-secondary br-text-primary border-0"
                value={selectedSubCategory}
                onChange={handleSubCategoryChange}
              >
                <option key="all-library" value="All">
                  All
                </option>

                {Object.keys(elements.THIRD_PARTY).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                  </option>
                ))}
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
            className="form-control br-background-secondary br-text-primary border-0 removeFocusedBorder"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={(event) => {
              event.preventDefault();
              setSearchedValue(event.target.value);
            }}
            value={searchedValue}
          />
        </form>
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
            {displayTags.map((item) => (
              <li
                className="list-group-item p-1 text-lowercase br-background-secondary br-text-primary listViewHover border-0 ps-4"
                key={item.id}
                onClick={(event) => {
                  setSelectedElements(item.name.toLowerCase());
                  setSearchedValue(item.name.toLowerCase());
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="pt-3 d-flex justify-content-end">
        <div>
          <CustomButtonField
            type="button"
            label="Add"
            className="addELementbtn run-btn med-font"
            onClick={addELement}
          />
        </div>
      </div>
    </div>
  );
};

export default AddELement;

import { DragableElements } from "./DragableElements";
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { getComponents } from "../../services/ComponentReadService";
import Filter from "../../assets/icons/filter.svg";

const elementFilterOptions = [
  { label: 'All', value: 'All' },
  { label: 'HTML', value: 'HTML' },
  { label: 'Custom', value: 'CUSTOM' },
  { label: 'Third Party', value: 'THRID_PARTY' },
  { label: 'Frequently used', value: 'FYE' }
]

export default function AddElements({ }) {

  const { projectName } = useParams()
  const [components, setComponents] = useState({});
  const [searchedElement, setSearchedElement] = useState("");
  const frequentlyUsedElements = [
    'div',
    'addAllOtherTagsLater'
  ]
  console.log(elementFilterOptions);
  const [chosenType, setchosenType] = useState('FYE');


  useEffect(() => {
    const load = async () => {
      const resp = await getComponents(projectName)
      setComponents(resp)
      let allHtmlTags = resp.HTML.map(obj => {
        obj.type = 'HTML'
        return obj;
      });
      let allCustomTags = resp.CUSTOM.map(obj => {
        obj.type = 'CUSTOM'
        return obj;
      });
      let allThirdPartyTags = []
      for (const [key, value] of Object.entries(resp.THIRD_PARTY)) {
        allThirdPartyTags.push(...value.map(obj => {
          obj.type = 'THIRD_PARTY'
          obj.libraryName = key
          return obj;
        }))
      }

      setAllElementOptions([...allHtmlTags, ...allThirdPartyTags, ...allCustomTags])
    }
    load()
  }, [projectName])
  const [allElementOptions, setAllElementOptions] = useState([])



  return (
    <div className="row h-100">
      <div className="d-flex mt-1">
        <i className="ms-2 me-auto" style={{ color: "#dee2e6" }}>Add Elements</i>

        <div className="dropdown me-2">
          <img
            className="dropdown-toggle"
            id="dropdownMenuButton1" data-bs-toggle="dropdown"
            src={Filter}
            alt="Delete"
            style={{
              cursor: "pointer",
              width: "24px",
              height: "24px",
            }}
          />
          <ul className="dropdown-menu" data-bs-theme="dark" aria-labelledby="dropdownMenuButton1">
            {elementFilterOptions.map(obj => (
              <li
                className={`${chosenType === obj.value ? 'active' : ''} dropdown-item`}
                onClick={() => setchosenType(obj.value)}
              >
                {obj.label}
              </li>
            ))}
          </ul>
        </div>

      </div>
      <div>
        <div
          data-bs-theme="dark"
          className="me-2"
          type="button"
          onChange={(e) => setSearchedElement(e.target.value)}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder={chosenType !== 'FYE' ? 'Search from ' + chosenType + ' tags' : 'Search'}
            aria-label="Search"
            value={searchedElement}
          />
        </div>
        <div>

        </div>
      </div>
      <div className="col h-100" style={{ overflowY: 'auto' }}>

        <div
          className="card my-1"
          style={{ overflowY: "auto" }}
          data-bs-theme="dark"
        >
          <div className="card-header text-center ">{elementFilterOptions.filter(obj => obj.value === chosenType)[0].label} elements</div>
          <ul className="list-group list-group-flush">
            {searchedElement && allElementOptions.filter(obj => obj.name.toLowerCase().includes(searchedElement.toLowerCase()) && (chosenType === 'All' || chosenType === obj.type)).map((component, index) => (
              <li key={index} className="list-group-item" title={'Tag type: ' + (component.type === 'THIRD_PARTY' ? component.type + ' --> ' + component.libraryName : component.type)}>
                {" "}
                <DragableElements
                  elem={{ elementType: "HTML", component }}
                />{" "}
              </li>
            ))}
            {chosenType === 'FYE' && components.HTML?.slice(0, 10).filter(obj => searchedElement ? obj.name.toLowerCase().includes(searchedElement.toLowerCase()) : true).map((component, index) => (
              <li key={index} className="list-group-item">
                {" "}
                <DragableElements
                  elem={{ elementType: "HTML", component }}
                />{" "}
              </li>
            ))}
            {!searchedElement && allElementOptions && allElementOptions.filter(obj => chosenType === 'All' || obj.type === chosenType).map((component, index) => (
              <li key={index} className="list-group-item" title={'Tag type: ' + (component.type === 'THIRD_PARTY' ? component.type + ' --> ' + component.libraryName : component.type)}>
                {" "}
                <DragableElements
                  elem={{ elementType: "HTML", component }}
                />{" "}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
import { DragableElements } from "./DragableElements";
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { getComponents } from "../../services/ComponentReadService";

export default function AddElements({chosenType, elementFilterOptions}){
    
    const { projectName } = useParams()
    const [components, setComponents] = useState({});
    const [searchedElement, setSearchedElement] = useState("");
    const frequentlyUsedElements = [
      'div',
      'addAllOtherTagsLater'
    ]
    console.log(elementFilterOptions);

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
        <div className="col h-100" style={{overflowY: 'auto'}}>

          <div
            className="card my-1"
            style={{ overflowY: "auto" }}
            data-bs-theme="dark"
          >
            <div className="card-header text-center ">{elementFilterOptions.filter(obj => obj.value === chosenType)[0].label} elements</div>
            <ul className="list-group list-group-flush">
              { searchedElement && allElementOptions.filter(obj => obj.name.toLowerCase().includes(searchedElement.toLowerCase()) && (chosenType === 'All' || chosenType === obj.type)).map((component, index) => (
                <li key={index} className="list-group-item" title={ 'Tag type: ' + (component.type === 'THIRD_PARTY' ? component.type + ' --> ' + component.libraryName : component.type)}>
                  {" "}
                  <DragableElements
                    elem={{ elementType: "HTML", component }}
                  />{" "}
                </li>
              ))}
              { chosenType === 'FYE' && components.HTML?.slice(0, 10).filter(obj => searchedElement ? obj.name.toLowerCase().includes(searchedElement.toLowerCase()): true).map((component, index) => (
                <li key={index} className="list-group-item">
                  {" "}
                  <DragableElements
                    elem={{ elementType: "HTML", component }}
                  />{" "}
                </li>
              ))}
              { !searchedElement && allElementOptions && allElementOptions.filter(obj => chosenType === 'All' || obj.type === chosenType).map((component, index) => (
                <li key={index} className="list-group-item" title={ 'Tag type: ' + (component.type === 'THIRD_PARTY' ? component.type + ' --> ' + component.libraryName : component.type)}>
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
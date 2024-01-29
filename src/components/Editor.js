import { useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router';
import ComponentConfigService from '../services/ComponentConfigService';
import { useDispatch } from 'react-redux'
import { ServiceContext } from '../store/Context';
import Sidebar from './Sidebar';

function Editor() {
  const dispatch = useDispatch()
  const iFrameRef = useRef()
  const [portNumber, setPortNumber] = useState("")
  const [route, setRoute] = useState("")
  const { projectName } = useParams()
  const portInput = useRef();
  const routeInput = useRef();
  const configService = useMemo(() => {
    if (projectName) {
      return new ComponentConfigService(projectName, dispatch)
    }
  }, [projectName, dispatch])



  function setPort() {

    const routeI = routeInput.current.value
    const input = portInput.current.value
    if ((input >= 0 && input !== portNumber) || route !== routeI) {
      setPortNumber(input)
      setRoute(routeI)
    }
    else {
      // setPortNumber("")
    }
  }



  return (
    <ServiceContext.Provider value={{ configService }}>
      <div className="container-fluid vh-100 d-flex flex-column ">
        <div className=" navbar  bg-dark row">
          <div className="container-fluid">
            <div className=" navbar-brand text-white">
              Breeze Studio
            </div>
            <div>
              <input ref={portInput} type="text" className="p-1 m-1 " placeholder='Port Number' />
              <input ref={routeInput} type="text" className="p-1" placeholder='Route' />
              <button className=" btn btn-primary m-1" onClick={setPort}> Go</button>
            </div>
          </div>
        </div>
        <div className=" row flex-grow-1 overflow-hidden">
          <Sidebar className=" col-3  bg-dark-subtle overflow-y-auto h-100" />
          

          <div className="col m-0 p-0 overflow-hidden">
            {
              portNumber ?
                <iframe ref={iFrameRef} id="iFrame" sandbox="allow-cross-origin allow-scripts allow-popups allow-forms" src={"http://localhost:" + portNumber + "/" + route} style={{ 'transform': 'scale(0.8)', 'width': '125%', 'height': '125%', 'transformOrigin': '0 0' }} className='border-1 border border-black' title='a' frameborder="0"></iframe>
                : null
            }
          </div>
        </div>
      </div>
    </ServiceContext.Provider>
  );
}

export default Editor;

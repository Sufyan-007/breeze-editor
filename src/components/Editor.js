import { useEffect, useMemo, useRef, useState } from 'react'
import { Outlet, useParams } from 'react-router';
import ComponentConfigService from '../services/ComponentConfigService';
import SidebarService from "../services/SidebarService"
import { useDispatch, useSelector } from 'react-redux'
import { ServiceContext } from '../store/Context';
import ElementConfig from './ElementConfig';

function Editor() {
  const dispatch = useDispatch()
  const iFrameRef = useRef()
  const [portNumber, setPortNumber] = useState("3001")
  const [route, setRoute] = useState("")
  const { projectName, componentName } = useParams()
  const portInput = useRef();
  const routeInput = useRef();
  const configService = useMemo(() => {
    if (projectName) {
      return new ComponentConfigService(projectName, dispatch)
    }
  }, [projectName, dispatch])
  const routerConfig = useSelector(state => state.routerConfig)
  const sidebarService = useMemo(() => {
    return new SidebarService()
  }, [])

  useEffect(()=>{
    if(componentName && routerConfig.routes){
      for( const route of routerConfig.routes){
        if(route.component===componentName){
          const r = route.path.substring(1)
          console.log(r)
          // setRoute(r)
          routeInput.current.value=r
          break
        }
      }
      
    }
  },[componentName,routerConfig])


  function setPort() {
    const routeI = routeInput.current.value
    const input = portInput.current.value
    if ((input >= 0 && input !== portNumber) || route !== routeI) {
      setPortNumber(input)
      setRoute(routeI)
    }
  }



  return (
    <ServiceContext.Provider value={{ configService, sidebarService }}>
      <div className="container-fluid vh-100 d-flex flex-column ">
        <div className=" navbar row" style={{ backgroundColor: "#151518" }}>
          <div className="container-fluid">
            <div className=" navbar-brand text-white">
              Breeze Studio
            </div>
            <div>
              <input ref={portInput} defaultValue="3001" type="text" className="p-1 m-1 " placeholder='Port Number' />
              <input ref={routeInput} type="text" className="p-1" placeholder='Route' />
              <button className=" btn btn-primary m-1" onClick={setPort}> Go</button>
            </div>
          </div>
        </div>
        <div className=" row flex-grow-1 overflow-hidden">
          <div className=" col-3   overflow-y-auto h-100 fs-6 text-white" style={{ width: "18rem" , backgroundColor: "#303033" }} >
            <Outlet />
          </div>


          <div className="col m-0 p-0 overflow-hidden">
            {
              portNumber ?
                <iframe ref={iFrameRef} id="iFrame" src={"http://localhost:" + portNumber + "/" + route} style={{ 'transform': 'scale(0.8)', 'width': '125%', 'height': '125%', 'transformOrigin': '0 0' }} className='border-1 border border-black' title='a' frameborder="0"></iframe>
                : null
            }
          </div>
          <ElementConfig className="col-1" style={{ width: "15rem", backgroundColor: "#303033" }} />


        </div>  
      </div>
    </ServiceContext.Provider>
  );
}

export default Editor;

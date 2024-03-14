import React from 'react';
import arrowLeft from "../assets/icons/arrow-left.svg"; 
import arrowRight from "../assets/icons/arrow-right.svg";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


function ProjectSidebar({ isSidebarExpanded, sidebarItems, tagSelection, setSelection, toggleSidebar, highlightedStyle }) {
  return (
    <div className={`col-auto p-2 bg-dark text-white ${isSidebarExpanded ? "expanded" : "collapsed"}`} style={{ transition: 'width .3s', display: 'flex', flexDirection: 'column', alignContent: 'space-between' }}>
      <div className='menu-bar'>
          {sidebarItems.map((item) => (
              <OverlayTrigger
                key={item.id}
                placement="right"
                overlay={<Tooltip id={`tooltip-${item.id}`}>{item.name}</Tooltip>}
                delay={{ show: 250, hide: 400 }}
                disabled={isSidebarExpanded}
              >
                <div className="d-flex align-items-center py-2 px-1" style={tagSelection === item.id ? highlightedStyle : { cursor: 'pointer'}} onClick={() => setSelection(item.id)}>
                    <img src={item.icon} alt="" height={24} className='mx-2'/>
                    {isSidebarExpanded && <span className="mx-2">{item.name}</span>}
                </div>
              </OverlayTrigger>
          ))}
      </div>
      <div className="sidebar-toggle bg-white mt-auto d-flex justify-content-center p-2" onClick={toggleSidebar} style={{ borderRadius: '70px', width: '40px', marginLeft: isSidebarExpanded ? '125px' : '0px', cursor: 'pointer'}}>
          <img src={isSidebarExpanded ? arrowLeft : arrowRight} alt="Toggle Sidebar" height={20} width={20} />
      </div>
    </div>
  );
  
}

export default ProjectSidebar;

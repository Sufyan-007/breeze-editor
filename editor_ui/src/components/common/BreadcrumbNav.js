import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const routes = [
  { path: '/', name: 'Home' },
  { path: '/pages', name: 'Pages' },
  { path: '/routing', name: 'Routing' },
  { path: '/services', name: 'Services' },
  { path: '/constants', name: 'Constants' },
  { path: '/styles', name: 'Styles' },
  { path: '/styles/add', name: 'Add Style' }, // Example of a nested path
  { path: '/styles/edit/:css_name', name: 'Edit Style' },
  { path: '/styles/view/:css_name', name: 'View Style' },
  { path: '/code', name: 'Code' },
  { path: '/apps', name: 'Third-party App' },
  { path: '/settings', name: 'Settings' },
  { path: '/resources', name: 'Resources' },
];

const useBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  let pathAccumulator = '';
  const breadcrumbs = pathnames.map((pathSegment, index) => {
    pathAccumulator += `/${pathSegment}`;
    const route = routes.find(route => route.path === pathAccumulator);
    return {
      path: pathAccumulator,
      name: route ? route.name : pathSegment,
    };
  });

  return [{ path: '/', name: 'Home' }, ...breadcrumbs];
};



const BreadcrumbNav = () => {
  const breadcrumbPaths = useBreadcrumbs();

  return (
    <Breadcrumb>
      {breadcrumbPaths.map((path, index) => (
        <Breadcrumb.Item key={index} active={index === breadcrumbPaths.length - 1}>
          {index === breadcrumbPaths.length - 1 ? (
            path.name
          ) : (
            <Link to={path.path}>{path.name}</Link>
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbNav;

import Navbar from '../navbar/Navbar';
import PropTypes from 'prop-types';

function Layout({ sidebar, mainContent, currentPage = 'project' }) {
  return (
    <div className="container-fluid p-0">
      <Navbar currentPage={currentPage} />

      <div className="wrapper br-background-secondary">
        <aside id="sidebar" className="br-background-primary">
          {sidebar}
        </aside>
        <div className="main">
          <main className="content">{mainContent}</main>
        </div>
      </div>
    </div>
  );
}

Layout.propTypes = {
  sidebar: PropTypes.node.isRequired,
  mainContent: PropTypes.node.isRequired,
  currentPage: PropTypes.string,
};

export default Layout;

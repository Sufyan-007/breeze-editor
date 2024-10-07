import Navbar from '../navbar/Navbar';
import PropTypes from 'prop-types';

function Layout({ sidebar, mainContent, currentPage = 'project', projectName = '' }) {
  return (
    <div className="container-fluid p-0">
      <Navbar currentPage={currentPage} projectName={projectName} />

      <div className="br-wrapper br-background-secondary">
        {sidebar}
        <div className="br-main">
          <main className="br-content">{mainContent}</main>
        </div>
      </div>
    </div>
  );
}

Layout.propTypes = {
  sidebar: PropTypes.node,
  mainContent: PropTypes.node.isRequired,
  currentPage: PropTypes.string,
  projectName: PropTypes.string.isRequired,
};

export default Layout;

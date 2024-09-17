import Navbar from '../navbar/Navbar';
import PropTypes from 'prop-types';

function Layout({ sidebar, mainContent, currentPage = 'project' }) {
  return (
    <div className="container-fluid p-0">
      <Navbar currentPage={currentPage} />

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
};

export default Layout;

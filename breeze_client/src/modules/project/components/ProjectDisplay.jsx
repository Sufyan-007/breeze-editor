import TopBar from './TopBar';
import Editor from '../../../assets/images/ABDM Login Page 1(2).png';
import LoginPage from '../../../assets/images/image 1.png';

function ProjectDisplay() {
  return (
    <div className="mb-3">
      <TopBar />
      <div className="tab-content" id="pills-tabContent">
        <div className="tab-pane fade" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
          <div className="img-container">
            <img src={Editor} alt="preview" />
          </div>
        </div>
        <div
          className="tab-pane fade active show"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <div className="img-container">
            <img src={LoginPage} alt="preview" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDisplay;

const IntegrationsSettings = () => {
  return (
    <div>
      <h2>Integration Settings</h2>
      <form>
        <div className="mx-2 my-3">
          <label>Integration Option 1:</label>
          <img
            className="integration-image mx-2"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaxvccJFzTUJIhDhuVY6W0xssuGtObjxuJ0CJDrH2e_A&s"
            alt="GitHub"
          />
        </div>
        <div className="my-3 mx-2">
          <label>Integration Option 2:</label>
          <img
            className="integration-image mx-2"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsbBdQ3E6MriVeab8qrMmaCMRHAdCkS68wo8oPRFYlLg&s"
            alt="Gitlabs"
          />
        </div>
      </form>
    </div>
  );
};

export default IntegrationsSettings;

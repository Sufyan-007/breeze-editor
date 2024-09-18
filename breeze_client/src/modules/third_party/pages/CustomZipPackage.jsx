import { useState } from 'react';
import { BreezeTable, BreezeModal } from '../../../common/display/index';
import '../styles/CustomZipPackage.css';

const filesData = [
  {
    fileName: 'report.pdf',
    lastModified: '2024-09-15 10:15 AM',
  },
  {
    fileName: 'project_plan.docx',
    lastModified: '2024-09-12 03:45 PM',
  },
  {
    fileName: 'budget.xlsx',
    lastModified: '2024-09-10 11:22 AM',
  },
  {
    fileName: 'presentation.pptx',
    lastModified: '2024-09-08 09:30 AM',
  },
];

function CustomZipPackagePage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    filename: '',
    description: '',
    file: null,
  });
  const [error, setError] = useState('');

  const columns = [
    {
      header: 'File Name',
      accessor: 'fileName',
      width: '40%',
    },
    {
      header: 'Last Modified',
      accessor: 'lastModified',
      render: (value) => new Date(value).toLocaleString(),
      width: '40%',
    },
  ];

  const actions = (item) => (
    <button className="btn btn-danger" onClick={() => onDelete(item)}>
      Delete
    </button>
  );

  const handleModal = () => {
    setShowModal(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement your file upload logic here
    console.log('Form data submitted:', formData);
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      filename: '',
      description: '',
      file: null,
    });
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (files) {
      const file = files[0];
      // Check if the file size exceeds 5MB
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB. Please select a smaller file.');
        return;
      }
      setFormData((prevData) => ({
        ...prevData,
        filename: file.name,
        [name]: file,
      }));
      setError('');
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const header = { title: 'Upload File' };
  const footer = {
    buttons: [
      {
        label: 'Upload',
        onClick: handleSubmit,
        className: 'btn btn-success',
      },
      {
        label: 'Cancel',
        onClick: () => setShowModal(false),
        className: 'btn btn-secondary',
      },
    ],
  };
  return (
    <div>
      <div className="container-fluid text-white">
        <div className="col-12 d-flex justify-content-between">
          <h3 className="br-text-primary mt-2">Custom Packages</h3>
          <div className="d-flex">
            <button className="upload-zip med-font" onClick={() => handleModal()}>
              Upload Zip
            </button>
          </div>
        </div>
        <BreezeTable
          columns={columns}
          data={filesData}
          actions={actions}
          currentPage={1}
          // tableClass="table table-responsive br-background-primary"
          // rowClass="br-background-primary"
          pageSize={10}
          onPageChange={(page) => console.log(`Page: ${page}`)}
          sortBy="filename"
          sortDirection="asc"
          actionPlacement={'end'}
        />
      </div>
      <BreezeModal isOpen={showModal} onClose={() => setShowModal(false)} header={header} footer={footer}>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-danger">{error}</p>}
          <div className="row">
            <div className=" col mb-3">
              <label>Choose File</label>
              <input type="file" name="file" required onChange={handleChange} accept=".zip" />
            </div>
          </div>
          <div className="row">
            <div className="col mb-3">
              <label>Description</label>
              <input type="text" name="description" value={formData.description} onChange={handleChange} required />
            </div>
          </div>
          {formData.filename && (
            <div className="mb-3">
              <label>File Name</label>
              <input type="text" value={formData.filename} name="filename" onChange={handleChange} readOnly />
            </div>
          )}
        </form>
      </BreezeModal>
    </div>
  );
}

export default CustomZipPackagePage;

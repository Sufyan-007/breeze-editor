import React, { useState, useEffect } from "react";
import { Accordion,Table  } from "react-bootstrap";
import CustomPanel from "./CustomPanel";
import DeleteIcon from '../assets/icons/delete.svg';
import EditIcon from '../assets/icons/edit.svg'
import Custom from "./ Custom";
import { fetchIntermediateFilenames,generateReactService } from "../services/IntermediatesService";

const IntermediateFiles = () => {
  // Extracting data and filenames from props
  const [files, setFiles] = useState([]);
  
  useEffect(() => {
    const fetchIntermediateFiles = async () => {
      try {
        const result = await fetchIntermediateFilenames("creator");
        setFiles(result.files);
      } catch (error) {
        console.error('Error fetching auth APIs:', error);
      }
    };

    fetchIntermediateFiles();
  }, []);

  const generateService = async(filename)  => {
    try {
      const result = await generateReactService("creator",filename);
    } catch (error) {
      console.error('Error generate react service:', error);
    }
  };

  return (
    <div>
    <h2 className="mt-5" style={{color: "white"}}>Files</h2>
    { <Table striped bordered hover variant="dark" className="mt-3">
      <thead>
        <tr>
          <th>File Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {files.map((item, index) => (
          <tr key={index}>
            <td>{item}</td>
            <td>
                    <img
                      className="m-1"
                      src={EditIcon}
                      alt="Edit"
                      style={{
                        cursor: "pointer",
                        width: "20px",
                        height: "20px",
                      }}
                      onClick={() => {generateService(item)}}
                    />
                    <img
                      src={DeleteIcon}
                      alt="Delete"
                      style={{
                        cursor: "pointer",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  </td>
          </tr>
        ))}
      </tbody>
    </Table>}

    
  </div>
  );
};

export default IntermediateFiles;

import React, { useState, useEffect } from "react";
import { fetchIntermediate } from "../services/IntermediatesService";
import {Table} from 'react-bootstrap';

export default function ServiceLists() {
  const [fetchedIntermediates, setFetchedIntermediates] = useState([]);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    try {
      const result = await fetchIntermediate("creator");
      setFetchedIntermediates(result.files_with_apis);
    } catch (error) {
      console.error("Error fetching intermediates:", error);
    }
    console.log(fetchedIntermediates, "fetchedIntermediates");
  };

    return (
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Service Name</th>
              <th>APIs</th>
            </tr>
          </thead>
          <tbody>
            {fetchedIntermediates.map((service) => (
              <tr key={service.filename}>
                <td>{service.filename}</td>
                <td>
                  <ul>
                    {Array.isArray(service.apis)
                      ? service.apis.map((api) => (
                          <li key={api.operation_id}>{api.operation_id}</li>
                        ))
                      : Object.values(service.apis).map((api) => (
                          <li key={api.operation_id}>{api.operation_id}</li>
                        ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
}

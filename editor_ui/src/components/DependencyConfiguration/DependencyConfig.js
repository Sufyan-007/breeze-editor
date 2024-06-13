import React, { useState, useEffect } from "react";
import "./DependencyConfig.css";
import PackageModal from "./PackageModal";
import DependencyFileCard from "./DependencyFileCard";
import { Form, Spinner } from "react-bootstrap";
import Offcanvas from "../common/Offcanvas";

const DependencyConfig = () => {
  const [dependencies, setDependencies] = useState([]);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [deletingPackage, setDeletingPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [editingPackage, setEditingPackage] = useState(null); // State for editing

  useEffect(() => {
    fetchDependencies();
  }, []);

  const fetchDependencies = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/editor/list-dependencies/test"
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setDependencies(Object.entries(data));
      } else {
        console.error("Failed to fetch dependencies:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching dependencies:", error);
    }
  };

  const handleAddPackageClick = () => {
    setEditingPackage(null);
    setIsOffcanvasOpen(true);
  };

  const handleModalSubmit = async (selectedPackage) => {
    console.log(selectedPackage);
    setIsLoading(true); // Set loading to true when form is submitted

    try {
      if (selectedPackage && selectedPackage.name && selectedPackage.version) {
        const packageData = {
          name: selectedPackage.name,
          version: selectedPackage.version,
        };

        let response;

        if (editingPackage) {
          response = await fetch(
            "http://localhost:8000/editor/edit-dependency/test",
            {
              method: "PUT",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify(packageData),
            }
          );
        } else {
          response = await fetch(
            "http://localhost:8000/editor/add-package/test",
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify(packageData),
            }
          );
        }

        if (response.ok) {
          const data = await response.json();
          console.log("Package added successfully:", data);
          fetchDependencies();
        } else {
          console.error("Failed to add package:", response.statusText);
        }
      } else {
        console.error("Invalid package:", selectedPackage);
      }
    } catch (error) {
      console.error("Error adding package:", error);
    } finally {
      setIsLoading(false); // Set loading to false once operation is complete
      setIsOffcanvasOpen(false); // Close the offcanvas
    }
  };
  const handleDownload = (css_name) => {
    console.log("frw");
  };

  const handleDelete = async (packageName) => {
    setDeletingPackage(packageName);
    try {
      const response = await fetch(
        `http://localhost:8000/editor/delete-dependency/test`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: packageName }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        console.log(result);
        fetchDependencies();
      } else {
        console.error("Failed to delete package:", response.statusText);
      }
    } catch (err) {
      console.error("Error deleting package:", err);
    } finally {
      setDeletingPackage(null);
    }
  };
  const handleOffcanvasClose = () => {
    setIsOffcanvasOpen(false);
  };

  const handleEdit = (packageName, packageVersion) => {
    setEditingPackage({ name: packageName, version: packageVersion });
    setIsOffcanvasOpen(true);
  };

  return (
    <div id="dependencyConfig">
      {isLoading && (
        <div className="loading-overlay">
          <Spinner animation="border" role="status" aria-hidden="true" />
        </div>
      )}
      <div className="container-fluid text-white">
        <div className="col-12 my-3 px-4">
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-secondary"
              onClick={handleAddPackageClick}
            >
              Add Dependency
            </button>
          </div>
        </div>

        {dependencies.map(([name, version], index) => (
          <div key={index} className="col-12 px-3">
            <DependencyFileCard
              packageName={name}
              packageVersion={version}
              onDelete={() => handleDelete(name)}
              onEdit={() => handleEdit(name, version)}
              isDeleting={deletingPackage === name}
            />
          </div>
        ))}
      </div>
      <Offcanvas
        isOpen={isOffcanvasOpen}
        title={!editingPackage ? "Add Dependency" : "Edit Dependency"}
        width="450px"
        onClose={handleOffcanvasClose}
      >
        <PackageModal
          onSubmit={handleModalSubmit}
          onClose={handleOffcanvasClose}
          editingPackage={editingPackage}
        />
      </Offcanvas>
    </div>
  );
};

export default DependencyConfig;

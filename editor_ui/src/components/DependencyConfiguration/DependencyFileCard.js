import React from "react";
import { Card, ButtonGroup, Button, Spinner } from "react-bootstrap";
import DeleteIcon from "../../assets/icons/delete-trash.svg";
import EditIcon from "../../assets/icons/edit-icon.svg";

const DependencyFileCard = ({
  packageName,
  packageVersion,
  onDelete,
  onEdit,
  isDeleting,
}) => {
  return (
    <Card className="mb-2 bg-dark">
      <Card.Body className="p-2 d-flex justify-content-between align-items-center">
        <div className="font-weight-bold text-white">
          {packageName}: {packageVersion}
        </div>
        <ButtonGroup>
          <Button variant="dark" title="Edit" onClick={onEdit}>
            <img src={EditIcon} alt="" height={24} className="mx-2" />
          </Button>
          <Button
            variant="dark"
            onClick={onDelete}
            title="Delete"
            disabled={!onDelete || isDeleting}
          >
            {isDeleting ? (
              <Spinner
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              <img src={DeleteIcon} alt="" height={24} className="mx-2" />
            )}
          </Button>
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
};

export default DependencyFileCard;

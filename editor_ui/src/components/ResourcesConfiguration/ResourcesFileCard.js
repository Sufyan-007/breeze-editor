import React from "react";
import { Card, ButtonGroup, Button } from "react-bootstrap";
import DeleteIcon from "../../assets/icons/delete-trash.svg";

const ResourcesFileCard = ({ file, onDelete }) => {
  return (
    <Card className="mb-2 bg-dark">
      <Card.Body className="p-2">
        <div className="d-flex justify-content-between align-items-center">
          <div className="font-weight-bold text-white">{file.name}</div>
          <ButtonGroup>
            <Button variant="dark" onClick={onDelete} title="Delete">
              <img src={DeleteIcon} alt="" height={24} className="mx-2" />
            </Button>
          </ButtonGroup>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ResourcesFileCard;

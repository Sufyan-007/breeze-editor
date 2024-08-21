import React from "react";
import { Card, ButtonGroup, Button } from "react-bootstrap";
import DeleteIcon from "../../assets/icons/delete-trash.svg";
import EditIcon from "../../assets/icons/edit-icon.svg";
import ViewIcon from "../../assets/icons/view-eye.svg";

const CssFileCard = ({ fileName, onEdit, onDelete, onView }) => {
  return (
    <Card className="mb-2 bg-dark">
      <Card.Body className="p-2">
        <div className="d-flex justify-content-between align-items-center">
          <div className="font-weight-bold text-white">{fileName}</div>
          <ButtonGroup>
            <Button variant="dark" onClick={onView} title="View">
              <img src={ViewIcon} alt="" height={24} className="mx-2" />
            </Button>
            <Button variant="dark" onClick={onEdit} title="Edit">
              <img src={EditIcon} alt="" height={24} className="mx-2" />
            </Button>
            <Button variant="dark" onClick={onDelete} title="Delete">
              <img src={DeleteIcon} alt="" height={24} className="mx-2" />
            </Button>
          </ButtonGroup>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CssFileCard;

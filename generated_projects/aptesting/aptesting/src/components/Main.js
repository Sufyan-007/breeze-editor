import React, { useState, Fragment } from "react";
import { Container } from "react-bootstrap";

const Main = (props) => {
  return (
    <Fragment>
      <Container id="Main" className="vw-100 vh-100 bg-light">
        <Container className="bg-dark" id="Main-0">
          Hello world
        </Container>
      </Container>
    </Fragment>
  );
};

export default Main;

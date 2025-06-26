import React from "react";
import { Outlet } from "react-router-dom";
import NavigationBar from "../Component/Header/NavigationBar";
import SideImg from "../../src/Asset/EMIimg.svg";
import "./AuthLayout.css";
import Footer from "../Component/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Container } from "react-bootstrap";
import "../GlobalStyle/GlobalTheme.css";

function AuthLayout() {
  return (
    <Container
      fluid
      style={{ height: "100%", width: "100%", padding: 0, margin: 0 }}
    >
      <NavigationBar />
      <Row style={{ width: "100vw", height: "100vh" }}>
        <Col xl={6} lg={6} md={6} className="vanising-div">
          <div style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
            <img src={SideImg} width="85%" alt="sideimg" id="sideimg" />
          </div>
        </Col>
        <Col
          xl={6}
          lg={6}
          md={6}
          sm={12}
          xs={12}
          className="d-flex justify-content-center align-items-center p-0 m-0"
        >
          <Outlet />
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}

export default AuthLayout;

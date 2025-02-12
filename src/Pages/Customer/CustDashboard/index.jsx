import React,{useEffect, useState} from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import OrderTable from "./OrderTable";
import CustNewOrder from "../CustNewOrder";

function CustomerDashboard() {
  const [isDisable, setIsDisable] = useState(false);

  return (
    <Container fluid style={{ width: "100%", padding: 0 }}>
      <ToastContainer/>
      <Row style={{ marginTop: "60px", marginLeft: "3px", width: "98%" }}>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <h5>Customer Order Dashboard</h5>
          <hr className="mt-1 mb-2"/>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <OrderTable isDisable={isDisable} setIsDisable={setIsDisable}/>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ padding: "0px", margin: "0px" }}
        >
          <CustNewOrder isDisable={isDisable} setIsDisable={setIsDisable}/>
        </Col>
      </Row>
    </Container>
  );
}

export default CustomerDashboard;

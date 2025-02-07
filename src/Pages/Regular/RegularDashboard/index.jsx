import React from "react";
import "./regular.css";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import OrderTable from "./OrderTable";
import RegularOrder from "../RegularNewOrder";
function RegularDashboard() {
  return (
    <Container fluid style={{ width: "100%", padding: 0 }}>
      <Row style={{ marginTop: "60px", marginLeft: "3px", width: "98%" }}>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <div className="d-flex justify-content-between">
            <div>
              {" "}
              <h5>Regular Order Dashboard</h5>
            </div>
          </div>
          <hr style={{ marginTop: "2px" }} />
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <OrderTable />
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ padding: "0px", margin: "0px" }}
        >
          <RegularOrder />
        </Col>
      </Row>
    </Container>
  );
}

export default RegularDashboard;

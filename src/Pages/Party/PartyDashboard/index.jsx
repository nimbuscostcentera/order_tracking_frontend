import React from 'react';
import "./party.css";
import { Container, Row, Col } from 'react-bootstrap';

import OrderTable from "./OrderTable"
import PartyOrder from '../PartyNewOrder';


function PartyDashboard() {
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
              <h5>Party Order Dashboard</h5>
          </div>
          <hr className='mt-1 mb-2'/>
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
        >
          <PartyOrder />
        </Col>
      </Row>
    </Container>
  )
}

export default PartyDashboard;

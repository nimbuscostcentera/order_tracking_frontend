import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAddCity from "../../store/useAddCity";
import useFetchAuth from "../../store/useFetchAuth";

import CityTable from "./CityTable";

function CityListEdit() {
  const [CustData, setCustData] = useState({
    CityCode: null,
    DESCRIPTION: null,
  });
  const [isDisable, setIsDisable] = useState(false);
  const { user } = useFetchAuth();
  const {
    InsertCity,
    AddCitySuccess,
    isAddCityLoading,
    AddCityError,
    ClearStateCityAdd,
  } = useAddCity();

  const OnChangeHandler = (e) => {
    console.log(e);
    let key = e.target.name;
    let value = e.target.value;
    setCustData((prev) => ({ ...prev, [key]: value }));
  };
  const SaveData = () => {
    // Check if any field is empty or null
    if (!CustData.CityCode || !CustData.DESCRIPTION) {
      toast.error("All fields are required! ", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
  
    // Proceed to save data if validation passes
    InsertCity({ ...CustData, ...user });
  };

  //toaster
  useEffect(() => {
    if (isAddCityLoading) {
      toast.dismiss();
      toast.loading("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (AddCitySuccess) {
      toast.dismiss();
      toast.success("City Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setCustData({
        CityCode: null,
        DESCRIPTION: null,
      });
    }
    if (AddCityError) {
      toast.dismiss();
      toast.error(AddCityError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateCityAdd();
  }, [isAddCityLoading, AddCitySuccess, AddCityError]);

  return (
    <Container fluid style={{ width: "100%", padding: 0 }}>
      <ToastContainer />
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
              <h5>Add City</h5>
            </div>
          </div>
          <hr style={{ marginTop: "2px" }} />
        </Col>
        <Col
          xs={12}
          sm={12}
          md={6}
          lg={6}
          xl={6}
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <div
            style={{
              width: "100%",
              overflow: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "3px 10px",
                      borderBottom: "1px solid lightgrey",
                    }}
                  >
                    <i className="bi bi-person-circle"></i>
                  </th>
                  <th>City Code*</th>
                  <th>DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <input
                      placeholder="City Code"
                      className="input-cell"
                      name="CityCode"
                      value={CustData?.CityCode || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="City name"
                      className="input-cell"
                      name="DESCRIPTION"
                      value={CustData?.DESCRIPTION || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="d-flex justify-content-start align-items-center mt-2">
            <Button variant="success" onClick={() => SaveData()} disabled={isDisable}>
              Add
            </Button>
          </div>
        </Col>
        <Col>
          <div>
            <hr className="my-2" />
            <h5>Edit City</h5>
            <hr className="my-2" />
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px" }}
        >
          <CityTable isDisable={isDisable} setIsDisable={setIsDisable}/>
        </Col>
      </Row>
    </Container>
  );
}

export default CityListEdit;

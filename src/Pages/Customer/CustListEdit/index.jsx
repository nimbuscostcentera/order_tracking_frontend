import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerDetils from "./CustomerDetails";
import SearchableDropDown from "../../../Component/SearchableDropDown";
import useFetchCity from "../../../store/useFetchCity";
import useFetchState from "../../../store/useFetchState";
import useFetchAuth from "../../../store/useFetchAuth";
import useRegCustomer from "../../../store/useRegCustomer";
import PhnoValidation from "../../../GlobalFunctions/PhnoValidation"
function CustListEdit() {
  const navigate = useNavigate();
  const [isDisable, setIsDisable] = useState(false);
  const { user } = useFetchAuth();
  const { CityList = [], isCityLoading, fetchCityMaster } = useFetchCity();
  const { StateList = [], isStateLoading, fetchStateMaster } = useFetchState();
  const {
    InsertCust,
    CustRegSuccess,
    isCustRegLoading,
    CustRegError,
    ClearStateInserCust,
  } = useRegCustomer();

  useEffect(() => {
    fetchCityMaster(user);
    fetchStateMaster(user);
  }, []);

  const CityListOption = useMemo(() => {
    return CityList?.map((item) => ({
      label: `${item?.CityCode}:${item?.DESCRIPTION}`,
      value: `${item?.id}`,
    }));
  }, [isCityLoading]);

  const StateListOption = useMemo(() => {
    return StateList?.map((item) => ({
      label: `${item?.StateCode}:${item?.DESCRIPTION}`,
      value: `${item?.id}`,
    }));
  }, [isStateLoading]);

  const [CustData, setCustData] = useState({
    CUSTCode: null,
    NAME: null,
    PHONE: null,
    ADDRESS1: null,
    ADDRESS2: null,
    ADDRESS3: null,
    City: null,
    State: null,
  });
  useEffect(() => {
    console.log(CustRegSuccess, CustRegError);

    if (isCustRegLoading && !CustRegSuccess && !CustRegError) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (CustRegSuccess && !isCustRegLoading && !CustRegError) {
      toast.success("Customer Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setCustData({
        CUSTCode: null,
        NAME: null,
        PHONE: null,
        ADDRESS1: null,
        ADDRESS2: null,
        ADDRESS3: null,
        City: null,
        State: null,
      });
      
    } else if (CustRegError && !isCustRegLoading && !CustRegSuccess) {
      toast.error(CustRegError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateInserCust();
  }, [isCustRegLoading, CustRegSuccess, CustRegError]);

  const OnChangeHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    console.log(value, key);

    setCustData((prev) => ({ ...prev, [key]: value }));
  };

  const SaveData = () => {
    // Destructure CustData for easy validation
    const { CUSTCode, NAME, PHONE, ADDRESS1, ADDRESS2, ADDRESS3, City, State } =
      CustData;
 
    // Check if any required field is empty or null
    if (
      !CUSTCode ||
      !NAME ||
      !PHONE ||
      !ADDRESS1 ||
      !ADDRESS2 ||
      !ADDRESS3 ||
      !City ||
      !State
    ) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
 
    // Check if the phone number is exactly 10 digits
    if (!/^\d{10}$/.test(PHONE)) {
      toast.error("Phone number must be exactly 10 digits!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
  if (!PhnoValidation(PHONE)) {
     toast.error("Invalid Phone Number!", {
       position: "top-right",
       autoClose: 3000,
     });
     return;
  }
    // Proceed to save data if validation passes
    InsertCust({ ...CustData, ...user });
  };
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
            <h5>Customer Add</h5>
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
          <div
            style={{
              width: "100%",
              overflow: "auto",
            }}
          >
            <table>
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
                  <th>Customer Code*</th>
                  <th>Customer Name*</th>
                  <th>Phone No.*</th>
                  <th>Address1*</th>
                  <th>Address2*</th>
                  <th>Address3*</th>
                  <th>City*</th>
                  <th>State*</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <input
                      placeholder="Customer Code"
                      className="input-cell"
                      name="CUSTCode"
                      value={CustData?.CUSTCode || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Customer Name"
                      className="input-cell"
                      name="NAME"
                      value={CustData?.NAME || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Contact Number"
                      className="input-cell"
                      value={CustData?.PHONE || ""}
                      name="PHONE"
                      onChange={OnChangeHandler}
                      type="tel"
                      maxLength={10}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Address1"
                      className="input-cell"
                      name="ADDRESS1"
                      value={CustData?.ADDRESS1 || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={300}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Address2"
                      className="input-cell"
                      name="ADDRESS2"
                      value={CustData?.ADDRESS2 || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={300}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Address3"
                      name="ADDRESS3"
                      className="input-cell"
                      value={CustData?.ADDRESS3 || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={300}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={CityListOption}
                      handleChange={(e) => OnChangeHandler(e)}
                      selectedVal={CustData?.City}
                      label={"City"}
                      placeholder={"--Select City--"}
                      key={1}
                      defaultval={-1}
                      width={"200px"}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={StateListOption}
                      handleChange={(e) => OnChangeHandler(e)}
                      selectedVal={CustData?.State}
                      label={"State"}
                      placeholder={"--Select State--"}
                      key={2}
                      defaultval={-1}
                      width={"200px"}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end align-items-center my-1">
            <Button
              variant="success"
              style={{ padding: "1px 9px" }}
              onClick={() => SaveData()}
              disabled={isDisable}
            >
              {/* <i className="bi bi-plus"></i> */}
              Add
            </Button>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <hr className="my-1" />
          <div className="d-flex justify-content-between m-0">
            <h5>Customer Edit</h5>
          </div>
          <hr style={{ marginTop: "2px" }} />
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px", marginTop: "5px" }}
        >
          <CustomerDetils isDisable={isDisable} setIsDisable={setIsDisable}/>
        </Col>
      </Row>
    </Container>
  );
}

export default CustListEdit;

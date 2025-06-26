import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SearchableDropDown from "../../../Component/SearchableDropDown";
import useFetchCity from "../../../store/useFetchCity";
import useFetchState from "../../../store/useFetchState";
import useFetchAuth from "../../../store/useFetchAuth";
import useAddParty from "../../../store/UseAddParty";
import PartyDetils from "./PartyDetails";
import PhnoValidation from "../../../GlobalFunctions/PhnoValidation";
import EmailValidation from "../../../GlobalFunctions/EmailValidation";

function PartyListEdit() {
  const [isDisable, setIsDisable] = useState(false);
  const { user } = useFetchAuth();
  const { CityList = [], isCityLoading, fetchCityMaster } = useFetchCity();
  // const { StateList = [], isStateLoading, fetchStateMaster } = useFetchState();
  const {
    InsertParty,
    PartyRegSuccess,
    isPartyRegLoading,
    PartyRegError,
    ClearAddParty,
  } = useAddParty();

  useEffect(() => {
    fetchCityMaster(user);
    // fetchStateMaster(user);
  }, []);

  const CityListOption = useMemo(() => {
    return CityList?.map((item) => ({
      label: `${item?.CityCode}:${item?.DESCRIPTION}`,
      value: `${item?.id}`,
    }));
  }, [isCityLoading]);

  // const StateListOption = useMemo(() => {
  //   return StateList?.map((item) => ({
  //     label: `${item?.StateCode}:${item?.DESCRIPTION}`,
  //     value: `${item?.id}`,
  //   }));
  // }, [isStateLoading]);

  const [CustData, setCustData] = useState({
    PartyCode: null,
    NAME: null,
    PHONE: null,
    ADDRESS3: null,
    City: null,
  });
  useEffect(() => {
    if (isPartyRegLoading && !PartyRegSuccess && !PartyRegError) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (PartyRegSuccess && !isPartyRegLoading && !PartyRegError) {
      toast.success("Customer Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setCustData({
        PartyCode: null,
        NAME: null,
        PHONE: null,
        ADDRESS3: null,
        City: null,
      });
    } else if (PartyRegError && !isPartyRegLoading && !PartyRegSuccess) {
      toast.error(PartyRegError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearAddParty();
  }, [isPartyRegLoading, PartyRegSuccess, PartyRegError]);

  const OnChangeHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    //console.log(value, key);

    setCustData((prev) => ({ ...prev, [key]: value }));
  };

  const SaveData = () => {
    if (
      !CustData.City ||
      !CustData.NAME ||
      !CustData.ADDRESS3 ||
      !CustData.PHONE ||
      !CustData.PartyCode
    ) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!/^\d{10}$/.test(CustData.PHONE)) {
      toast.error("Phone number must be exactly 10 digits!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!PhnoValidation(CustData.PHONE)) {
      toast.error("Invalid Phone Number!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!EmailValidation(CustData.ADDRESS3)) {
      toast.error("Invalid Email ID!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    InsertParty({ ...CustData, ...user });
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
          <h5>Party List</h5>
          <hr style={{ marginTop: "2px" }} />
        </Col>
        <Col xs={12} sm={10} md={10} lg={10} xl={10}>
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
                  <th>PartyCode*</th>
                  <th>Customer Name*</th>
                  <th>Phone No.*</th>
                  <th>Email*</th>
                  <th>City*</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <input
                      placeholder="Party Code"
                      className="input-cell"
                      name="PartyCode"
                      value={CustData?.PartyCode || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Party Name"
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
                  {/* <td>
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
                  </td> */}
                  <td>
                    <input
                      placeholder="Email"
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
                  {/* <td>
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
                  </td> */}
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        <Col
          xs={12}
          sm={2}
          md={2}
          lg={2}
          xl={2}
        >
          <div className="d-flex justify-content-xs-center justify-content-sm-start align-items-center my-3">
            <Button
              variant="success"
              style={{ padding: "2px 9px" }}
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
          <div className="d-flex justify-content-between">
            <h5>Party Edit</h5>
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
          <PartyDetils isDisable={isDisable} setIsDisable={setIsDisable} />
        </Col>
      </Row>
    </Container>
  );
}

export default PartyListEdit;

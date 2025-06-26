import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";

import MultipleSelection from "../../Component/MultipleSelection";
import KarigarTable from "./KarigarTable";

import useFetchAuth from "../../store/useFetchAuth";
import useAddArtisan from "../../store/useAddArtisan";
import useFetchItem from "../../store/useFetchItem";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";
import EmailValidate from "../../../src/GlobalFunctions/EmailValidation"

function KarigarListEdit() {
  const [karigarData, setKarigarData] = useState({
    CODE: null,
    NAME: null,
    ADDRESS: null,
    PHONE: null,
    CONTACTPERSON: null,
    MANAGER_CONTACT:null,
    City: null,
    data: [],
    selectedValue: [],
  });
  const [isDisable, setIsDisable] = useState(false);

  const { user } = useFetchAuth();
  const {
    KarigarRegSuccess,
    isKarigarRegLoading,
    KarigarRegError,
    InsertKarigar,
    ClearStateArtisanAdd,
  } = useAddArtisan();
  const { ItemList, isItemLoading, fetchItemMaster } =useFetchItem();

  const ItemListOption = useMemo(() => {
    return ItemList?.map((item) => ({
      label: `${item?.ITEMCODE}:${item?.DESCRIPTION}`,
      value: `${item?.id}`,
    }));
  }, [isItemLoading, ItemList]);


  const HandleMultiSelection = (ids) => {
    // //console.log(ids);
    let array = ids?.map((item) => item?.value);
    setKarigarData((prev) => ({ ...prev, data: array, selectedValue: ids }));
  };

  const OnChangeHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    setKarigarData((prev) => ({ ...prev, [key]: value }));
  };
  const SaveData = (e) => {
    e.preventDefault();
    // //console.log(karigarData,"karigardata")
    // Check if any required field in karigarData is empty or null
    if (
      !karigarData.CODE ||
      !karigarData.NAME ||
      !karigarData.ADDRESS ||
      !karigarData.PHONE ||
      !karigarData.CONTACTPERSON ||
      !karigarData.MANAGER_CONTACT
    ) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!EmailValidate(karigarData.ADDRESS)) {
      toast.error("Invalid Email!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!/^\d{10}$/.test(karigarData.PHONE)) {
      toast.error("Phone number must be exactly 10 digits!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!PhnoValidation(karigarData.PHONE)) {
      toast.error("Invalid Phone Number!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!/^\d{10}$/.test(karigarData.MANAGER_CONTACT)) {
      toast.error("Phone number must be exactly 10 digits!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!PhnoValidation(karigarData.MANAGER_CONTACT)) {
      toast.error("Invalid Phone Number!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Proceed to save data if validation passes
    InsertKarigar({ ...karigarData, ...user });
  };

  useEffect(() => {
    fetchItemMaster(user);
  }, []);

  useEffect(() => {
    if (isKarigarRegLoading && !KarigarRegError && !KarigarRegSuccess) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (KarigarRegSuccess && !isKarigarRegLoading && !KarigarRegError) {
      toast.success("Artisan Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setKarigarData({
        CODE: null,
        NAME: null,
        ADDRESS: null,
        PHONE: null,
        CONTACTPERSON: null,
        MANAGER_CONTACT: null,
        data: [],
        selectedValue: [],
      });
    }
    if (KarigarRegError && !isKarigarRegLoading && !KarigarRegSuccess) {
      toast.error(KarigarRegError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateArtisanAdd();
  }, [isKarigarRegLoading, KarigarRegSuccess, KarigarRegError]);
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
              <h5>Karigar Add</h5>
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
          style={{ paddingLeft: "15px", margin: "0px", width: "100%" }}
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
                overflow: "auto",
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
                  <th>Karigar Code*</th>
                  <th>Karigar Name*</th>
                  <th>Email*</th>
                  <th>Contact No.*</th>
                  <th>Manager Name*</th>
                  <th>Manager No*</th>
                  <th>Select Items*</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <input
                      placeholder="Karigar Code"
                      className="input-cell"
                      name="CODE"
                      value={karigarData?.CODE || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Karigar Name"
                      className="input-cell"
                      name="NAME"
                      value={karigarData?.NAME || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Email"
                      className="input-cell"
                      value={karigarData?.ADDRESS || ""}
                      name="ADDRESS"
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Contact Number"
                      className="input-cell"
                      name="PHONE"
                      value={karigarData?.PHONE || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={10}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Contact Person"
                      className="input-cell"
                      name="CONTACTPERSON"
                      value={karigarData?.CONTACTPERSON || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={300}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Manager Number"
                      className="input-cell"
                      name="MANAGER_CONTACT"
                      value={karigarData?.MANAGER_CONTACT || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={10}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <MultipleSelection
                      options={ItemListOption}
                      handleChange={HandleMultiSelection}
                      selectedVal={karigarData?.selectedValue}
                      label={"data"}
                      placeholder={"--Select Items--"}
                      key={1}
                      defaultval={-1}
                      style={{ width: "100%" }}
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
              onClick={(e) => SaveData(e)}
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
            <h5>Karigar Edit</h5>
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
          <KarigarTable isDisable={isDisable} setIsDisable={setIsDisable} />
        </Col>
      </Row>
    </Container>
  );
}

export default KarigarListEdit;

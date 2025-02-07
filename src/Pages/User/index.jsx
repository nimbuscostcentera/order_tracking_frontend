import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAddCity from "../../store/useAddCity";
import useFetchAuth from "../../store/useFetchAuth";

// import CityTable from "./CityTable";
import UserTable from "./UserTable";
import useAddUser from "../../store/useAddUser";
import SearchableDropDown from "../../Component/SearchableDropDown";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";

function UserListEdit() {
  const [CustData, setCustData] = useState({
    UserName: null,
    Phonenumber: null,
    Utype:null,
    password:null
  });
  const [isDisable, setIsDisable] = useState(false);
  // console.log(CustData);
  // const { user } = useFetchAuth();
  const {
    InsertUser,
    AddUserSuccess,
    isAddUserLoading,
    AddUserError,
    ClearStateUserAdd,
  } = useAddUser();
   const utypeOptions = [
     {
       label: "Admin",
       value: 1,
     },
     {
       label: "User",
       value: 2,
     },
   ];

  const OnChangeHandler = (e) => {
    // console.log(e);
    let key = e.target.name;
    let value = e.target.value;
    setCustData((prev) => ({ ...prev, [key]: value }));
  };
  const SaveData = () => {
    // console.log(CustData,"userdata")
     if (!CustData.UserName || !CustData.password || !CustData.Phonenumber || !CustData.Utype) {
          toast.error("All fields are required! ", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }

         if (!/^\d{10}$/.test(CustData.Phonenumber)) {
                  toast.error("Phone number must be exactly 10 digits!", {
                    position: "top-right",
                    autoClose: 3000,
                  });
                  return;
                }
              if (!PhnoValidation(CustData.Phonenumber)) {
                 toast.error("Invalid Phone Number!", {
                   position: "top-right",
                   autoClose: 3000,
                 });
                 return;
              }
    InsertUser({ ...CustData });
  };

  //toaster
  useEffect(() => {
    // if (isAddUserLoading) {
    //   toast.dismiss();
    //   toast.loading("pleaes wait...", {
    //     position: "top-right",
    //     autoClose: 3000,
    //   });
    // }
    if (AddUserSuccess) {
      toast.dismiss();
      toast.success("User Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setCustData({
        UserName: null,
        Phonenumber: null,
        Utype:null,
        password:null
      });
    }
    if (AddUserError) {
      toast.dismiss();
      toast.error(AddUserError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateUserAdd();
  }, [isAddUserLoading, AddUserSuccess, AddUserError]);
  console.log(isAddUserLoading, "loading");

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
              <h5>Add User</h5>
            </div>
          </div>
          <hr style={{ marginTop: "2px" }} />
        </Col>
        <Col
          xs={12}
          sm={12}
          md={6}
          lg={6}
          xl={8}
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
                  <th>Name*</th>
                  <th>Phone Number</th>
                  <th>Password*</th>
                  <th>User Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <input
                      placeholder="User name"
                      className="input-cell"
                      name="UserName"
                      value={CustData?.UserName || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Phone number"
                      className="input-cell"
                      name="Phonenumber"
                      value={CustData?.Phonenumber || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={10}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="password"
                      className="input-cell"
                      name="password"
                      value={CustData?.password || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={30}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={utypeOptions}
                      handleChange={(e) => OnChangeHandler(e)}
                      selectedVal={CustData?.Utype}
                      label={"Utype"}
                      placeholder={"--Select Utype--"}
                      key={1}
                      defaultval={-1}
                      width={"200px"}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs={12} sm={12} md={2} lg={2} xl={2}>
          <div className="d-flex justify-content-start align-items-center mt-2">
            <Button variant="success" onClick={() => SaveData()} disabled={isDisable}>
              {isAddUserLoading===true ? "Loading..." : "Add"}
            </Button>
          </div>
        </Col>
        <Col  xs={12} sm={12} md={12} lg={12} xl={12}>
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
          <UserTable isDisable={isDisable} setIsDisable={setIsDisable}/>
        </Col>
      </Row>
    </Container>
  );
}

export default UserListEdit;

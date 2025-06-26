import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import StateTable from "./StateTable";
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import useFetchAuth from "../../store/useFetchAuth";
import useAddState from "../../store/UseAddState";
function StateListEdit() {
  const [CustData, setCustData] = useState({StateCode: null,DESCRIPTION: null});
  const [isDisable, setIsDisable] = useState(false);
  const { user } = useFetchAuth();
  const {
    InsertState,
    AddStateSuccess,
    isAddStateLoading,
    AddStateError,
    ClearStateAdd,
  } = useAddState();

    const OnChangeHandler = (e) => {
      //console.log(e)
      let key = e.target.name;
      let value = e.target.value;
      setCustData((prev) => ({ ...prev, [key]: value }));
    }

    const SaveData = () => {
       if (!CustData.StateCode || !CustData.DESCRIPTION) {
            toast.error("All fields are required! ", {
              position: "top-right",
              autoClose: 3000,
            });
            return;
          }
        
      InsertState({...CustData});
  }
  
  useEffect(() => {
    if (isAddStateLoading && !AddStateSuccess && !AddStateError)
    {
      toast.play("pleaes wait...", {
      position: "top-right",
      autoClose: 3000,
      })
    }
    if (AddStateSuccess && !isAddStateLoading && !AddStateError) {
      toast.success("State Added Successfully", {
      position: "top-right",
      autoClose: 3000,
      });
      setCustData({
      StateCode: null,
      DESCRIPTION: null,
      });
    }
    if (AddStateError && !isAddStateLoading && !AddStateSuccess) {
    toast.error(AddStateError, {
    position: "top-right",
    autoClose: 3000,
    });
    }
    ClearStateAdd();
  }, [isAddStateLoading, AddStateSuccess, AddStateError]);

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
          
              <h5>State List</h5>
          
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
                  <th>State Code*</th>
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
                      placeholder="State Code"
                      className="input-cell"
                      name="StateCode"
                      value={CustData?.StateCode || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{
                        width: "100%",
                      }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="State name"
                      className="input-cell"
                      name="DESCRIPTION"
                      value={CustData?.DESCRIPTION || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{
                        width: "100%",
                      }}
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
          style={{ paddingLeft: "15px"}}
        >
          <StateTable setIsDisable={setIsDisable} isDisable={isDisable} />
        </Col>
      </Row>
    </Container>
  );
}

export default StateListEdit;

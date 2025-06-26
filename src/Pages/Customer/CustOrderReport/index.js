import React, { useEffect, useState, useMemo } from "react";
import Table from "../../../Component/Table";
import useCustOrder from "../../../store/UseCustOrder";
import useFetchAuth from "../../../store/useFetchAuth";
import usePlaceCustOrder from "../../../store/usePlaceOrderCust";
import { Col, Container, Row } from "react-bootstrap";
import useFetchArtisan from "../../../store/useFetchArtisan";
import SearchableDropDown2 from "../../../Component/SearchableDropDown2";
import checkOrder from "../../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../../GlobalFunctions/SortArrayByNumber";
import useFetchCust from "../../../store/useFetchCust";
import GetReportPdf from "../CustOrderPrint";
import "./report.css";

function CustReport() {
  // State variables
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
    printId: -1,
    ArtisanId: null,
    CustId: null,
    ChoiceId: "Till Pending",
  });
  const [trigger, setTrigger] = useState(0); // A trigger state
  const [filteredData, setFilteredData] = useState([]);

  // Store data from Zustand
  const { user } = useFetchAuth();
  const { CustomerDashList, loading, error, fetchCustDash } = useCustOrder();
  const { CustOrderSuccess } = usePlaceCustOrder();
  const { ArtisanList, fetchArtisanMaster } = useFetchArtisan();
  const { fetchCustomrData, CustomerList } = useFetchCust();

  // Column definitions for the table
  const Col1 = [
    { headername: "Customer Ref.", fieldname: "SampleRcpVou", type: "Date" },
    { headername: "OrderDate", fieldname: "OrderDate", type: "Date" },
    { headername: "OrderNo", fieldname: "Orderno", type: "String" },
    { headername: "Customer Code", fieldname: "CUSTCode", type: "String" },
    { headername: "Karigar  Code", fieldname: "Artisan", type: "String" },
    { headername: "Delivery Date", fieldname: "DeliveryDate", type: "String" },
  ];
  const choice = ["Till Pending", "Done", "All"];

  // Sorting function
  const SortingFunc = (header, type) => {
    const currentOrder = checkOrder(filteredData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";
    let result;
    if (type === "String") {
      result = SortArrayByString(newOrder, filteredData, header);
    } else if (type === "Date") {
      result = SortArrayByDate(newOrder, filteredData, header);
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    }
    setFilteredData(result);
  };

  const OnChangeHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    setParams({ ...params, [key]: value });
  };

  const handleprint = () => {
    GetReportPdf(filteredData);
    //console.log(filteredData);
  };

  // Artisan list for dropdown
  const SelectArtisanList = useMemo(() => {
    if (!ArtisanList) return []; // Ensure ArtisanList is available
    return ArtisanList.map((item) => ({
      label: `${item?.CODE}`, // Ensure CODE exists
      value: item?.CODE, // Ensure ID exists
    }));
  }, [ArtisanList]);

  // Party list for dropdown
  const SelectCustList = useMemo(() => {
    if (!CustomerList) return []; // Ensure ArtisanList is available
    return CustomerList.map((item) => ({
      label: `${item?.CUSTCode}`, // Ensure CODE exists
      value: item?.CUSTCode, // Ensure ID exists
    }));
  }, [CustomerList]);

  // Choice list for dropdown
  const SelectChoiceList = useMemo(() => {
    if (!choice) return []; // Ensure ArtisanList is available
    return choice.map((item) => ({
      label: item, // Ensure CODE exists
      value: item, // Ensure ID exists
    }));
  }, [choice]);

  const filterCustomerData = () => {
    let transformlist = [...CustomerDashList] || [];
    if (params.ArtisanId) {
      transformlist = transformlist.filter(
        (customer) => customer.Artisan === params.ArtisanId
      );
    }
    if (params.CustId) {
      transformlist = transformlist.filter(
        (customer) => customer.CUSTCode === params.CustId
      );
    }
    if (params.ChoiceId) {
      if (params.ChoiceId === "Till Pending") {
        transformlist = transformlist.filter(
          (customer) => customer.Despatch === null
        );
      } else if (params.ChoiceId === "Done") {
        transformlist = transformlist.filter(
          (customer) => customer.Despatch !== null
        );
      }
      setFilteredData(transformlist);
    }
  };

  const ActionFunc = () => {};
  const SaveChange = () => {};

  // useEffects
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    fetchCustDash({ today });
    fetchArtisanMaster();
    fetchCustomrData();
  }, [user, CustOrderSuccess]);

  useEffect(() => {
    filterCustomerData();
  }, [CustomerDashList, params.ArtisanId, params.CustId, params.ChoiceId]);

  return (
    <Container fluid style={{ width: "100%", padding: 0 }}>
      <Row style={{ marginTop: "60px", marginLeft: "3px", width: "98%" }}>
        {/* Header Section */}
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="d-flex justify-content-between align-items-center">
            <h5>Customer Order Report</h5>
            <button
              className="btn"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "5px 8px",
                borderRadius: "8px",
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.3s, transform 0.2s",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              onClick={handleprint}
            >
              <i
                className="bi bi-printer"
                style={{
                  fontSize: "20px",
                  marginRight: "8px",
                }}
              ></i>
              <span style={{ fontWeight: "normal" }}>Print</span>
            </button>
          </div>
          <hr style={{ marginTop: "2px" }} />
        </Col>

        {/* Dropdown Section */}
        <Col xs={12} sm={12} md={12} lg={6} xl={4}>
          <div
            className="d-flex align-items-center"
            style={{ marginBottom: "10px" }}
          >
            <label
              htmlFor="choiceDropdown"
              style={{
                marginRight: "10px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              Choice:
            </label>
            <div style={{ width: "auto", zIndex: "100" }}>
              <SearchableDropDown2
                options={SelectChoiceList}
                handleChange={OnChangeHandler}
                label="ChoiceId"
                selectedVal={params.ChoiceId} // Pass the selected artisan
                placeholder="Select Order Status"
              />
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={6} xl={4}>
          <div
            className="d-flex align-items-center"
            style={{ marginBottom: "10px" }}
          >
            <label
              htmlFor="choiceDropdown"
              style={{
                marginRight: "10px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              Karigar Code:
            </label>
            <div style={{ width: "auto", zIndex: "95" }}>
              <SearchableDropDown2
                options={SelectArtisanList}
                handleChange={OnChangeHandler}
                label="ArtisanId"
                selectedVal={params.ArtisanId} // Pass the selected artisan
                placeholder="Select Karigar"
              />
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={6} xl={4}>
          <div
            className="d-flex align-items-center"
            style={{ marginBottom: "10px" }}
          >
            <label
              htmlFor="choiceDropdown"
              style={{
                marginRight: "10px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              Customer Code:
            </label>
            <div style={{ width: "auto", zIndex: "90" }}>
              <SearchableDropDown2
                options={SelectCustList}
                handleChange={OnChangeHandler}
                label="CustId"
                selectedVal={params.CustId} // Pass the selected artisan
                placeholder="Select Customer"
              />
            </div>
          </div>
        </Col>

        {/* Table Section */}
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div id="table-box" style={{ height: "70vh" }}>
            <Table
              tab={filteredData || []}
              isAction={params?.IsAction}
              ActionFunc={ActionFunc}
              ActionId={params?.ActionID}
              ChangeHandler={OnChangeHandler}
              SaveChange={SaveChange}
              onSorting={SortingFunc}
              Col={Col1}
              handleprint={handleprint}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CustReport;

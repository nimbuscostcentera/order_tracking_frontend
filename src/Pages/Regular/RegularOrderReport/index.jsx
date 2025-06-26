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
import GetReportPdf from "./getReportPdf";
import useRegularFetch from "../../../store/useRegularFetch";
import useFetchItem from "../../../store/useFetchItem";
import "./report.css"
function RegularReport() {
  // State variables
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
    printId: -1,
    ArtisanId: null,
    ItemId: null,
    ChoiceId: "Till Pending",
  });
  const [filteredData, setFilteredData] = useState([]);

  // Store data from Zustand
  const { user } = useFetchAuth();
const { ItemList, fetchItemMaster } = useFetchItem();
  const { ArtisanList, fetchArtisanMaster } = useFetchArtisan();
  const { RegularError, isRegularloading, fetchRegularMaster, RegularList } =
    useRegularFetch();

  // Column definitions for the table
  const Col1 = [
    { headername: "OrderNo", fieldname: "Orderno", type: "String" },
    { headername: "OrderDate", fieldname: "OrderDate", type: "Date" },
    { headername: "Karigar Code", fieldname: "ArtisanCode", type: "String" },
    { headername: "Item Code", fieldname: "Itemcode", type: "String" },
    { headername: "Weight", fieldname: "wt", type: "number" },
  ];
  const choice = ["Till Pending", "Done", "All"];

  // All function
  const transformData = (data) => {
    if (!data) {
      return []; // Handle error or empty case
    }

    return data.flatMap((order) => {
      // For each order, create a new object for every detail item
      return order.Detail.map(({ Rcv, Itemcode, wt }) => ({
        ...order,
        Rcv,
        Itemcode,
        wt,
      }));
    });
  };

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
    //console.log(filteredData);
    GetReportPdf(filteredData);
  };

  // Artisan list for dropdown
  const SelectArtisanList = useMemo(() => {
    if (!ArtisanList) return []; // Ensure ArtisanList is available
    return ArtisanList.map((item) => ({
      label: `${item?.CODE}`, // Ensure CODE exists
      value: item?.CODE, // Ensure ID exists
    }));
  }, [ArtisanList]);

  // Item list for dropdown
  const SelectItemList = useMemo(() => {
    if (!ItemList) return []; // Ensure ArtisanList is available
    return ItemList.map((item) => ({
      label: `${item?.ITEMCODE}`, // Ensure CODE exists
      value: item?.ITEMCODE, // Ensure ID exists
    }));
  }, [ItemList]);

  // Choice list for dropdown
  const SelectChoiceList = useMemo(() => {
    if (!choice) return []; // Ensure ArtisanList is available
    return choice.map((item) => ({
      label: item, // Ensure CODE exists
      value: item, // Ensure ID exists
    }));
  }, [choice]);

  const filterCustomerData = () => {
    let transformedList = transformData(RegularList); // Start with full data

    if (params.ArtisanId) {
      transformedList = transformedList.filter(
        (customer) => customer.ArtisanCode === params.ArtisanId
      );
    }

    if (params.ItemId) {
      transformedList = transformedList.filter(
        (customer) => customer.Itemcode === params.ItemId
      );
    }

    if (params.ChoiceId === "Till Pending") {
      transformedList = transformedList.filter(
        (customer) => customer.Rcv === null
      );
    }
    else if (params.ChoiceId === "Done") {
      transformedList = transformedList.filter(
        (customer) => customer.Rcv !== null
      );
    }

    setFilteredData(transformedList); // Update state only once
  };

  const ActionFunc = () => {};
  const SaveChange = () => {};

  // useEffects
  useEffect(() => {
    fetchArtisanMaster();
    fetchItemMaster();
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    fetchRegularMaster({ today}); // Add other fields as required
  }, [user]);

  useEffect(() => {
    filterCustomerData();
  }, [RegularList, params.ArtisanId, params.ItemId, params.ChoiceId]);

  return (
    <Container fluid style={{ width: "100%", padding: 0 }}>
      <Row style={{ marginTop: "60px", marginLeft: "3px", width: "98%" }}>
        {/* Header Section */}
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="d-flex justify-content-between align-items-center">
            <h5>Regular Order Detail</h5>
            <button
              className="btn"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "3px 8px",
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
                placeholder="Select Artisan"
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
              Item Code:
            </label>
            <div style={{ width: "auto", zIndex: "90" }}>
              <SearchableDropDown2
                options={SelectItemList}
                handleChange={OnChangeHandler}
                label="ItemId"
                selectedVal={params.ItemId} // Pass the selected artisan
                placeholder="Select Item"
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

export default RegularReport;

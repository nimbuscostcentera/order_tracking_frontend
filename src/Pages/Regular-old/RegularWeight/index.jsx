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
import GetReportPdf from "./getReportPdf";
import useRegularFetch from "../../../store/useRegularFetch";
import useFetchItem from "../../../store/useFetchItem";
import useFetchRegularByWt from "../../../store/useFetchRegularByWt";

function RegularOrderWeight() {
  // State variables
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
    printId: -1,
    ItemId: null,
  });

  const [filteredData, setFilteredData] = useState([]);

  // Store data from Zustand
  const { user } = useFetchAuth();
  const { ItemList, fetchItemMaster } = useFetchItem();
  const {
    RegularByWtError,
    isRegularByWtloading,
    fetchRegularByWtMaster,
    RegularByWtList,
  } = useFetchRegularByWt();

  // Column definitions for the table
  const Col1 = [
    { headername: "Item Code", fieldname: "Itemcode", type: "String" },
    { headername: "Total Weight", fieldname: "totwt", type: "number" },
  ];

  // All function

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
    // console.log(filteredData);
  };

  // Item list for dropdown
  const SelectItemList = useMemo(() => {
    if (!ItemList) return []; // Ensure ArtisanList is available
    return ItemList.map((item) => ({
      label: `${item?.ITEMCODE}`, // Ensure CODE exists
      value: item?.ITEMCODE, // Ensure ID exists
    }));
  }, [ItemList]);

  const filterCustomerData = () => {
    if (params.ItemId) {
      const RegularByWtListFiltered = RegularByWtList.filter(
        (item) => item.Itemcode === params.ItemId
      );
      setFilteredData(RegularByWtListFiltered);
    } else {
      setFilteredData(RegularByWtList); // Reset to full list if no artisan selected
    }
  };

  const ActionFunc = () => {};
  const SaveChange = () => {};

  // useEffects
  useEffect(() => {
    fetchItemMaster();
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    fetchRegularByWtMaster({ today }); // Add other fields as required
  }, [user]);

  useEffect(() => {
    filterCustomerData();
  }, [RegularByWtList, params.ItemId]);

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
              Item Code:
            </label>
            <div style={{ width: "auto" }}>
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
          <div style={{ width: "100%", overflow: "auto", height: "50vh" }}>
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

export default RegularOrderWeight;

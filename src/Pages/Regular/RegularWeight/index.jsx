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
import useFetchItemArtisian from "../../../store/useFetchItemArtisian";
import ReusableModal from "../../../Component/Modal";

function RegularOrderWeight() {
  // State variables
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
    printId: -1,
    ItemId: null,
    viewIndex: null
  });

  const [filteredData, setFilteredData] = useState([]);
  const [detailData, setDetailData] = useState([]);
    const [showModal, setShowModal] = useState(false);

  // Store data from Zustand
  const { user } = useFetchAuth();
  const { ItemList, fetchItemMaster } = useFetchItem();
  const {
    RegularByWtError,
    isRegularByWtloading,
    fetchRegularByWtMaster,
    RegularByWtList,
  } = useFetchRegularByWt();
  const {
    fetchItemArtisianMaster,
    ItemArtisianError,
    isItemArtisianLoading,
    ItemArtisianList,
  } = useFetchItemArtisian();

  // Column definitions for the table
  const Col1 = [
    { headername: "Item Code", fieldname: "Itemcode", type: "String" },
    { headername: "Total Weight", fieldname: "totwt", type: "number" },
  ];
  const Col2 = [
    { headername: "Karigar Name", fieldname: "NAME", type: "String" },
    { headername: "Karigar Code", fieldname: "CODE", type: "String" },
  ];

  // All function

  const SortingFunc = (header, type) => {
    if (!filteredData || filteredData.length === 0) {
      // console.error("No data to sort");
      return;
    }
    const currentOrder = checkOrder(filteredData, header);
    console.log(currentOrder);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";
    let result;
 
    if (type == "String") {
      result = SortArrayByString(newOrder, filteredData, header);
    } else if (type == "Date") {
      result = SortArrayByDate(newOrder, filteredData, header);
    } else if (type == "number") {
      console.log(type, newOrder, filteredData, header);
      console.log(header,filteredData);
      result = SortArrayByNumber(newOrder, filteredData, header);
    }
    setFilteredData(result);
  };

  const SortingFuncSub = (header, type) => {
    if (!detailData || detailData.length === 0) {
      // console.error("No data to sort");
      return;
    }
    //console.log(detailData, header, type, "fnd");

    const currentOrder = checkOrder(detailData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";

    let result;
    if (type === "String") {
      //console.log("In string");
      if (params.viewIndex != null) {
        result = SortArrayByString(newOrder, detailData, header);
      } else {
        result = SortArrayByString(newOrder, detailData, header);
      }
    } else if (type === "Date") {
      result = SortArrayByDate(newOrder, detailData, header);
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, detailData, header);
    }
    setDetailData(result);
  };
  const handleClose = () => setShowModal(false);
  const handleViewClick = (index) => {
    setParams((prev) => ({ ...prev, viewIndex: index }));
    const data = filteredData[index];
    //console.log(data);
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    fetchItemArtisianMaster({ Item: data.ID, today });

    // setdetailData(data);
    setShowModal(true);
  };
  const OnChangeHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    setParams({ ...params, [key]: value });
  };

  const handleprint = () => {
    GetReportPdf(filteredData);
    // //console.log(filteredData);
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
        (item) => item.Itemcode == params.ItemId
      ).map((item) => ({
        ...item,
        totwt: parseFloat(item.totwt).toFixed(3), // Ensure it's still a number
      }));
console.log(RegularByWtListFiltered);
      setFilteredData(RegularByWtListFiltered);
    } else {
      const formattedList = RegularByWtList.map((item) => ({
        ...item,
        totwt: parseFloat(item.totwt), // Format all data if no filter is applied
      }));
      console.log(formattedList,RegularByWtList);
      setFilteredData(formattedList);
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
  // //console.log(ItemArtisianList);
  useEffect(() => {
    // //console.log(ItemArtisianList);
    setDetailData(ItemArtisianList);
  }, [ItemArtisianList]);
  useEffect(() => {
    filterCustomerData();
  }, [RegularByWtList, params.ItemId]);

  return (
    <Container fluid style={{ width: "100%", padding: 0 }}>
      <Row style={{ marginTop: "60px", marginLeft: "3px", width: "98%" }}>
        {/* Header Section */}
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="d-flex justify-content-between align-items-center">
            <h5>Item wise Regular Order Report</h5>
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
            <div style={{ width: "auto", zIndex: "100" }}>
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
              isView={true}
              viewPref={"Karigar"}
              handleViewClick={handleViewClick}
            />
            <ReusableModal
              show={showModal}
              handleClose={handleClose}
              body={
                <>
                  <Table
                    tab={detailData}
                    onSorting={SortingFuncSub}
                    Col={Col2}
                  />
                </>
              }
              Title={"Karigar"}
              isSuccess={false}
              isPrimary={true}
              handlePrimary={handleClose} // Optional: Define your primary action
              PrimaryButtonName="Close"
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default RegularOrderWeight;

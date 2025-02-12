import React, { useEffect, useState, useMemo } from "react";

import { Col, Container, Row } from "react-bootstrap";

import Table from "../../../Component/Table";
import ReusableModal from "../../../Component/Modal";
import SearchableDropDown2 from "../../../Component/SearchableDropDown2";

import checkOrder from "../../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../../GlobalFunctions/SortArrayByNumber";

import useArtisanWiseWt from "../../../store/useArtisanWiseWt";
import useFetchAuth from "../../../store/useFetchAuth";
import useFetchArtisan from "../../../store/useFetchArtisan";
import useArtisanWiseOrderedItemwt from "../../../store/useArtisanWiseOrderedItemwt"
import GetReportPdf from "./getRepoPdf";

import "./report.css";
import moment from "moment";
function ArtisanWiseWt() {
  // State variables

  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
    printId: -1,
    ArtisanID: null,
    showModal:false
  });

  const [filteredData, setFilteredData] = useState([]);

  // Store data from Zustand
  const { user } = useFetchAuth();
  // const { ItemList, fetchItemMaster } = useFetchItem();
  const { fetchArtisanMaster, ArtisanList } = useFetchArtisan();
  const {
    RegularByWtError,
    isRegularByWtloading,
    fetchArtisanWiseWt,
    ArtisanWiseWtList,
  } = useArtisanWiseWt();
  const { fetchArtisanWiseOrderedItemwt,ArtwtItem} = useArtisanWiseOrderedItemwt();
  // Column definitions for the table
  const Col1 = [
    { headername: "Artisan Name", fieldname: "name", type: "String" },
    { headername: "Artisan Code", fieldname: "code", type: "String" },
    { headername: "Total Weight", fieldname: "totwt", type: "number" },
  ];
  // Column definitions for the Sub table
    const Col2 = [
      { headername: "Item Name", fieldname: "DESCRIPTION", type: "String" },
      { headername: "Item Code", fieldname: "Itemcode", type: "String" },
      { headername: "Weight", fieldname: "wt", type: "number" },
    ];

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
    console.log(params, "params");
    
  };
  const handleprint = () => {
    GetReportPdf(filteredData);
  };
  console.log(ArtisanWiseWtList, "regularByWt");

  // Item list for dropdown
  const SelectArtisanList = useMemo(() => {
    if (!ArtisanList) return []; // Ensure ArtisanList is available
    return ArtisanList.map((item) => ({
      label: `${item?.CODE}`, // Ensure CODE exists
      value: item?.CODE, // Ensure ID exists
    }));
  }, [ArtisanList]);

  const filterCustomerData = () => {
    if (params.ArtisanID) {
      const RegularByWtListFiltered = ArtisanWiseWtList.filter(
        (item) => item.code === params.ArtisanID
      ).map((item) => ({
        ...item,
        totwt: item.totwt.toFixed(3), // Ensure it's still a number
      }));

      setFilteredData(RegularByWtListFiltered);
    } else {
      const formattedList = ArtisanWiseWtList.map((item) => ({
        ...item,
        totwt: item.totwt.toFixed(3), // Format all data if no filter is applied
      }));

      setFilteredData(formattedList);
    }
  };


  // useEffects
  useEffect(() => {
    fetchArtisanMaster();
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    fetchArtisanWiseWt({ today:today, ...user }); // Add other fields as required
  }, [user]);

  useEffect(() => {
    filterCustomerData();
  }, [ArtisanWiseWtList, params.ArtisanID]);

    const handleViewClick = (index) => {
    setParams((prev) => ({ ...prev, viewIndex: index }));
      setParams({ ...params, showModal: true });
    const  today=moment().format("YYYY-MM-DD");
    fetchArtisanWiseOrderedItemwt({ Karigr: filteredData[index]?.ID, today });
  };
  const handleClose = () => {
  setParams({...params, showModal:false});
};
  return (
    <Container fluid style={{ width: "100%", padding: 0 }}>
      <Row style={{ marginTop: "60px", marginLeft: "3px", width: "98%" }}>
        {/* Header Section */}
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="d-flex justify-content-between align-items-center">
            <h5>Artisan Wise Regular Order Report</h5>
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
              Karigar Code:
            </label>
            <div style={{ width: "auto", zIndex: "100" }}>
              <SearchableDropDown2
                options={SelectArtisanList}
                handleChange={OnChangeHandler}
                label="ArtisanID"
                selectedVal={params.ArtisanID} // Pass the selected artisan
                placeholder="Select Karigar"
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
              ActionId={params?.ActionID}
              ChangeHandler={OnChangeHandler}
              onSorting={SortingFunc}
              Col={Col1}
              handleprint={handleprint}
              isView={true}
              handleViewClick={handleViewClick}
            />
            <ReusableModal
              show={params?.showModal}
              handleClose={handleClose}
              body={
                <>
                  <Table tab={ArtwtItem} Col={Col2} />
                </>
              }
              Title={"Items"}
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

export default ArtisanWiseWt;

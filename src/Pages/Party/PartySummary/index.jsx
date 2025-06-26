import React, { useEffect, useState, useMemo } from "react";
import Table from "../../../Component/Table";
import useCustOrder from "../../../store/UseCustOrder";
import useFetchAuth from "../../../store/useFetchAuth";
import usePlaceCustOrder from "../../../store/usePlaceOrderCust";
// import generateChalanPDF from "../CustOrderPrint";
import { Col, Container, Row } from "react-bootstrap";
import useFetchArtisan from "../../../store/useFetchArtisan";
import SearchableDropDown2 from "../../../Component/SearchableDropDown2";
import checkOrder from "../../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../../GlobalFunctions/SortArrayByNumber";
import usePartyOrder from "../../../store/usePartyOrder";
import useFetchCust from "../../../store/useFetchCust";
import useFetchItem from "../../../store/useFetchItem";
// import { Modal } from "bootstrap/dist/js/bootstrap.min";
import { Button,Modal } from "react-bootstrap";
import ItemDetailsModal from "../../../Component/ItemDetailsModal";
import GetReportPdf from "./GetReportPdf";
import ReusableModal from "../../../Component/Modal";
import usePartyPrint from "../../../store/usePartyOrderPrint";

function PartySummary() {
  // State variables
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
    printId: -1,
    ArtisanId: null,
    PartyId: null,
    ChoiceId: "Till Pending",
  });
  const [trigger, setTrigger] = useState(0); // A trigger state
  const [filteredData, setFilteredData] = useState([]);
  const [modalData, setModalData] = useState([]); // Modal data state
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  // Store data from Zustand
  const { user } = useFetchAuth();
  const { PartyOrder, isPartyOrderloading, PartyOrderError, fetchPartyOrder } =
    usePartyOrder();
  const { CustOrderSuccess } = usePlaceCustOrder();
  const { ArtisanList, fetchArtisanMaster } = useFetchArtisan();
  // const { fetchCustomrData, CustomerList } = useFetchCust();
  const { ItemList, fetchItemMaster } = useFetchItem();
  const {PartyPrintList,PlacePartyPrint}=usePartyPrint()

  // Column definitions for the table
  const Col1 = [
    { headername: "OrderNo", fieldname: "Orderno", type: "String" },
    { headername: "OrderDate", fieldname: "OrderDate", type: "Date" },
    { headername: "Party Code", fieldname: "PartyCode", type: "String" },
    { headername: "Karigar  Code", fieldname: "ArtisanCode", type: "String" },
    { headername: "Weight", fieldname: "totwt", type: "number" },

    // {
    //   headername: "Weight",
    //   fieldname: "wt",
    //   type: "number",
    //   render: (row) => (
    //     <i
    //       className="bi bi-eye"
    //       style={{
    //         color: "black",
    //         cursor: "pointer",
    //         fontSize: "1.2rem",
    //       }}
    //       onClick={() => handleModalOpen(row)}  // Trigger modal open when clicked
    //     ></i>
    //   ),
    // }
  ];
  // const Col2 = [
  //   { headername: "Item Code", fieldname: "itemcode", type: "String" },
  //   { headername: "Weight", fieldname: "wt", type: "number" },
  //   {
  //     headername: "Item Description",
  //     fieldname: "description",
  //     type: "String",
  //   },
  // ];
  const choice = ["Till Pending", "Done", "All"];

  const transformData = (data) => {
    //console.log(data);

    if (!data) {
      return []; // Handle error or empty case
    }
    return data;
  };

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

  /*************  ✨ Codeium Command ⭐  *************/
  /**
 * Handles the print functionality by executing the following steps:
 * 1. Calls PlacePartyPrint with the current date to place the party print order.
 * 2. Generates a report PDF using the filtered data.
/******  21240ff1-3ed3-4e70-91aa-fa25db4093c3  *******/ const handleprint =
    () => {
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
  // const SelectPartyList = useMemo(() => {
  //   if (!PartyList) return []; // Ensure ArtisanList is available
  //   //console.log(PartyList)
  //   return PartyList.map((item) => ({
  //     label: `${item?.Party}`, // Ensure CODE exists
  //     value: item?.Party, // Ensure ID exists
  //   }));
  // }, [PartyList]);
  const SelectPartyList = useMemo(() => {
    if (!PartyOrder) return []; // Ensure PartyList is available

    // Use Set to store unique parties based on the Party field
    const uniqueParties = [
      ...new Set(
        PartyOrder.map((item) => item?.Party) // Get unique Party values
      ),
    ];

    //console.log(uniqueParties); // Check unique parties

    // Return dropdown options from unique parties
    return uniqueParties.map((party) => ({
      label: party, // Label to display in dropdown
      value: party, // Value of the dropdown item
    }));
  }, [PartyOrder]);

  // Choice list for dropdown
  const SelectChoiceList = useMemo(() => {
    if (!choice) return []; // Ensure ArtisanList is available
    return choice.map((item) => ({
      label: item, // Ensure CODE exists
      value: item, // Ensure ID exists
    }));
  }, [choice]);

  const filterCustomerData = () => {
    // Transform the data first
    let transformedList = [...PartyPrintList] || [];
    //console.log(transformedList,"transformlist");
    if (params.ArtisanId) {
      transformedList = transformedList.filter(
        (customer) => customer.ArtisanCode === params.ArtisanId
      );
    }
    if (params.PartyId) {
      transformedList = transformedList.filter(
        (customer) => customer.PartyCode === params.PartyId
      );
    }
    if (params.ItemId) {
      transformedList = transformedList.filter(
        (customer) => customer.Itemcode === params.ItemId
      );
    }
    if (params.ChoiceId === "Till Pending") {
      transformedList = transformedList.filter(
        (customer) => customer.Rcv == null
      );
    } else if (params.ChoiceId === "Done") {
      transformedList = transformedList.filter(
        (customer) => customer.Rcv !== null
      );
    }
    setFilteredData(transformedList);
  };

  const ActionFunc = () => {};
  const SaveChange = () => {};

  // useEffects
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    fetchPartyOrder({ user, today });
    fetchArtisanMaster();
    fetchItemMaster(user);
    PlacePartyPrint({ today });
  }, [user]);

  // useEffect(()=>{
  //   fetchItemMaster(user)
  // },[user])

  useEffect(() => {
    filterCustomerData();
  }, [
    PartyOrder,
    PartyPrintList,
    params.ArtisanId,
    params.PartyId,
    params.ChoiceId,
  ]);

  return (
    <Container fluid style={{ width: "100%", padding: 0 }}>
      <Row style={{ marginTop: "60px", marginLeft: "3px", width: "98%" }}>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="d-flex justify-content-between align-items-center">
            <h5>Party Order summary</h5>
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
              Party Code:
            </label>
            <div style={{ width: "auto", zIndex: "90" }}>
              <SearchableDropDown2
                options={SelectPartyList}
                handleChange={OnChangeHandler}
                label="PartyId"
                selectedVal={params.PartyId} // Pass the selected artisan
                placeholder="Select party code"
              />
            </div>
          </div>
        </Col>

        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div style={{ height: "70vh" }} id="table-box">
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
            {/* <ItemDetailsModal
  show={showModal}
  onHide={handleModalClose}
  data={detailData}
  onSort={(header, type) => {
    const currentOrder = checkOrder(modalData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";
    let result;
    if (type === "String") {
      result = SortArrayByString(newOrder, modalData, header);
    } else if (type === "Date") {
      result = SortArrayByDate(newOrder, modalData, header);
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, modalData, header);
    }
    setModalData(result); // Update modal data with sorted results
  }}
/> */}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default PartySummary;
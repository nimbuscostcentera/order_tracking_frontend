import React, { useEffect, useMemo, useState } from "react";

import SortArrayByString from "../../../GlobalFunctions/SortarrayByString.js";
import SortArrayByNumber from "../../../GlobalFunctions/SortArrayByNumber.js";
import SortArrayByDate from "../../../GlobalFunctions/SortArrayByDate.js";
import checkOrder from "../../../GlobalFunctions/Ordercheck.js";

import Table from "../../../Component/Table";
import ReusableModal from "../../../Component/Modal/index.jsx";
import usePartyList from "../../../store/usePartyList.js";
import usePlacePartyOrder from "../../../store/usePartyOrderAdd.js";
import usePartyReceive from "../../../store/usePartyReceive.js";
import { toast } from "react-toastify";
import usePartyPrint from "../../../store/usePartyOrderPrint.js";
import usePartyOrder from "../../../store/usePartyOrder";

import GetPartyPdf from "./GetPartyPdf.js";
import moment from "moment";
import useFetchPurity from "../../../store/useFetchPurity.js";
import useFetchArtisan from "../../../store/useFetchArtisan.js";
import EstimateTable from "../../../Component/EstimateTable/index.jsx";
import useFetchAuth from "../../../store/useFetchAuth.js";
import useFetchArtisanwiseItem from "../../../store/useFetchArtisanwiseItem.js";
import usePartyOrderEdit from "../../../store/usePartyOrderEdit.js";
import { Form, InputGroup } from "react-bootstrap";
import "./party.css";

function OrderTable() {
  let currentday = moment();
  const [filteredData, setFilteredData] = useState([]);
  const [detailData, setdetailData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalSearchQuery, setModalSearchQuery] = useState("");

  const [originalOrder, setOriginalOrder] = useState([]);
  let itemObj = {
    wt: null,
    Itemcode: null,
    Item: null,
  };
  const [detailData2, setdetailData2] = useState([{ rowid: 1, ...itemObj }]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [EditData, setEditData] = useState([
    {
      rid: 1,
      OrderNo: null,
      Karigr: null,
      PurityId: null,
      orderid: null,
      Orderno: null,
      OrderDate: null,
    },
  ]);
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
    viewIndex: null,
    printId: -1,
    EditMode: false,
    IndexRow: -1,
  });
  const [trigger, setTrigger] = useState(0);
  const { user } = useFetchAuth();
  const { PartyOrder, PartyOrderError, isPartyOrderloading, fetchPartyOrder } =
    usePartyOrder();
  const { PartyPrintList, PlacePartyPrint } = usePartyPrint();
  const {
    PartyReceiveSuccess,
    InsertReceive,
    isPartyReceiveLoading,
    PartyReceiveError,
    ClearAddParty,
  } = usePartyReceive();
  const { PartyOrderSuccess } = usePlacePartyOrder();
  const { PartyList, fetchPartyData } = usePartyList();
  const { fetchArtisanwiseItemMaster, ArtisanwiseItemList } =
    useFetchArtisanwiseItem();
  const { PurityList, fetchPurityMaster } = useFetchPurity();
  const { ArtisanList, fetchArtisanMaster } = useFetchArtisan();

  const {
    UpdatePartyOrder,
    PartyOrderEditError,
    isPartyOrderEditLoading,
    ClearStatePartyOrderEdit,
    PartyOrderEditSuccess,
  } = usePartyOrderEdit();

  const KarigarReceiveFunc = async (ind) => {
    let res = detailData[ind];
    const today = new Date().toISOString().slice(0, 10);
    const data = {
      id_order: res?.id_order,
      rcvDate: today,
      srl: res?.srl,
    };
    await InsertReceive(data); // Update the record
    fetchPartyData({ today }); // Refetch RegularList immediately
    setShowModal(false); // Close modal after update
  };

  const Party = useMemo(() => {
    let arr = [{ Name: "--Select party code--", Value: -1 }];
    let arr1 = (PartyList || []).map((item) => ({
      Name: item?.Party,
      Value: item?.id,
    }));
    return [...arr, ...arr1];
  }, [PartyList]);

  const Purity = useMemo(() => {
    let arr = [{ Name: "--Select Purity--", Value: -1 }];
    let arr1 = PurityList.map((item) => ({
      Name: item?.PURITY,
      Value: item?.id,
    }));
    return [...arr, ...arr1];
  }, [PurityList]);

  const KarigarList = useMemo(() => {
    return ArtisanList.map((item) => ({
      label: `${item?.CODE}:${item?.NAME}`,
      value: item?.id,
    }));
  }, [ArtisanList]);
  const SelectItem = useMemo(() => {
    return ArtisanwiseItemList.map((item) => ({
      label: `${item?.ITEMCODE}:${item.DESCRIPTION}`,
      value: item?.Item,
    }));
  }, [ArtisanwiseItemList?.length]);
  const Col = [
    {
      headername: "Party code",
      fieldname: "Party",
      type: "String",
      isNotEditable: true,
    },
    {
      headername: "Purity",
      fieldname: "PURITY",
      type: "String",
      isNotEditable: true,
    },
    {
      headername: "OrderDate",
      fieldname: "OrderDate",
      type: "Date",
      isNotEditable: true,
    },
    {
      headername: "OrderNo",
      fieldname: "Orderno",
      type: "String",
      isNotEditable: true,
    },
    {
      headername: "Karigar Code",
      fieldname: "ArtisanCode",
      type: "String",
      isNotEditable: true,
    },
  ];
  const EditColMain = [
    {
      label: "Purity",
      key: "PurityId",
      type: "number",
      SelectOption: true,
      data: Purity || [],
      PlaceHolder: "Purity",
    },
    {
      label: "Karigar Code",
      key: "Karigr",
      type: "String",
      AutoSearch: true,
      SearchValue: "value",
      SearchLabel: "CODE",
      PlaceHolder: "Karigar Code",
      width: "550px",
      data: KarigarList || [],
    },
  ];

  const Col1 = [
    { headername: "Item Code", fieldname: "itemcode", type: "String" },
    { headername: "Weight", fieldname: "wt", type: "number" },
    {
      headername: "Item Description",
      fieldname: "description",
      type: "String",
    },
  ];
  const EditColDetail = [
    {
      label: "Item",
      key: "Item",
      type: "String",
      AutoSearch: true,
      data: SelectItem || [],
      SearchValue: "Item",
      SearchLabel: "Itemcode",
      PlaceHolder: "Item",
    },
    { label: "Weight", key: "wt", type: "number" },
  ];
  const handleClose = () => setShowModal(false);
  const handleViewClick = (index) => {
    setParams((prev) => ({ ...prev, viewIndex: index }));
    const data = filteredData[index]?.Detail;
    setdetailData(data);
    setShowModal(true);
  };

 const handleSearch = (e) => {
   const value = e.target.value.toLowerCase();
   setSearchQuery(value);
   // Extract valid field names from the Col array
   const validFields = Col.map((col) => col.fieldname);

   const filtered = PartyOrder.filter((order) =>
     validFields.some((field) =>
       order[field]?.toString().toLowerCase().includes(value)
     )
   );

   setFilteredData(filtered);
 };

  const ActionFunc = (tabIndex) => {
    setParams((prev) => ({ ...prev, IsAction: true, ActionID: tabIndex }));
    let obj = filteredData[tabIndex];
    setEditData((prev) => [
      {
        Karigr: obj?.Karigr,
        PurityId: obj?.PurityId,
        Orderno: obj?.Orderno,
        Id_Order: obj?.id,
        ArtisanCode: obj?.ArtisanCode,
        PURITY: obj?.PURITY,
        OrderDate: obj?.OrderDate,
      },
    ]);
    let i = 0;
    let itemdata = obj?.Detail?.map((item) => {
      i++;
      let obj = {
        rowid: i,
        wt: item?.wt,
        Itemcode: item?.itemcode,
        Item: item?.Item,
      };
      return obj;
    });
    setdetailData2(itemdata);
    console.log(itemdata);
    HandleEditModeOpen();
  };

  const applyFilter = (newFilteredData) => {
    setFilteredData(newFilteredData);
    // Store the current visible order
    setOriginalOrder(newFilteredData.map((row) => row.id));
  };
  const SortingFunc = (header, type) => {
    if (!filteredData || filteredData.length === 0) {
      return;
    }
    const currentOrder = checkOrder(filteredData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";

    let result;
    if (type === "String") {
      if (params.viewIndex != null) {
        result = SortArrayByString(
          newOrder,
          filteredData,
          header
        );
      } else {
        result = SortArrayByString(newOrder, filteredData, header);
      }
    } else if (type === "Date") {
      result = SortArrayByDate(newOrder, filteredData, header);
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    }
    setFilteredData(result);
    applyFilter(result);
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

    setdetailData(result);
  };

  const addRow = () => {
    const newRow = { rowid: detailData2.length + 1, ...itemObj };
    setdetailData2([...detailData2, newRow]);
  };

  const deleteRow = (id) => {
    let ExistingRows = detailData2.filter((row) => row.rowid !== id);
    let n = ExistingRows?.length;
    for (let i = 0; i < n; i++) {
      ExistingRows[i].rowid = i + 1;
    }
    setdetailData2(ExistingRows);
  };

  const HandleEditModeOpen = () => {
    setParams({
      ...params,
      EditMode: true,
    });
  };

  const HandleEditModeClose = () => {
    setParams({ ...params, EditMode: false });
  };

  const HandleEditChange = (rowIndex, colKey, e) => {
    let ar = [...EditData];
    let ob = ar[0];
    let value = e.target.value;
    ob[colKey] = value;
    setEditData(ar);
    if (colKey === "Karigr") {
      setdetailData2([{ rowid: 1 }]);
    }
  };
  
  const HandleEditChange2 = (rowIndex, colKey, e) => {
    let copyarray = [...detailData2];
    setParams({ ...params, IndexRow: rowIndex });
    let modifiedObj = copyarray[rowIndex];
    let value = modifiedObj[colKey];
    const regexWt = /^\d*\.?\d{0,3}$/;
    if (colKey == "wt" && regexWt.test(e.target.value)) {
      value = e.target.value;
      modifiedObj[colKey] = value;
    }
    if (colKey !== "wt") {
      value = e.target.value;
      let arrayItem = ArtisanwiseItemList?.filter((it) => it.Item == value);
      let obj = arrayItem[0];
      let { ITEMCODE } = obj;
      modifiedObj["Item"] = value;
      modifiedObj["Itemcode"] = ITEMCODE;
    }
    setdetailData2(copyarray);
  };
  const OnChangeHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    // SetParams({ ...params, [key]: value });
  };

  const SaveChange = (e) => {
    e.preventDefault();
    let object = {
      ...EditData[0],
      data: detailData2,
    };
    // //console.log(object,"Final object")
    UpdatePartyOrder(object);
    HandleEditModeClose();
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    fetchPartyData({ today }); // Add other fields as required
    fetchPartyOrder();
    PlacePartyPrint({ today });
  }, [PartyOrderSuccess, PartyReceiveSuccess, PartyOrderEditSuccess]);

  useEffect(() => {
    // if (PartyOrder?.length > 0) {
    //   setFilteredData(PartyOrder); // Properly update filteredData
    // }
    if (PartyOrder?.length > 0) {
      let updatedData = PartyOrder.map((party) => ({
        ...party,
      }));

      // Ensure the order remains the same
      if (originalOrder.length > 0) {
        updatedData = originalOrder
          .map((id) => updatedData.find((row) => row.id === id))
          .filter(Boolean);
      }

      setFilteredData(updatedData);
    }
  }, [PartyOrder, PartyReceiveSuccess, PartyOrderEditSuccess]);

  useEffect(() => {
    if (PartyReceiveSuccess) {
      const today = new Date().toISOString().split("T")[0];
      fetchPartyData({ today }); // Refetch RegularList after update
      setShowModal(false); // Close the modal after success
    }

    if (originalOrder.length > 0 && PartyOrder?.length > 0) {
      const sortedData = originalOrder
        .map((id) => PartyOrder.find((row) => row.id === id))
        .filter(Boolean);

      setFilteredData(sortedData);
    }

  }, [PartyReceiveSuccess]);

  useEffect(() => {
    if (isPartyReceiveLoading && !PartyReceiveSuccess && !PartyReceiveError) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (
      PartyReceiveSuccess &&
      !isPartyReceiveLoading &&
      !PartyReceiveError
    ) {
      toast.success("Party received Successfully", {
        position: "top-right",
        autoClose: 3000,
      });

      setParams({ ActionID: -1, IsAction: false, viewIndex: null });
    } else if (
      PartyReceiveError &&
      !isPartyReceiveLoading &&
      !PartyReceiveSuccess
    ) {
      toast.error(PartyReceiveError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearAddParty();
  }, [isPartyReceiveLoading, PartyReceiveSuccess, PartyReceiveError]);

  const handleprint = (ind) => {
    const data = filteredData[ind];
    console.log(data);
    GetPartyPdf([data]);
  };

  //console.log(detailData)

  useEffect(() => {
    if (EditData[0]?.Karigr) {
      fetchArtisanwiseItemMaster({ artisanId: EditData[0]?.Karigr });
    }
  }, [EditData[0]?.Karigr]);
  //toaster
  useEffect(() => {
    if (isPartyOrderEditLoading) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (PartyOrderEditSuccess) {
      toast.success("Order Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (
      PartyOrderEditError &&
      !isPartyOrderEditLoading &&
      !PartyOrderEditSuccess
    ) {
      toast.error(PartyOrderEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStatePartyOrderEdit();
  }, [isPartyOrderEditLoading, PartyOrderEditSuccess, PartyOrderEditError]);

  return (
    <div>
      <InputGroup className="mb-2 mt-0 search-bar" style={{ width: "40%" }}>
        <InputGroup.Text>
          <i className="bi bi-search"></i>
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className="custom-search"
          style={{ boxShadow: "none", outline: "none", borderColor: "#ccc" }}
        />
      </InputGroup>
      <div id="table-box" style={{ height: "50vh" }}>
        <Table
          tab={filteredData || []}
          isAction={params?.IsAction}
          ActionFunc={ActionFunc}
          ActionId={params?.ActionID}
          OnChangeHandler={OnChangeHandler}
          SaveChange={SaveChange}
          onSorting={SortingFunc}
          Col={Col}
          receive={"Rcv"}
          isEdit={true}
          isView={true}
          isPrint={true}
          handleprint={handleprint}
          viewPref={"Item"}
          handleViewClick={handleViewClick}
          // EditedData={editData}
        />
        <ReusableModal
          show={showModal}
          handleClose={handleClose}
          body={
            <>
              <InputGroup className="mb-3 search-bar" style={{ width: "40%" }}>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="custom-search"
                  style={{
                    boxShadow: "none",
                    outline: "none",
                    borderColor: "#ccc",
                  }}
                />
              </InputGroup>
              <Table
                tab={detailData.filter(
                  (item) =>
                    item.itemcode
                      .toLowerCase()
                      .includes(modalSearchQuery.toLowerCase()) || // Search by Item Code
                    item.description
                      .toLowerCase()
                      .includes(modalSearchQuery.toLowerCase()) || // Search by Description
                    item.wt.toString().includes(modalSearchQuery) // Search by Weight
                )}
                onSorting={SortingFuncSub}
                Col={Col1}
                isKarigarButton={true}
                isIcon={true}
                KarigarReceiveFunc={KarigarReceiveFunc}
                receive={"Rcv"}
              />
            </>
          }
          Title={"Item Details"}
          isSuccess={false}
          isPrimary={true}
          handlePrimary={handleClose} // Optional: Define your primary action
          PrimaryButtonName="Close"
        />
        <ReusableModal
          show={params?.EditMode}
          handleClose={HandleEditModeClose} // Close modal
          body={
            <div>
              <div>
                <EstimateTable
                  columns={EditColMain}
                  rows={EditData}
                  handleChange={HandleEditChange}
                  id={"rid"}
                  // SearchHandler={handleOpen}
                />
              </div>
              <div>
                <hr />
                <h6>Edit Order Items</h6>
                <hr />
              </div>
              <div>
                <EstimateTable
                  columns={EditColDetail}
                  rows={detailData2}
                  handleChange={HandleEditChange2}
                  deleteRow={deleteRow}
                  isDelete={true}
                  id={"rowid"}
                />
                <div>
                  <button
                    className="btn btn-success py-1 px-2 float-end"
                    onClick={addRow}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          }
          Title={`Edit Party: ${EditData[0]?.Orderno}`}
          isPrimary={true}
          handlePrimary={SaveChange}
          PrimaryButtonName="Save"
        />
      </div>
    </div>
  );
}

export default OrderTable;

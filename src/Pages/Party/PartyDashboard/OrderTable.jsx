import React, { useEffect, useMemo, useState } from "react";

import SortArrayByString from "../../../GlobalFunctions/SortarrayByString.js";
import SortArrayByNumber from "../../../GlobalFunctions/SortArrayByNumber.js";
import SortArrayByDate from "../../../GlobalFunctions/SortArrayByDate.js";
import checkOrder from "../../../GlobalFunctions/Ordercheck.js";

import Table from "../../../Component/Table";
import ReusableModal from "../../../Component/Modal/index.jsx";
import usePlaceRegularOrder from "../../../store/usePlaceOrderRegular.js";
import usePartyList from "../../../store/usePartyList.js";
import usePlacePartyOrder from "../../../store/usePartyOrderAdd.js";
import usePartyReceive from "../../../store/usePartyReceive.js";
import { toast } from "react-toastify";
import usePartyPrint from "../../../store/usePartyOrderPrint.js";
import usePartyOrder from "../../../store/usePartyOrder";
// import GetReportPdf from "../PartyReport/GetReportPdf.js";
import GetPartyPdf from "./GetPartyPdf.js";
import moment from "moment";
import useFetchPurity from "../../../store/useFetchPurity.js";
import useFetchArtisan from "../../../store/useFetchArtisan.js";
import EstimateTable from "../../../Component/EstimateTable/index.jsx";
import useFetchAuth from "../../../store/useFetchAuth.js";
import useFetchArtisanwiseItem from "../../../store/useFetchArtisanwiseItem.js";
import usePartyOrderEdit from "../../../store/usePartyOrderEdit.js";
// import { partyordershow } from "../../../../../tracking-software/src/v1/Controller/Report.Controller.js";

function OrderTable() {
  let currentday = moment();
  const [filteredData, setFilteredData] = useState([]);
  const [detailData, setdetailData] = useState([]);
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
      headername: "Karigor Code",
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
      label: "Karigor Code",
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
    setdetailData2((prev) => itemdata);
    HandleEditModeOpen();
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
          filteredData[params.viewIndex].Detail,
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
// console.log(EditData,"Edited data")
// console.log(detailData2,"Detailed  data")
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
    setdetailData2((prev) => copyarray);
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
    // console.log(object,"Final object")
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
    if (PartyOrder?.length > 0) {
      setFilteredData(PartyOrder); // Properly update filteredData
    }
  }, [PartyOrder, PartyReceiveSuccess, PartyOrderEditSuccess]);

  useEffect(() => {
    if (PartyReceiveSuccess) {
      const today = new Date().toISOString().split("T")[0];
      fetchPartyData({ today }); // Refetch RegularList after update
      setShowModal(false); // Close the modal after success
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
    // console.log(data,"data")
    const dataByFilter = PartyOrder.filter((party) => {
      return party?.Orderno === data?.Orderno;
    });
  //  console.log(dataByFilter,"databyfilter")
    const totalwt = dataByFilter[0]?.Detail?.reduce((accum, data) => {
      return accum + data.wt;
    }, 0);
    const printData = {
      Orderno: data?.Orderno,
      OrderDate: data?.OrderDate,
      Party: data?.Party,
      Deliverydate: data?.Deliverydate,
      weight: totalwt.toFixed(3),
    };
    GetPartyPdf(printData);
  };

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
    <div style={{ width: "auto", overflow: "auto", height: "50vh" }}>
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
            <Table
              tab={detailData}
              onSorting={SortingFunc}
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
  );
}

export default OrderTable;

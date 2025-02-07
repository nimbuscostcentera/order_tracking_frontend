import React, { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import useRegularFetch from "../../../store/useRegularFetch.js";
import useFetchAuth from "../../../store/useFetchAuth.js";
import useFetchArtisan from "../../../store/useFetchArtisan.js";
import useFetchPurity from "../../../store/useFetchPurity.js";
import useFetchArtisanwiseItem from "../../../store/useFetchArtisanwiseItem.js";
import useUpdateRegularRcv from "../../../store/useUpdateRegularRcv.js";
import useRegularOrderSummary from "../../../store/useRegularOrderSummary";

import SortArrayByString from "../../../GlobalFunctions/SortarrayByString.js";
import SortArrayByNumber from "../../../GlobalFunctions/SortArrayByNumber.js";
import SortArrayByDate from "../../../GlobalFunctions/SortArrayByDate.js";
import checkOrder from "../../../GlobalFunctions/Ordercheck.js";

import GetReportPdf from "../OrderSummary/getReportPdf.js";
import ReusableModal from "../../../Component/Modal/index.jsx";
import EstimateTable from "../../../Component/EstimateTable/index.jsx";
import Table from "../../../Component/Table";
import useRegularOrderEdit from "../../../store/useRegularOrderEdit.js";
import usePlaceRegularOrder from "../../../store/usePlaceOrderRegular.js";

function OrderTable() {
  const [filteredData, setFilteredData] = useState([]);
  const [detailData, setdetailData] = useState([]);
  let itemObj = {
    wt: null,
    Itemcode: null,
    Item: null,
    DESCRIPTION:null
  };
  const [detailData2, setdetailData2] = useState([{ rowid: 1, ...itemObj }]);
  const [showModal, setShowModal] = useState(false);
  const [EditData, setEditData] = useState([
    {
      rid: 1,
      OrderNo: null,
      Karigr: null,
      PurityId: null,
      orderid: null,
      Orderno: null,
      Id_Order: null,
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

  //user data
  const { user } = useFetchAuth();
  //artisan
  const { ArtisanList, fetchArtisanMaster } = useFetchArtisan();
  //purity
  const { PurityList, fetchPurityMaster } = useFetchPurity();
  //artisan wise item
  const { fetchArtisanwiseItemMaster, ArtisanwiseItemList } =
    useFetchArtisanwiseItem();
  //fetch Regular data
  const { RegularError, isRegularloading, fetchRegularMaster, RegularList } =
    useRegularFetch();
  //Rcv status update
  const {
    UpdateRegularRcvError,
    isUpdateRegularRcvloading,
    clearStateRegularRcv,
    UpdateRegularRcvSuccess,
    UpdateRegularRcv,
  } = useUpdateRegularRcv();
  //Print Receipt
  const {
    RegularOrderSummaryError,
    isRegularOrderSummaryLoading,
    ClearSummeryRegularOrder,
    FetchRegularOrderSummary,
    RegularOrderSummaryList,
  } = useRegularOrderSummary();

  const {
    UpdateRegularOrder,
    RegularOrderEditError,
    isRegularOrderEditLoading,
    ClearStateRegularOrderEdit,
    RegularOrderEditSuccess,
  } = useRegularOrderEdit();

  const { RegularOrderSuccess } = usePlaceRegularOrder();
  //data load to memo
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
      headername: "OrderDate",
      fieldname: "OrderDate",
      type: "Date",
      isNotEditable: true,
    },
    {
      headername: "OrderNo",
      fieldname: "Orderno",
      type: "String",
      isNotEditable: false,
    },
    { headername: "Karigor Code", fieldname: "ArtisanCode", type: "String" },
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
    { headername: "Item Code", fieldname: "Itemcode", type: "String" },
    { headername: "Weight", fieldname: "wt", type: "number" },
    {
      headername: "Item Description",
      fieldname: "DESCRIPTION",
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
  //All functions
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
        orderid: obj?.id,
        ArtisanCode: obj?.ArtisanCode,
        PURITY: obj?.PURITY,
        Id_Order: obj?.id,
      },
    ]);
    let i = 0;
    let itemdata = obj?.Detail?.map((item) => {
      i++;
      let obj = {
        rowid: i,
        wt: item?.wt,
        Itemcode: item?.Itemcode,
        Item: item?.Item,
        DESCRIPTION:item?.DESCRIPTION
      };
      return obj;
    });
    setdetailData2(itemdata);
    HandleEditModeOpen();
  };
  const KarigarReceiveFunc = async (tabIndex) => {
    const data = detailData[tabIndex];
    const today = new Date().toISOString().split("T")[0];
    data.RcvDt = today;
    await UpdateRegularRcv(data); // Update the record
    fetchRegularMaster({ today }); // Refetch RegularList immediately
    setShowModal(false); // Close modal after update
  };
  //For sorting
  const SortingFunc = (header, type) => {
    if (!filteredData || filteredData.length === 0) {
      // console.error("No data to sort");
      return;
    }
    const currentOrder = checkOrder(filteredData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";

    let result;
    if (type === "String") {
      console.log("In string");
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
  const handleprint = (index) => {
    setParams((prev) => ({ ...prev, printId: index }));
    setTrigger((prev) => prev + 1);
  };
  //modal open edit
  const HandleEditModeOpen = () => {
    setParams({
      ...params,
      EditMode: true,
    });
  };
  //handle close Edit mode
  const HandleEditModeClose = () => {
    setParams({ ...params, EditMode: false });
  };
  //HandleEditChange
  const HandleEditChange = (rowIndex, colKey, e) => {
    let ar = [...EditData];
    let ob = ar[0];
    let value = e.target.value;
    if (colKey === "Karigr") {
      setdetailData2([{ rowid: 1, ...itemObj }]);
    }
    ob[colKey] = value;
    setEditData(ar);
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
      console.log(obj);
      let { ITEMCODE } = obj;
      modifiedObj["Item"] = value;
      modifiedObj["Itemcode"] = ITEMCODE;
      // modifiedObj["DESCRIPTION"]=DESCRIPTION
    }
    setdetailData2((prev) => copyarray);
  };
  const SaveChange = (e) => {
    e.preventDefault();
    let object = {
      ...EditData[0],
      data: detailData2,
    };
    UpdateRegularOrder(object);
    HandleEditModeClose();
  };
  //useEffects rcv toaster
  useEffect(() => {
    if (
      isUpdateRegularRcvloading &&
      !UpdateRegularRcvSuccess &&
      !UpdateRegularRcvError
    ) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (
      UpdateRegularRcvSuccess &&
      !isUpdateRegularRcvloading &&
      !UpdateRegularRcvError
    ) {
      toast.success(UpdateRegularRcvSuccess, {
        position: "top-right",
        autoClose: 3000,
      });
      setParams({ ActionID: -1, IsAction: false });

      clearStateRegularRcv();
    } else if (
      UpdateRegularRcvError &&
      !isUpdateRegularRcvloading &&
      !UpdateRegularRcvSuccess
    ) {
      toast.error(UpdateRegularRcvError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [
    isUpdateRegularRcvloading,
    UpdateRegularRcvSuccess,
    UpdateRegularRcvError,
  ]);
  //api call to rcv
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    fetchRegularMaster({ today }); // Add other fields as required
  }, [UpdateRegularRcvSuccess, RegularOrderEditSuccess, RegularOrderSuccess]);
  //set regulardata in filterdata
  useEffect(() => {
    if (RegularList?.length > 0) {
      setFilteredData(RegularList); // Properly update filteredData
    }
  }, [
    RegularList,
    UpdateRegularRcvSuccess,
    RegularOrderEditSuccess,
    RegularOrderSuccess,
  ]);
  //to close and update modal after update rcv status
  useEffect(() => {
    if (UpdateRegularRcvSuccess) {
      const today = new Date().toISOString().split("T")[0];
      fetchRegularMaster({ today }); // Refetch RegularList after update
      setShowModal(false); // Close the modal after success
    }
  }, [UpdateRegularRcvSuccess]);
  //to trigger print option
  useEffect(() => {
    if (params.printId !== -1) {
      // console.log(filteredData[params.printId]?.Orderno);
      FetchRegularOrderSummary({
        Orderno: filteredData[params.printId]?.Orderno,
      });
    }
  }, [trigger]);
  //to print receipt
  useEffect(() => {
    if (params.printId !== -1) {
      GetReportPdf(filteredData[params.printId]);
      ClearSummeryRegularOrder();
    }
  }, [RegularOrderSummaryList]);
  useEffect(() => {
    fetchPurityMaster(user);
  }, []);
  useEffect(() => {
    if (EditData[0]?.Karigr) {
      fetchArtisanwiseItemMaster({ artisanId: EditData[0]?.Karigr });
    }
  }, [EditData[0]?.Karigr]);
  useEffect(() => {
    console.log(RegularOrderEditSuccess, RegularOrderEditError);

    if (isRegularOrderEditLoading) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (RegularOrderEditSuccess) {
      toast.success("Order Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (
      RegularOrderEditError &&
      !isRegularOrderEditLoading &&
      !RegularOrderEditSuccess
    ) {
      toast.error(RegularOrderEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateRegularOrderEdit();
  }, [
    isRegularOrderEditLoading,
    RegularOrderEditSuccess,
    RegularOrderEditError,
  ]);
  return (
    <div style={{ width: "auto", overflow: "auto", height: "50vh" }}>
      <ToastContainer />
      <Table
        tab={filteredData || []}
        isAction={params?.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params?.ActionID}
        ChangeHandler={() => {}}
        SaveChange={SaveChange}
        onSorting={SortingFunc}
        Col={Col}
        isEdit={true}
        isView={true}
        viewPref={"Item"}
        handleViewClick={handleViewClick}
        isPrint={true}
        handleprint={handleprint}
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
        handleClose={HandleEditModeClose}
        body={
          <div>
            <div>
              <EstimateTable
                columns={EditColMain}
                rows={EditData}
                handleChange={HandleEditChange}
                id={"rid"}
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
        Title={`Edit Regular: ${EditData[0]?.Orderno}`}
        isSuccess={false}
        isPrimary={true}
        handlePrimary={SaveChange} // Optional: Define your primary action
        PrimaryButtonName="save"
      />
    </div>
  );
}

export default OrderTable;

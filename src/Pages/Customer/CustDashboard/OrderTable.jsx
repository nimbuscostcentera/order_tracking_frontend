import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Table from "../../../Component/Table";
import "./Customer.css";

import generateChalanPDF from "../CustOrderPrint";
import checkOrder from "../../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../../GlobalFunctions/SortArrayByNumber";

import useCustOrder from "../../../store/UseCustOrder";
import userFetchAuth from "../../../store/useFetchAuth";
import useFetchAuth from "../../../store/useFetchAuth";
import usePlaceCustOrder from "../../../store/usePlaceOrderCust";
import useKarigarReceive from "../../../store/useKarigarReceive";
import useSampleDelivery from "../../../store/useSampleDelivery";
import useCustOrderDespatch from "../../../store/useCustOrderDespatch";
import useFetchCust from "../../../store/useFetchCust";
import useFetchArtisan from "../../../store/useFetchArtisan";
import useEditCustomerOrder from "../../../store/useEditCustomerOrder";
import { Form, InputGroup } from "react-bootstrap";

function OrderTable({ setIsDisable }) {
  const currentDate = moment().format("YYYY-MM-DD");
  const [filteredData, setFilteredData] = useState([]);
  const [trigger, setTrigger] = useState(0); // A trigger state
  const [iconVis, SetIconVis] = useState(true);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
    printId: -1,
    isIconVis: true,
  });
  const [editedData, setEditedData] = useState({
    Id_Order: null,
    id_customer: null,
    OrderDate: null,
    Desc: null,
    Wt: null,
    SampleRcpVou: null,
    Karigarwt: null,
    Karigar: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = userFetchAuth();
  const { CustomerDashList, loading, error, fetchCustDash } = useCustOrder();
  const { CustomerList, fetchCustomrData, isCustLoading } = useFetchCust();
  const { CustOrderSuccess } = usePlaceCustOrder();
  const { ArtisanList, fetchArtisanMaster } = useFetchArtisan();
  const {
    UpdateKarigarReceive,
    kReceiveError,
    iskReceiveLoading,
    kReceiveSuccess,
    ClearKarigarReceive,
  } = useKarigarReceive();
  const {
    UpdateCustSampleDelivered,
    CustSampleDeliverError,
    isCustSampleDeliverLoading,
    CustSampleDeliverSuccess,
    ClearCustSampleDelivered,
  } = useSampleDelivery();
  const {
    clearCustOrderDespatch,
    CustOrderDespatchError,
    isCustOrderDespatchLoading,
    CustOrderDespatchSuccess,
    CustOrderDespatchUpdate,
  } = useCustOrderDespatch();
  const {
    CustOrderEditError,
    isCustOrderEditLoading,
    CustOrderEditSuccess,
    EditCustOrderFunc,
    ClearStateEditCustOrder,
  } = useEditCustomerOrder();

  const Customer = useMemo(() => {
    let arr = CustomerList.map((item) => ({
      label: `${item?.CUSTCode}:${item?.NAME}`,
      value: item?.id,
    }));
    return arr;
  }, [CustomerList]);
  const Artisan = useMemo(() => {
    let arr = ArtisanList.map((item) => ({
      label: `${item?.CODE}`,
      value: item?.id,
    }));
    return arr;
  }, [ArtisanList]);

  const Col = [
    {
      headername: "Order No",
      fieldname: "Orderno",
      type: "String",
      isNotEditable: true,
      width: "100px",
    },
    {
      headername: "Customer RefNo.",
      fieldname: "SampleRcpVou",
      type: "String",
      selectionname: "SampleRcpVou",
      isSelection: false,
      width: "130px",
      isShortingOff: true,
    },
    {
      headername: "Customer",
      fieldname: "NAME",
      type: "String",
      selectionname: "id_customer",
      isSelection: true,
      options: Customer,
      width: "180px",
    },
    {
      headername: "Order Date",
      fieldname: "OrderDate",
      type: "Date",
      width: "100px",
      isNotEditable: true,
    },
    // {
    //   headername: "Delivery Date",
    //   fieldname: "DeliveryDate",
    //   type: "Date",
    //   width: "110px",
    //   isNotEditable: true,
    // },
    // {
    //   headername: "Order No",
    //   fieldname: "Orderno",
    //   type: "String",
    //   isNotEditable: true,
    // },
    {
      headername: "Image",
      fieldname: "Img",
      type: "String",
      width: "65px",
      isNotEditable: true,
      isShortingOff: true,
    },
    {
      headername: "Description",
      fieldname: "Desc",
      type: "String",
      selectionname: "Desc",
      isSelection: false,
      width: "180px",
      isShortingOff: true,
    },
    {
      headername: "Weight",
      fieldname: "Wt",
      type: "number",
      width: "70px",
      selectionname: "Wt",
      isSelection: false,
    },
    {
      headername: "Karigar Code",
      fieldname: "Artisan",
      type: "String",
      width: "130px",
      selectionname: "Karigar",
      isSelection: true,
      options: Artisan,
      width: "120px",
    },
  ];

  // //console.log(Customer);
const handleSearch = (e) => {
  const value = e.target.value.toLowerCase();
  setSearchQuery(value);

  // Extract valid field names from the Col array
  const validFields = Col.map((col) => col.fieldname);

  const filtered = CustomerDashList.filter((order) =>
    validFields.some((field) =>
      order[field]?.toString().toLowerCase().includes(value)
    )
  );

  setFilteredData(filtered);
  };
  
  const applyFilter = (newFilteredData) => {
    setFilteredData(newFilteredData);
    // Store the current visible order
    setOriginalOrder(newFilteredData.map((row) => row.id));
  };
  const SortingFunc = (header, type) => {
    //console.log(header, type, "sorttable");
    const currentOrder = checkOrder(filteredData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";
    let result;
    if (type === "String") {
      result = SortArrayByString(newOrder, filteredData, header);
      //console.log(result, "result");
    } else if (type === "Date") {
      // //console.log(type)
      result = SortArrayByDate(newOrder, filteredData, header);
      //console.log(result, "result date");
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    }
    setFilteredData(result);
    applyFilter(result);
  };

  const OnChangeHandler = (index, e) => {
    let key = e.target.name;
    let value = e.target.value;
    //console.log(key, value);

    setEditedData({ ...editedData, [key]: value });
  };

  const handleprint = (index) => {
    setParams((prev) => ({ ...prev, printId: index }));
    setTrigger((prev) => prev + 1);
    //  //console.log(filteredData[params.printId]);
  };

  const KarigarReceiveFunc = (index) => {
    setIsDisable(false);
    let fd = filteredData[index];
    let karigarReceive = {
      RcvDt: currentDate,
      id_order: fd?.id,
      OrderNo: fd?.Orderno,
    };
    UpdateKarigarReceive({ ...karigarReceive, ...user });
    setParams({
      ActionID: -1,
      IsAction: false,
      printId: -1,
    });
    setEditedData({
      Id_Order: null,
      id_customer: null,
      OrderDate: null,
      Desc: null,
      Wt: null,
      SampleRcpVou: null,
      Karigarwt: null,
      Karigar: null,
    });
  };
  const DespatchFunc = (index) => {
    setIsDisable(false);
    let fd = filteredData[index];
    let despatch = {
      despatchdate: currentDate,
      id_order: fd?.id,
      OrderNo: fd?.Orderno,
    };
    CustOrderDespatchUpdate({ ...despatch, ...user });
    setParams({
      ActionID: -1,
      IsAction: false,
      printId: -1,
    });
    setEditedData({
      Id_Order: null,
      id_customer: null,
      OrderDate: null,
      Desc: null,
      Wt: null,
      SampleRcpVou: null,
      Karigarwt: null,
      Karigar: null,
    });
  };
  const DeliveryFunc = (index) => {
    setIsDisable(false);
    let fd = filteredData[index];
    let receive = {
      SampledelvDt: currentDate,
      id_order: fd?.id,
      OrderNo: fd?.Orderno,
    };
    UpdateCustSampleDelivered({ ...receive, ...user });
    setParams({
      ActionID: -1,
      IsAction: false,
      printId: -1,
    });
    setEditedData({
      Id_Order: null,
      id_customer: null,
      OrderDate: null,
      Desc: null,
      Wt: null,
      SampleRcpVou: null,
      Karigarwt: null,
      Karigar: null,
    });
  };

  const SaveChange = (index) => {
    // //console.log(editedData);
    EditCustOrderFunc(editedData);
    SetIconVis(true);
    setParams({ ActionID: -1, IsAction: false, printId: -1, isIconVis: true });
    setIsDisable(false);
  };
  useEffect(() => {
    if (
      isCustOrderEditLoading &&
      !CustOrderEditSuccess &&
      !CustOrderEditError
    ) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (
      CustOrderEditSuccess &&
      !isCustOrderEditLoading &&
      !CustOrderEditError
    ) {
      toast.success(CustOrderEditSuccess, {
        position: "top-right",
        autoClose: 3000,
      });
      setEditedData({
        Id_Order: null,
        id_customer: null,
        OrderDate: null,
        Desc: null,
        Wt: null,
        SampleRcpVou: null,
        Karigarwt: null,
        Karigar: null,
      });
    } else if (
      CustOrderEditError &&
      !isCustOrderEditLoading &&
      !CustOrderEditSuccess
    ) {
      toast.error(CustOrderEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setParams({ ActionID: -1, IsAction: false, printId: -1 });
    setIsDisable(false);
    ClearStateEditCustOrder();
  }, [isCustOrderEditLoading, CustOrderEditSuccess, CustOrderEditError]);
  const ActionFunc = (tabindex) => {
    SetIconVis(false);
    if (
      filteredData[tabindex]?.Sampledelv !== null &&
      filteredData[tabindex]?.Despatch !== null &&
      filteredData[tabindex]?.Karigarrcv !== null
    ) {
      toast.warning("Item already delivered", {
        position: "top-right",
        autoClose: 3000,
      });
      SetIconVis(true);
    } else {
      setParams((prev) => ({
        ...prev,
        IsAction: true,
        ActionID: tabindex,
        // isIconVis:false
      }));
      setIsDisable(true);
      setEditedData({
        Id_Order: filteredData[tabindex]?.id || null,
        id_customer: filteredData[tabindex]?.id_customer || null,
        OrderDate: filteredData[tabindex]?.OrderDate || null,
        Desc: filteredData[tabindex]?.Desc || null,
        Wt: filteredData[tabindex]?.Wt || null,
        SampleRcpVou: filteredData[tabindex]?.SampleRcpVou || null,
        Karigarwt: filteredData[tabindex]?.Karigarwt || null,
        Karigar: filteredData[tabindex]?.Karigar || null,
      });
    }
  };

  useEffect(() => {
    if (params.printId !== -1) {
      console.log(filteredData[params.printId]);
      generateChalanPDF([filteredData[params.printId]]);
    }
  }, [trigger]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    console.log(today);
    fetchCustDash({ Rcv: 1, today: today });
    
     if (originalOrder.length > 0 && CustomerDashList?.length > 0) {
       const sortedData = originalOrder
         .map((id) => CustomerDashList.find((row) => row.id === id))
         .filter(Boolean);

       setFilteredData(sortedData);
     }
  }, [
    CustOrderSuccess,
    kReceiveSuccess,
    CustSampleDeliverSuccess,
    CustOrderDespatchSuccess,
    CustOrderEditSuccess,
  ]);

  useEffect(() => {
    setFilteredData(CustomerDashList);
    if (CustomerDashList?.length > 0) {
      let updatedData = CustomerDashList.map((party) => ({
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
  }, [CustomerDashList, user, fetchCustDash, CustOrderEditSuccess]);

  //Receive update toaster
  useEffect(() => {
    if (kReceiveSuccess) {
      toast.dismiss();
      toast.success(kReceiveSuccess, {
        autoClose: 3000,
        position: "top-right",
      });
    }
    if (kReceiveError) {
      toast.dismiss();
      toast.error(kReceiveError, { autoClose: 3000, position: "top-right" });
    }
    setParams({ ActionID: -1, IsAction: false, printId: -1 });
    setIsDisable(false);
    ClearKarigarReceive();
  }, [kReceiveError, kReceiveSuccess]);
  //Sample delivery
  useEffect(() => {
    if (CustSampleDeliverSuccess) {
      toast.dismiss();
      toast.success(CustSampleDeliverSuccess, {
        autoClose: 3000,
        position: "top-right",
      });
    }
    if (CustSampleDeliverError) {
      toast.dismiss();
      toast.error(CustSampleDeliverError, {
        autoClose: 3000,
        position: "top-right",
      });
    }
    setParams({ ActionID: -1, IsAction: false, printId: -1 });
    setIsDisable(false);
    ClearCustSampleDelivered();
  }, [CustSampleDeliverError, CustSampleDeliverSuccess]);
  //Order Despatch
  useEffect(() => {
    if (CustOrderDespatchSuccess) {
      toast.dismiss();
      toast.success(CustOrderDespatchSuccess, {
        autoClose: 3000,
        position: "top-right",
      });
    }
    if (CustOrderDespatchError) {
      toast.dismiss();
      toast.error(CustOrderDespatchError, {
        autoClose: 3000,
        position: "top-right",
      });
    }
    setParams({ ActionID: -1, IsAction: false, printId: -1 });
    setIsDisable(false);
    clearCustOrderDespatch();
  }, [CustOrderDespatchError, CustOrderDespatchSuccess]);

  return (
    <div>
      <InputGroup className="mb-2 search-bar" style={{ width: "40%" }}>
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
          params={params}
          setParams={setParams}
          isAction={params?.IsAction}
          isIcon={iconVis}
          ActionFunc={ActionFunc}
          ActionId={params?.ActionID}
          OnChangeHandler={OnChangeHandler}
          OnSaveHandler={SaveChange}
          onSorting={SortingFunc}
          Col={Col}
          isEdit={true}
          EditedData={editedData}
          isDespatchButton={true}
          despatch={"Despatch"}
          isKarigarButton={true}
          receive={"Karigarrcv"}
          isDeliveryButton={true}
          delivery={"Sampledelv"}
          isPrint={true}
          handleprint={handleprint}
          DeliveryFunc={DeliveryFunc}
          DespatchFunc={DespatchFunc}
          KarigarReceiveFunc={KarigarReceiveFunc}
          isCheckButton={true}
          isCheckedField={"isChecked"}
        />
      </div>
    </div>
  );
}

export default OrderTable;

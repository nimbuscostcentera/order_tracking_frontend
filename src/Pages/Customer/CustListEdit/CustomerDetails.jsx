import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "../../../Component/Table";
import useFetchAuth from "../../../store/useFetchAuth";
import useFetchCust from "../../../store/useFetchCust";
import useFetchCity from "../../../store/useFetchCity";
import useFetchState from "../../../store/useFetchState";
import useEditCustomer from "../../../store/useEditCustomer";
import useRegCustomer from "../../../store/useRegCustomer";
import SortArrayByDate from "../../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../../GlobalFunctions/SortArrayByNumber";
import SortArrayByString from "../../../GlobalFunctions/SortarrayByString";
import checkOrder from "../../../GlobalFunctions/Ordercheck";
import PhnoValidation from "../../../GlobalFunctions/PhnoValidation";
import EmailValidation from "../../../GlobalFunctions/EmailValidation";
function CustomerDetils({ isDisable, setIsDisable }) {
  const { user } = useFetchAuth();
  const { CityList, isCityLoading, fetchCityMaster } = useFetchCity();
  const { StateList, isStateLoading, fetchStateMaster } = useFetchState();
  const [originalOrder, setOriginalOrder] = useState([]);
  const {
    CustEditError,
    isCustEditLoading,
    CustEditSuccess,
    EditCustFunc,
    ClearStateEditCust,
  } = useEditCustomer();
  const { CustRegSuccess } = useRegCustomer();
  useEffect(() => {
    fetchCityMaster(user);
    fetchStateMaster(user);
  }, []);

  const CityListOption = useMemo(() => {
    return CityList?.map((item) => ({
      label: `${item?.CityCode}:${item?.DESCRIPTION}`,
      value: `${item?.id}`,
    }));
  }, [CityList]);

  const [params, SetParams] = useState({
    ActionID: null,
    IsAction: false,
  });
  const [editedData, setEditedData] = useState({
    id: null,
    CUSTCode: null,
    NAME: null,
    PHONE: null,
    ADDRESS3: null,
    City: null,
  });
  const { CustomerList, fetchCustomrData, CustError, isCustLoading } =
    useFetchCust();

  useEffect(() => {
    fetchCustomrData(user);
    if (originalOrder.length > 0 && CustomerList?.length > 0) {
      const sortedData = originalOrder
        .map((id) => CustomerList.find((row) => row.id === id))
        .filter(Boolean);
      
      setFilteredData(sortedData);
    }
  }, [CustEditSuccess, user, CustRegSuccess]);

  useEffect(() => {

    // setFilteredData(CustomerList);
    if (CustomerList?.length > 0) {
      let updatedData = CustomerList.map((cust) => ({
        ...cust,
      }));
  
      // Ensure the order remains the same
      if (originalOrder.length > 0) {
        updatedData = originalOrder
          .map((id) => updatedData.find((row) => row.id === id))
          .filter(Boolean);
      }
  
      setFilteredData(updatedData);
    }
   
  }, [isCustLoading, CustomerList]);
  const [filteredData, setFilteredData] = useState(CustomerList);
  const Col = [
    {
      headername: "Customer Code",
      fieldname: "CUSTCode",
      type: "String",
      max: 16,
    },
    { headername: "Customer Name", fieldname: "NAME", type: "String", max: 50 },
    { headername: "Phone No.", fieldname: "PHONE", type: "number", max: 10 },
    { headername: "Email", fieldname: "ADDRESS3", type: "String", max: 100 },
    {
      headername: "City Name",
      fieldname: "cityname",
      selectionname: "City",
      type: "String",
      isSelection: true,
      options: CityListOption,
    },
  ];

  const ActionFunc = (tabindex) => {
    SetParams((prev) => ({ ...prev, IsAction: true, ActionID: tabindex }));
    setIsDisable(true);
    setEditedData({
      id: filteredData[tabindex]?.id,
      CUSTCode: filteredData[tabindex]?.CUSTCode,
      NAME: filteredData[tabindex]?.NAME,
      PHONE: filteredData[tabindex]?.PHONE,
      ADDRESS3: filteredData[tabindex]?.ADDRESS3,
      City: filteredData[tabindex]?.City,
    });
  };
  // //console.log(editedData,"Edit data");
  // //console.log(filteredData,"Filtered data");
  // //console.log(CityList, "City Liost data");

  const applyFilter = (newFilteredData) => {
    setFilteredData(newFilteredData);
    // Store the current visible order
    setOriginalOrder(newFilteredData.map((row) => row.id));
  };
  const SortingFunc = (header, type) => {
    // //console.log(header, type, "sorttable");
    const currentOrder = checkOrder(filteredData, header);
    // //console.log(currentOrder)
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
    applyFilter(result)
  };

  const OnChangeHandler = (index, e) => {
    let key = e.target.name;
    let value = e.target.value;
    // //console.log(key,value);

    setEditedData({ ...editedData, [key]: value });
  };
  const SaveChange = () => {
    // //console.log(editedData);
    if (!/^\d{10}$/.test(editedData.PHONE)) {
      toast.error("Phone number must be exactly 10 digits!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!PhnoValidation(editedData.PHONE)) {
      toast.error("Invalid Phone Number!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!EmailValidation(editedData.ADDRESS3)) {
      toast.error("Invalid Email ID!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    EditCustFunc(editedData);
  };
  //toaster
  useEffect(() => {
    if (isCustEditLoading && !CustEditSuccess && !CustEditError) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (CustEditSuccess && !isCustEditLoading && !CustEditError) {
      toast.success("Customer Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setEditedData({
        id: null,
        CUSTCode: null,
        NAME: null,
        PHONE: null,
        ADDRESS3: null,
        City: null,
      });

      SetParams({ ActionID: null, IsAction: null });

      setIsDisable(false);
    } else if (CustEditError && !isCustEditLoading && !CustEditSuccess) {
      toast.error(CustEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditCust();
  }, [isCustEditLoading, CustEditSuccess, CustEditError]);

  return (
    <div id="table-box" style={{ height: "50vh" }}>
      {!isCustLoading &&
      Array.isArray(CustomerList) &&
      CustomerList.length > 0 ? (
        <Table
          tab={filteredData || []}
          isAction={params?.IsAction}
          ActionFunc={ActionFunc}
          ActionId={params?.ActionID}
          OnChangeHandler={OnChangeHandler}
          OnSaveHandler={SaveChange}
          onSorting={SortingFunc}
          Col={Col}
          isEdit={true}
          EditedData={editedData}
        />
      ) : (
        "Loading...."
      )}
    </div>
  );
}

export default CustomerDetils;

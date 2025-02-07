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
function CustomerDetils({isDisable,setIsDisable}) {

    const { user } = useFetchAuth();
    const { CityList , isCityLoading, fetchCityMaster } = useFetchCity();
  const { StateList , isStateLoading, fetchStateMaster } = useFetchState();
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

    const StateListOption = useMemo(() => {
      return StateList?.map((item) => ({
        label: `${item?.StateCode}:${item?.DESCRIPTION}`,
        value: `${item?.id}`,
      }));
    }, [isStateLoading]);
  
  const [params, SetParams] = useState({
    ActionID: null,
    IsAction: false,
  });
  const [editedData, setEditedData] = useState({
    id:null,
    CUSTCode: null,
    NAME: null,
    PHONE: null,
    ADDRESS1: null,
    ADDRESS2: null,
    ADDRESS3: null,
    City: null,
    State: null,
  });
  const {
    CustomerList,
    fetchCustomrData,
    CustError,
    isCustLoading,
  } = useFetchCust();

  
  useEffect(() => {
    fetchCustomrData(user);
  }, [CustEditSuccess, user, CustRegSuccess]);

  useEffect(() => {
    setFilteredData(CustomerList);
  },[isCustLoading,CustomerList])
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
    { headername: "Address1", fieldname: "ADDRESS1", type: "String", max: 100 },
    { headername: "Address2", fieldname: "ADDRESS2", type: "String", max: 100 },
    { headername: "Address3", fieldname: "ADDRESS3", type: "String", max: 100 },
    {
      headername: "State Code",
      fieldname: "StateCode",
      selectionname: "State",
      type: "String",
      isSelection: true,
      options: StateListOption,
    },
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
    setIsDisable(true)
    setEditedData({
      id: filteredData[tabindex]?.id,
      CUSTCode: filteredData[tabindex]?.CUSTCode,
      NAME: filteredData[tabindex]?.NAME,
      PHONE: filteredData[tabindex]?.PHONE,
      ADDRESS1: filteredData[tabindex]?.ADDRESS1,
      ADDRESS2: filteredData[tabindex]?.ADDRESS2,
      ADDRESS3: filteredData[tabindex]?.ADDRESS3,
      City: filteredData[tabindex]?.City,
      State: filteredData[tabindex]?.State,
    });
  };
// console.log(editedData,"Edit data");
// console.log(filteredData,"Filtered data");
// console.log(CityList, "City Liost data");
  const SortingFunc = (header, type) => {
    // console.log(header, type, "sorttable");
    const currentOrder = checkOrder(filteredData, header);
    // console.log(currentOrder)
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";
    let result;
    if (type === "String") {
      result = SortArrayByString(newOrder, filteredData, header);
      console.log(result, "result");
    } else if (type === "Date") {
      // console.log(type)
      result = SortArrayByDate(newOrder, filteredData, header);
      console.log(result, "result date");
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    }
    setFilteredData(result);
  };
  
  const OnChangeHandler = (index,e) => {
    let key = e.target.name;
    let value = e.target.value;
    // console.log(key,value);
    
    setEditedData({ ...editedData, [key]: value });
  };
  const SaveChange = () => { 
    // console.log(editedData);
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
          ADDRESS1: null,
          ADDRESS2: null,
          ADDRESS3: null,
          City: null,
          State: null,
        });

        SetParams({ ActionID: null, IsAction: null });

        setIsDisable(false)
      } else if (CustEditError && !isCustEditLoading && !CustEditSuccess) {
        toast.error(CustEditError, {
          position: "top-right",
          autoClose: 3000,
        });
      }
       ClearStateEditCust();
    }, [isCustEditLoading, CustEditSuccess, CustEditError]);
 
  return (
    <div style={{ width: "auto", overflow: "auto",height:"50vh" }}>
      {!isCustLoading &&
      Array.isArray(CustomerList) &&
      CustomerList.length > 0 ? (
        <Table
          tab={filteredData||[]}
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

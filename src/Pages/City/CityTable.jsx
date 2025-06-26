import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";

import Table from "../../Component/Table";

import useFetchCity from "../../store/useFetchCity";
import useFetchAuth from "../../store/useFetchAuth";
import useAddCity from "../../store/useAddCity";
import useEditCity from "../../store/UseEditCity";


function CityTable({isDisable,setIsDisable}) {
  const { CityList , isCityLoading, fetchCityMaster } = useFetchCity();
  const {AddCitySuccess} = useAddCity();
   const[filteredData,setFilteredData]=useState([])
  const { user } = useFetchAuth();
  const [params, SetParams] = useState({
      ActionID: null,
      IsAction: false,
    });

  const {
    CityEditError,
    isCityEditLoading,
    CityEditSuccess,
    EditCityFunc,
    ClearStateEditCity,
  } = useEditCity();
  const Col = [
    { headername: "City Code", fieldname: "CityCode", type: "String" },
    { headername: "City Name", fieldname: "DESCRIPTION", type: "String" }
  ];

  const [editedData, setEditedData] = useState({
    id:null,
    CityCode:null,
    DESCRIPTION: null,
  });

  useEffect(() => {
    fetchCityMaster(user);
  }, [AddCitySuccess,user,CityEditSuccess]);

  useEffect(() => {
    setFilteredData(CityList);
  }, [CityList, user, fetchCityMaster, isCityLoading]);
 
  const ActionFunc = (tabindex) => {
    SetParams((prev) => ({ ...prev, IsAction: true, ActionID: tabindex }));
    setIsDisable(true)
    setEditedData({
      id: CityList[tabindex]?.id,
      CityCode:CityList[tabindex]?.CityCode,
      DESCRIPTION: CityList[tabindex]?.DESCRIPTION,
    });
  };
  const SortingFunc = (header, type) => {
    //console.log(header,type,"sorttable")
    const currentOrder = checkOrder(filteredData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";
    let result;
    if (type === "String") {
      result = SortArrayByString(newOrder, filteredData, header);
      //console.log(result,"result")
    } else if (type === "Date") {
      // //console.log(type)
      result = SortArrayByDate(newOrder, filteredData, header);
      //console.log(result,"result date")
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    }
    setFilteredData(result);
  };
  const OnChangeHandler = (index, e) => {
    let key = e.target.name;
    let value = e.target.value;
    //console.log(key,value);

    setEditedData({ ...editedData, [key]: value });
  };
  const SaveChange = () => {
    //console.log(editedData);
    EditCityFunc(editedData);
  };

   useEffect(() => {
     if (isCityEditLoading && !CityEditSuccess && !CityEditError) {
       toast.dismiss();
          toast.play("pleaes wait...", {
            position: "top-right",
            autoClose: 3000,
          });
     }
     if (CityEditSuccess && !isCityEditLoading && !CityEditError) {
         toast.dismiss();
          toast.success("City Edited Successfully", {
            position: "top-right",
            autoClose: 3000,
          });
          setEditedData({
            id:null,
            CityCode:null,
           DESCRIPTION: null,
          });
          SetParams({ ActionID: null, IsAction: null });
          setIsDisable(false)
     }
     if (CityEditError && !isCityEditLoading && !CityEditSuccess) {
         toast.dismiss();
          toast.error(CityEditError, {
            position: "top-right",
            autoClose: 3000,
          });
     }
     ClearStateEditCity();
      }, [isCityEditLoading, CityEditSuccess, CityEditError]);
   

  return (
    <div id="table-box" style={{ height: "50vh" }}>
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
    </div>
  );
}

export default CityTable;

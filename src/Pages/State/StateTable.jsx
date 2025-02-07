import React, { useEffect } from "react";
import Table from "../../Component/Table";
import { useState } from "react";
import useFetchAuth from "../../store/useFetchAuth";
import { ToastContainer, toast } from "react-toastify";
import useFetchState from "../../store/useFetchState";
import useAddState from "../../store/UseAddState";
import useEditState from "../../store/UseEditState";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
function StateTable({setIsDisable}) {
  const { StateList , loading, fetchStateMaster } = useFetchState();
  const {  AddStateSuccess  } = useAddState();
  const[filteredData,setFilteredData]=useState([])
  const { user } = useFetchAuth();
  const [params, SetParams] = useState({
      ActionID: null,
      IsAction: false,
    });

  const {
    StateEditError,
    isStateEditLoading,
    StateEditSuccess,
    EditStateFunc,
    ClearStateEditState,
  } = useEditState();
  const Col = [
    { headername: "StateCode", fieldname: "StateCode", type: "String" },
    { headername: "Description", fieldname: "DESCRIPTION", type: "String" }
  ];

  const [editedData, setEditedData] = useState({
      id:null,
      StateCode:null,
      DESCRIPTION: null,
    });

  useEffect(() => {
    fetchStateMaster(user);
  }, [AddStateSuccess,user,StateEditSuccess]);

  useEffect(() => {
    setFilteredData(StateList);
   }, [StateList,user,fetchStateMaster]);


  const ActionFunc = (tabindex) => {
    SetParams((prev) => ({ ...prev, IsAction: true, ActionID: tabindex }));
    setIsDisable(true)
    setEditedData({
      id: StateList[tabindex]?.id,
      StateCode:StateList[tabindex]?.StateCode,
      DESCRIPTION: StateList[tabindex]?.DESCRIPTION,
    });
  };
  const SortingFunc=(header,type)=>{
    console.log(header,type,"sorttable")
    const currentOrder = checkOrder(filteredData,header);
    const newOrder=currentOrder === "Asc" ? "Desc" : "Asc";
    let result;
    if (type === "String"
    ) {
   result=  SortArrayByString(newOrder, filteredData, header);
      console.log(result,"result") 
    } else if (type === "Date") {
      // console.log(type)
     result=SortArrayByDate(newOrder, filteredData, header);
     console.log(result,"result date")
   
    } else if(type === "number") {
       result=SortArrayByNumber(newOrder, filteredData, header);
       
    }
    setFilteredData(result)
  };
  const OnChangeHandler = (index,e) => {
    let key = e.target.name;
    let value = e.target.value;
    console.log(key,value);
    
    setEditedData({ ...editedData, [key]: value });
  };
  const SaveChange = () => { 
    console.log(editedData);
    EditStateFunc(editedData);
  };

   useEffect(() => {
    if (isStateEditLoading && !StateEditSuccess && !StateEditError) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (StateEditSuccess && !isStateEditLoading && !StateEditError) {
      toast.success("State Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setEditedData({
        id:null,
        StateCode:null,
        DESCRIPTION: null,
      });

    SetParams({ ActionID: null, IsAction: null });
    setIsDisable(false)
    }
    if (StateEditError && !isStateEditLoading && !StateEditSuccess) {
      toast.error(StateEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditState();
    }, [isStateEditLoading, StateEditSuccess, StateEditError]);
   

  return (
    <div
      style={{
        width: "auto",
        overflow: "auto",
        height: "55vh",
      }}
    >
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

export default StateTable;

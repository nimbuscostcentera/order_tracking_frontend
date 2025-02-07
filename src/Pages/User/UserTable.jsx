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
import useFetchUser from "../../store/useFetchUser";
import useAddUser from "../../store/useAddUser";
import useEditUser from "../../store/useEditUser";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";


function UserTable({setIsDisable}) {
  const { UserList , isUserLoading, fetchUserMaster } = useFetchUser();
  const {AddUserSuccess} = useAddUser();
   const[filteredData,setFilteredData]=useState([])
  // const { user } = useFetchAuth();
  const [params, SetParams] = useState({
      ActionID: null,
      IsAction: false,
    });

     const utypeOptions = [
       {
         label: "Admin",
         value: 1,
       },
       {
         label: "User",
         value: 2,
       },
     ];

  // const {
  //   UserEditError,
  //   isUserEditLoading,
  //   UserEditSuccess,
  //   EditUserFunc,
  //   ClearStateEditUser,
  // } = useEditCity();
  const {
    UserEditError,
    isUserEditLoading,
    UserEditSuccess,
    EditUserFunc,
    ClearStateEditUser,
  } = useEditUser();

  const Col = [
    { headername: "User Name", fieldname: "Name", type: "String" },
    { headername: "Phone Number", fieldname: "PhoneNumber", type: "String" },
    {
      headername: "Utype",
      fieldname: "Utype",
      selectionname: "Utype",
      type: "String",
      isSelection: true,
      options: utypeOptions,
    },
  ];

  const [editedData, setEditedData] = useState({
    id:null,
    Name:null,
    PhoneNumber: null,
    Utype:null
  });

  useEffect(() => {
    fetchUserMaster();
  }, [AddUserSuccess, UserEditSuccess]);

  useEffect(() => {
    setFilteredData(UserList);
  }, [isUserLoading, UserEditSuccess, AddUserSuccess]);

  
 
  const ActionFunc = (tabindex) => {
    SetParams((prev) => ({ ...prev, IsAction: true, ActionID: tabindex }));
    setIsDisable(true)
    setEditedData({
      id: filteredData[tabindex]?.ID,
      Name: filteredData[tabindex]?.Name,
      PhoneNumber: filteredData[tabindex]?.PhoneNumber,
      Utype: filteredData[tabindex]?.Utype,
    });
  };
  // console.log(filteredData ,"Filterdata")
  // console.log(editedData ,"edit data")
  const SortingFunc=(header,type)=>{
    console.log(header,type,"sorttable")
    const currentOrder = checkOrder(filteredData, header);
    const newOrder=currentOrder == "Asc" ? "Desc" : "Asc";
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
    // console.log(e,"e")
   let key=e.target.name;
   let value=e.target.value;
    // let data={...filteredData[index]}
    // console.log(data)
    // data[key]=value;
  
    
    setEditedData((prev) => {
      return {
        ...prev, [key]: value
      }
    });
  };
  const SaveChange = () => { 
    // console.log(editedData);
    if (!/^\d{10}$/.test(editedData.PhoneNumber)) {
      toast.error("Phone number must be exactly 10 digits!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
  if (!PhnoValidation(editedData.PhoneNumber)) {
     toast.error("Invalid Phone Number!", {
       position: "top-right",
       autoClose: 3000,
     });
     return;
  }
    EditUserFunc(editedData);
  };

   useEffect(() => {
 
     if (UserEditSuccess && !isUserEditLoading && !UserEditError) {
         toast.dismiss();
          toast.success("User Edited Successfully", {
            position: "top-right",
            autoClose: 3000,
          });
          setEditedData({
            id: null,
            Name: null,
            PhoneNumber: null,
            Utype: null,
          });
          SetParams({ ActionID: null, IsAction: null });
          setIsDisable(false)
     }
     if (UserEditError && !isUserEditLoading && !UserEditSuccess) {
         toast.dismiss();
          toast.error(UserEditError, {
            position: "top-right",
            autoClose: 3000,
          });
     }
     ClearStateEditUser();
      }, [isUserEditLoading, UserEditSuccess, UserEditError]);
   

  return (
    <div style={{ width: "auto", overflow: "auto", height:"50vh"}}>
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

export default UserTable;

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Ordercheck from "../../GlobalFunctions/Ordercheck";
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

function UserTable({ setIsDisable }) {
  const { UserList, isUserLoading, fetchUserMaster } = useFetchUser();
  const { AddUserSuccess } = useAddUser();
  const [filteredData, setFilteredData] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);
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
    { headername: "Phone Number", fieldname: "PhoneNumber", type: "number" },
    {
      headername: "Utype",
      fieldname: "Utype",
      selectionname: "Utype",
      type: "number",
      isSelection: true,
      options: utypeOptions,
    },
  ];

  const [editedData, setEditedData] = useState({
    id: null,
    Name: null,
    PhoneNumber: null,
    Utype: null,
  });

  useEffect(() => {
    fetchUserMaster();
    if (originalOrder.length > 0 && UserList?.length > 0) {
      const sortedData = originalOrder
        .map((id) => UserList.find((row) => row.ID === id))
        .filter(Boolean);

        console.log(sortedData,"sorteddata")
      
      setFilteredData(sortedData);
    }
  }, [AddUserSuccess, UserEditSuccess]);

  useEffect(() => {
    // setFilteredData(UserList);
    if (UserList?.length > 0) {
      let updatedData = UserList.map((user) => ({
        ...user,
      }));

      console.log(updatedData,"updateddata")
      console.log(originalOrder,"originalorder")
      // Ensure the order remains the same
      if (originalOrder.length > 0) {
        updatedData = originalOrder
          .map((id) => updatedData.find((row) => row.ID === id))
          .filter(Boolean);
      }

      console.log(updatedData,"updateddata2")
  
      setFilteredData(updatedData);
    }
  }, [isUserLoading, UserEditSuccess, AddUserSuccess]);

  const ActionFunc = (tabindex) => {
    SetParams((prev) => ({ ...prev, IsAction: true, ActionID: tabindex }));
    setIsDisable(true);
    setEditedData({
      id: filteredData[tabindex]?.ID,
      Name: filteredData[tabindex]?.Name,
      PhoneNumber: filteredData[tabindex]?.PhoneNumber,
      Utype: filteredData[tabindex]?.Utype,
    });
  };

  const applyFilter = (newFilteredData) => {
    setFilteredData(newFilteredData);
    // Store the current visible order
    setOriginalOrder(newFilteredData.map((row) => row.ID));
   console.log(originalOrder,"originalfilter")
  };

  const SortingFunc = (header, type) => {
    if (!filteredData || filteredData.length === 0) {
      // console.error("No data to sort");
      return;
    }
    const currentOrder = Ordercheck(filteredData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";
    //console.log(currentOrder, newOrder, "Current order, new oreder");
    let result;
    if (type === "String") {
      //console.log("In string");

      result = SortArrayByString(newOrder, filteredData, header);
      //console.log(result, "for string");
      // }
    } else if (type === "Date") {
      result = SortArrayByDate(newOrder, filteredData, header);
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    }

    setFilteredData([...result]);
    applyFilter(result)
  };
  const OnChangeHandler = (index, e) => {
    // //console.log(e,"e")
    let key = e.target.name;
    let value = e.target.value;
    // let data={...filteredData[index]}
    // //console.log(data)
    // data[key]=value;

    setEditedData((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };
  const SaveChange = () => {
    // //console.log(editedData);
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
      setIsDisable(false);
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
    <div style={{ width: "auto", overflow: "auto", height: "50vh" }}>
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

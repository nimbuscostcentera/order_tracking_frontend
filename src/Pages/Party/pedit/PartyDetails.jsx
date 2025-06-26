import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "../../../Component/Table";
import useFetchAuth from "../../../store/useFetchAuth";
import useFetchCust from "../../../store/useFetchCust";
import useFetchCity from "../../../store/useFetchCity";
import useFetchState from "../../../store/useFetchState";
import SortArrayByDate from "../../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../../GlobalFunctions/SortArrayByNumber";
import SortArrayByString from "../../../GlobalFunctions/SortarrayByString";
import checkOrder from "../../../GlobalFunctions/Ordercheck";
import useEditParty from "../../../store/useEditParty";
import useAddParty from "../../../store/UseAddParty";
import useFetchParty from "../../../store/usePartyList";
import PhnoValidation from "../../../GlobalFunctions/PhnoValidation";
import EmailValidation from "../../../GlobalFunctions/EmailValidation";
function PartyDetils({ isDisable, setIsDisable }) {
  const { user } = useFetchAuth();
  const { CityList = [], isCityLoading, fetchCityMaster } = useFetchCity();
  // const { StateList = [], isStateLoading, fetchStateMaster } = useFetchState();
  const {
    PartyEditError,
    isPartyEditLoading,
    PartyEditSuccess,
    EditPartyFunc,
    ClearStateEditParty,
  } = useEditParty();
  const { PartyRegSuccess } = useAddParty();
  useEffect(() => {
    fetchCityMaster(user);
    // fetchStateMaster(user);
  }, []);

  const CityListOption = useMemo(() => {
    return CityList?.map((item) => ({
      label: `${item?.CityCode}:${item?.DESCRIPTION}`,
      value: `${item?.id}`,
    }));
  }, [isCityLoading]);

  // const StateListOption = useMemo(() => {
  //   return StateList?.map((item) => ({
  //     label: `${item?.StateCode}:${item?.DESCRIPTION}`,
  //     value: `${item?.id}`,
  //   }));
  // }, [isStateLoading]);

  const [params, SetParams] = useState({
    ActionID: null,
    IsAction: false,
  });
  const [editedData, setEditedData] = useState({
    id: null,
    NAME: null,
    PHONE: null,
    ADDRESS3: null,
    City: null,
    PartyCode: null,
  });
  const { PartyList = [], fetchPartyData, error, loading } = useFetchParty();

  useEffect(() => {
    fetchPartyData(user);
  }, [PartyEditSuccess, user, PartyRegSuccess]);

  useEffect(() => {
    setFilteredData(PartyList);
  }, [loading, PartyList]);
  const [filteredData, setFilteredData] = useState(PartyList);
  const Col = [
    {
      headername: "Party Code",
      fieldname: "PartyCode",
      type: "String",
      max: 16,
    },
    { headername: "Customer Name", fieldname: "NAME", type: "String", max: 50 },
    { headername: "Phone No.", fieldname: "PHONE", type: "number", max: "10" },
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
      id: PartyList[tabindex]?.id,
      NAME: PartyList[tabindex]?.NAME,
      PHONE: PartyList[tabindex]?.PHONE,
      ADDRESS3: PartyList[tabindex]?.ADDRESS3,
      City: PartyList[tabindex]?.City,
      PartyCode: PartyList[tabindex]?.PartyCode,
    });
  };

  const SortingFunc = (header, type) => {
    //console.log(header, type, "sorttable");
    const currentOrder = checkOrder(filteredData, header);
    // //console.log(currentOrder)
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";
    // //console.log(newOrder);

    // setSortFilter((prev) => ({
    //   ...prev,
    //   order: currentOrder,
    // }));
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
  };

  const OnChangeHandler = (index, e) => {
    let key = e.target.name;
    let value = e.target.value;
    //console.log(key,value);

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

    EditPartyFunc(editedData);
  };
  //toaster
  useEffect(() => {
    if (isPartyEditLoading && !PartyEditSuccess && !PartyEditError) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (PartyEditSuccess && !isPartyEditLoading && !PartyEditError) {
      toast.success("Party Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setEditedData({
        id: null,
        NAME: null,
        PHONE: null,
        ADDRESS1: null,
        ADDRESS2: null,
        ADDRESS3: null,
        City: null,
        State: null,
        PartyCode: null,
      });

      SetParams({ ActionID: null, IsAction: null });
      setIsDisable(false);

      ClearStateEditParty();
    } else if (PartyEditError && !isPartyEditLoading && !PartyEditSuccess) {
      toast.error(PartyEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [isPartyEditLoading, PartyEditSuccess, PartyEditError]);

  return (
    <div id="table-box" style={{ height: "50vh" }}>
      {!loading && Array.isArray(PartyList) && PartyList.length > 0 ? (
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

export default PartyDetils;

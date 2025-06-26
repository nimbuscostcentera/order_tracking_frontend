import React, { useEffect, useMemo, useState } from "react";
import Table from "../../Component/Table";
import checkOrder from "../../GlobalFunctions/Ordercheck.js";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import useFetchArtisan from "../../store/useFetchArtisan.js";
import useAddArtisan from "../../store/useAddArtisan.js";
import useEditArtisan from "../../store/useEditArtisan.js";
import { toast } from "react-toastify";
import useFetchItem from "../../store/useFetchItem.js";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation.js";
import EmailValidate from "../../../src/GlobalFunctions/EmailValidation"
function KarigarTable({setIsDisable}) {
  const [editedData, setEditedData] = useState({
    id: null,
    CODE: null,
    NAME: null,
    PHONE: null,
    ADDRESS: null,
    CONTACTPERSON: null,
    MANAGER_CONTACT: null,
    data: [],
    selectedValue: [],
  });
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
  });

  const { KarigarRegSuccess } = useAddArtisan();
  const { isArtisanLoading, ArtisanList, fetchArtisanMaster } =
    useFetchArtisan();
  const {
    ArtisanEditError,
    isArtisanEditLoading,
    ArtisanEditSuccess,
    EditArtisanFunc,
    ClearStateEditArtisan,
  } = useEditArtisan();

  //console.log(ArtisanList,"artisanlist")

  const { ItemList, isItemLoading } = useFetchItem();

  const ItemListOption = useMemo(() => {
    return ItemList?.map((item) => ({
      label: `${item?.ITEMCODE}:${item?.DESCRIPTION}`,
      value: `${item?.id}`,
    }));
  }, [isItemLoading, ItemList]);

  const Col = [
    { headername: "Karigar Code", fieldname: "CODE", type: "String" },
    { headername: "Name", fieldname: "NAME", type: "String" },
    { headername: "Contact No.", fieldname: "PHONE", type: "number" },
    { headername: "Email", fieldname: "ADDRESS", type: "String" },
    {
      headername: "Manager Name",
      fieldname: "CONTACTPERSON",
      type: "String",
    },
    {
      headername: "Manager Number",
      fieldname: "MANAGER_CONTACT",
      type: "number",
    },
    // { headername: "Item Codes", fieldname: "ITEMCODES", type: "String" },
    {
      headername: "Item Code",
      fieldname: "ITEMCODES",
      selectionname: "selectedValue",
      labelname: "data",
      type: "String",
      isMultiSelection: true,
      isSelection: true,
      options: ItemListOption,
      placeholder: "--Select Item--",
    },
  ];

  const HandleMultiSelection = (ids) => {
    // //console.log("in multi");
    let array = ids?.map((item) => Number(item?.value));
    array = [...new Set(array)];
    setEditedData((prev) => ({ ...prev, data: array, selectedValue: ids }));
  };

  const ActionFunc = (tabIndex) => {
    setIsDisable(true);
    setParams((prev) => ({ ...prev, IsAction: true, ActionID: tabIndex }));
    let arr = filteredData[tabIndex]?.data?.map((item) => item?.ItemId);
    let arr2 = filteredData[tabIndex]?.data?.map((item) => ({
      label: `${item?.ITEMCODE}:${item?.DESCRIPTION}`,
      value: item?.ItemId,
    }));
    setEditedData({
      id: filteredData[tabIndex]?.id,
      CODE: filteredData[tabIndex]?.CODE,
      NAME: filteredData[tabIndex]?.NAME,
      PHONE: filteredData[tabIndex]?.PHONE,
      ADDRESS: filteredData[tabIndex]?.ADDRESS,
      CONTACTPERSON: filteredData[tabIndex]?.CONTACTPERSON,
      MANAGER_CONTACT: filteredData[tabIndex]?.MANAGER_CONTACT,
      data: arr,
      selectedValue: arr2,
    });
    // //console.log(editedData?.selectedValue)
  };

  const SortingFunc = (header, type) => {
    if (!filteredData || filteredData.length === 0) return;

    const currentOrder = checkOrder(filteredData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";

    let result;
    if (type === "String") {
      result = SortArrayByString(newOrder, filteredData, header);
    } else if (type === "Date") {
      result = SortArrayByDate(newOrder, filteredData, header);
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    }

    setFilteredData(result);
  };

  const OnChangeHandler = (index, e) => {
    let key = e.target.name;
    let value = e.target.value;
    const data = filteredData[index];
    //console.log(data,editedData)
    setEditedData({ ...editedData, [key]: value });
  };

  const SaveChange = () => {
    if (!EmailValidate(editedData.ADDRESS)) {
      toast.error("Invalid Email!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    // //console.log("Saving changes...", editedData);
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
    if (!/^\d{10}$/.test(editedData.MANAGER_CONTACT)) {
      toast.error("Phone number must be exactly 10 digits!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!PhnoValidation(editedData.MANAGER_CONTACT)) {
      toast.error("Invalid Phone Number!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    EditArtisanFunc(editedData);
  };

  useEffect(() => {
    if (isArtisanEditLoading && !ArtisanEditSuccess && !ArtisanEditError) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (
      ArtisanEditSuccess &&
      !isArtisanEditLoading &&
      !ArtisanEditError
    ) {
      toast.success("Artisan Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsDisable(false);
      setParams({ ActionID: -1, IsAction: false });
      setEditedData({
        id: null,
        CODE: null,
        NAME: null,
        PHONE: null,
        ADDRESS: null,
        CONTACTPERSON: null,
        MANAGER_CONTACT: null,
        ITEMCODES: null,
        data: [],
        selectedValue: [],
      });
    } else if (
      ArtisanEditError &&
      !isArtisanEditLoading &&
      !ArtisanEditSuccess
    ) {
      toast.error(ArtisanEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditArtisan();
  }, [isArtisanEditLoading, ArtisanEditSuccess, ArtisanEditError]);

  useEffect(() => {
    if (ArtisanList?.length > 0) {
      const processedData = ArtisanList.map((artisan) => ({
        ...artisan,
        ITEMCODES: artisan.data?.map((item) => item.ITEMCODE).join(", ") || "",
      }));
      setFilteredData(processedData);
    }
  }, [ArtisanList, isArtisanLoading]);

  useEffect(() => {
    fetchArtisanMaster();
  }, [ArtisanEditSuccess, KarigarRegSuccess]);

  return (
    <div id="table-box" style={{ height: "50vh" }}>
      {!isArtisanLoading &&
      Array.isArray(filteredData) &&
      filteredData.length > 0 ? (
        <Table
          tab={filteredData}
          isAction={params?.IsAction}
          ActionFunc={ActionFunc}
          ActionId={params?.ActionID}
          OnChangeHandler={OnChangeHandler}
          HandleMultiSelection={HandleMultiSelection}
          OnSaveHandler={SaveChange}
          onSorting={SortingFunc}
          Col={Col}
          isEdit={true}
          EditedData={editedData}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default KarigarTable;

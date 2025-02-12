import React, { useEffect } from "react";
import Table from "../../Component/Table";
import { useState } from "react";
import useFetchArtisan from "../../store/useFetchArtisan";
import useFetchItem from "../../store/useFetchItem";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import useAddItem from "../../store/useAddItem";
import useEditItem from "../../store/useEditItem";
import { toast } from "react-toastify";
function ItemTable({setIsDisable}) {
  const [editedData, setEditedData] = useState({
    id:null,
    ITEMCODE: null,
    DESCRIPTION: null,
  });
  console.log(editedData);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
  });
  const { ItemRegSuccess } = useAddItem();
  const { ItemError, isItemLoading, ItemList, fetchItemMaster } =
    useFetchItem();
  const {
    EditItemFunc,
    ItemEditError,
    isItemEditLoading,
    ItemEditSuccess,
    ClearStateEditItem,
  } = useEditItem();

  useEffect(() => {
    fetchItemMaster();
  }, [ItemRegSuccess, ItemEditSuccess]);

  useEffect(() => {
    if (ItemList?.length > 0) {
      setFilteredData([...ItemList]);
    }
  }, [ItemList, isItemLoading, ItemEditSuccess, ItemRegSuccess]);
  const Col = [
    { headername: "Item Code", fieldname: "ITEMCODE", type: "String" },
    { headername: "Description", fieldname: "DESCRIPTION", type: "String" },
  ];

  const ActionFunc = (tabIndex) => {
    setParams((prev) => ({ ...prev, IsAction: true, ActionID: tabIndex }));
    setIsDisable(true)
    const selectedData = filteredData[tabIndex];
    if (selectedData) {
      setEditedData({
        id: selectedData.id,
        ITEMCODE: selectedData.ITEMCODE || "",
        DESCRIPTION: selectedData.DESCRIPTION || "",
      });
    }
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
    setEditedData({ ...editedData, [key]: value });
  };
  const SaveChange = () => {
    console.log("Saving changes...", editedData);
    // EditArtisanFunc(editedData);
    EditItemFunc({...editedData});
  };
    useEffect(() => {
      if (isItemEditLoading && !ItemEditSuccess && !ItemEditError) {
        toast.play("pleaes wait...", {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (
        ItemEditSuccess &&
        !isItemEditLoading &&
        !ItemEditError
      ) {
        toast.success("Item Edited Successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        setParams({ ActionID: -1, IsAction: false });
        setEditedData({
          id:null,
          ITEMCODE: null,
          DESCRIPTION: null,
        });
        setIsDisable(false)
        ClearStateEditItem();
      } else if (
        ItemEditError &&
        !isItemEditLoading &&
        !ItemEditSuccess
      ) {
        toast.error(ItemEditError, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }, [isItemEditLoading, ItemEditSuccess, ItemEditError]);
  return (
    <div id="table-box" style={{ height: "50vh" }}>
      {!isItemLoading &&
      Array.isArray(filteredData) &&
      filteredData.length > 0 ? (
        <Table
          tab={filteredData}
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
        "Loading..."
      )}
    </div>
  );
}

export default ItemTable;

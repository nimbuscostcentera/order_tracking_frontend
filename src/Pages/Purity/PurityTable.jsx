import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Table from "../../Component/Table";

import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";

import useAddPurity from "../../store/useAddPurity";
import useEditPurity from "../../store/useEditPurity";
import useFetchPurity from "../../store/usePurityList";
import useFetchAuth from "../../store/useFetchAuth";

function PurityTable({setIsDisable}) {
  const [params, SetParams] = useState({
    ActionID: null,
    IsAction: false,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [editedData, setEditedData] = useState({
    id: null,
    PURITY: null,
  });

  const { user } = useFetchAuth();
  const { PurityList , loading, fetchPurityMaster } = useFetchPurity();
  const { AddPuritySuccess } = useAddPurity();
  const {
    PurityEditError,
    isPurityEditLoading,
    PurityEditSuccess,
    EditPurityFunc,
    ClearStateEditPurity,
  } = useEditPurity();

  const Col = [
    { headername: "Purity", fieldname: "PURITY", type: "String" },
  ];
  
  const ActionFunc = (tabindex) => {
    SetParams((prev) => ({ ...prev, IsAction: true, ActionID: tabindex }));
    setIsDisable(true)
    setEditedData({
      id: PurityList[tabindex]?.id,
      PURITY:PurityList[tabindex]?.PURITY,
    });
  };

  const SortingFunc = (header, type) => {
    //console.log(header,type,"sorttable")
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
    //console.log(key,value);

    setEditedData({ ...editedData, [key]: value });
  };

  const SaveChange = () => {
    //console.log(editedData);
    EditPurityFunc(editedData);
  };

  useEffect(() => {fetchPurityMaster(user)}, [AddPuritySuccess, user, PurityEditSuccess]);

  useEffect(() => {setFilteredData(PurityList)}, [PurityList, user, fetchPurityMaster]);

  useEffect(() => {
    if (isPurityEditLoading && !PurityEditSuccess && !PurityEditError) {
      toast.play("pleaes wait...", {position: "top-right",autoClose: 3000});
    }
    if (PurityEditSuccess && !isPurityEditLoading && !PurityEditError) {
      toast.success("Purity Edited Successfully", {position: "top-right",autoClose: 3000});
      setEditedData({id:null,PURITY:null});
      SetParams({ ActionID: null, IsAction: null });
      setIsDisable(false)
    }
    if (PurityEditError && !isPurityEditLoading && !PurityEditSuccess) {
      toast.error(PurityEditError, {position: "top-right",autoClose: 3000});
    }
    ClearStateEditPurity();
  }, [isPurityEditLoading, PurityEditSuccess, PurityEditError]);


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

export default PurityTable;

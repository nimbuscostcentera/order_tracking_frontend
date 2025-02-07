import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useRegularOrderEdit from "../../../store/useOrderRegular";
import useFetchPurity from "../../../store/useFetchPurity";
import useFetchAuth from "../../../store/useFetchAuth";
import useFetchArtisan from "../../../store/useFetchArtisan";
import useFetchArtisanwiseItem from "../../../store/useFetchArtisanwiseItem";

import EstimateTable from "../../../Component/EstimateTable";
import ReusableModal from "../../../Component/Modal";

function RegularOrderEdit() {
  let currentday = moment();
  let ItemObj = {
    ItemCode: null,
    item: null,
    wt: null,
  };
  const [indexRow, setIndexRow] = useState(-1);
  const [SelectedItem, setSelectedItem] = useState([]);
  const [rows, setRows] = useState([{ rowid: 1, ...ItemObj }]);
  const [showModal, setShowModal] = useState(false);
  const [regularData, setRegularData] = useState([
    {
      id: 1,
      PURITY: null,
      OrderDate: currentday.format("YYYY-MM-DD"),
      OrderNo: null,
      Karigr: null,
      ItemCodes: null,
      data: [
        {
          ItemCode: null,
          item: null,
          wt: null,
        },
      ],
    },
  ]);
  const { user } = useFetchAuth();
  const { ArtisanList, fetchArtisanMaster } = useFetchArtisan();
  const { ArtisanwiseItemList, fetchArtisanwiseItemMaster } =
    useFetchArtisanwiseItem();

  const { PurityList, fetchPurityMaster } = useFetchPurity();
  const {
    RegularOrderEdit,
    RegularOrderEditError,
    isRegularOrderEditLoading,
    RegularOrderEditSuccess,
    ClearStateRegularOrderEdit,
  } = useRegularOrderEdit();

  const Purity = useMemo(() => {
    let arr = [{ Name: "--Select Purity--", Value: -1 }];
    let arr1 = PurityList.map((item) => ({
      Name: item?.PURITY,
      Value: item?.id,
    }));
    return [...arr, ...arr1];
  }, [PurityList]);

  const KarigarList = useMemo(() => {
    return ArtisanList.map((item) => ({
      label: `${item?.CODE}:${item?.NAME}`,
      value: item?.id,
    }));
  }, [ArtisanList]);

  const SelectItem = useMemo(() => {
    return ArtisanwiseItemList.map((item) => ({
      label: `${item?.ITEMCODE}`,
      value: item?.Item,
    }));
  }, [ArtisanwiseItemList?.length]);

  const col = [
    {
      label: "Purity",
      key: "PURITY",
      type: "number",
      SelectOption: true,
      data: Purity || [],
      PlaceHolder: "Purity",
      width: "250px",
    },
    { label: "OrderDate", key: "OrderDate", type: "Date" },
    {
      label: "Karigor Code",
      key: "Karigr",
      type: "String",
      AutoSearch: true,
      SearchValue: "value",
      SearchLabel: "CODE",
      PlaceHolder: "Karigar Code",
      data: KarigarList || [],
      width: "200px",
    },
    {
      label: "Item",
      key: "ItemCodes",
      type: "String",
      isTableSelection: true,
      width: "250px",
    },
  ];

  const Col1 = [
    {
      label: "Item",
      key: "item",
      type: "String",
      AutoSearch: true,
      data: SelectItem,
      SearchValue: "value",
      SearchLabel: "item",
      PlaceHolder: "Item",
    },
    { label: "Weight", key: "wt", type: "String" },
  ];

  const onChangeHandler = (rowIndex, colKey, e) => {
    const updatedData = [...regularData];
    updatedData[rowIndex][colKey] = e.target.value;
    setRegularData(updatedData);
    // console.log(`Updated Row ${rowIndex}, ${colKey}:`, e.target.value);
  };

  const saveItem = () => {
    let copyarray = [...regularData];
    let modifiedObj = copyarray[0];
    console.log(copyarray, indexRow, "hi");
    let arr = rows?.map((i) => i?.ItemCode);
    let str = arr.join(", ");
    modifiedObj.ItemCodes = str;
    modifiedObj.data = rows;
    setRegularData(copyarray);
    handleClose();
  };

  const handleChange1 = (rowIndex, colKey, e) => {
    let copyarray = [...rows];
    setIndexRow(rowIndex);
    let modifiedObj = copyarray[rowIndex];
    let value = modifiedObj[colKey];
    const regexWt = /^\d*\.?\d{0,3}$/;
    const regexAmt = /^\d*\.?\d{0,2}$/;
    const regexWholeNumber = /^\d*$/;
    if (colKey == "wt" && regexWt.test(e.target.value)) {
      value = e.target.value;
      modifiedObj[colKey] = value;
    }
    if (colKey !== "wt") {
      value = e.target.value;
      let arrayItem = ArtisanwiseItemList?.filter((it) => it.Item == value);
      let obj = arrayItem[0];
      console.log(obj);
      let { ITEMCODE } = obj;
      modifiedObj["item"] = value;
      modifiedObj["ItemCode"] = ITEMCODE;
      console.log(modifiedObj);
    }
    setRows((prev) => copyarray);
  };

  const SubmitHandler = (e) => {
    e.preventDefault();
    regularData.data = [...rows];
    RegularOrderEdit(regularData[0]);
  };

  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  const addRow = () => {
    const newRow = { rowid: rows.length + 1, ...ItemObj };
    setRows([...rows, newRow]);
  };

  const deleteRow = (id) => {
    let ExistingRows = rows.filter((row) => row.rowid !== id);
    let n = ExistingRows?.length;
    for (let i = 0; i < n; i++) {
      ExistingRows[i].id = i + 1;
    }
    setRows(ExistingRows);
  };

  useEffect(() => {
    fetchPurityMaster(user);
    fetchArtisanMaster(user);
  }, []);
  useEffect(() => {
    // console.log("Useeffect is calling outside ");
    if (regularData[0]?.Karigr != null) {
      // console.log("Useeffect is calling inside");
      fetchArtisanwiseItemMaster({ artisanId: regularData[0]?.Karigr });
    }
  }, [regularData[0]?.Karigr]);
  // console.log(regularData[0]?.Karigr, "regularData[0]?.Karigr");

  useEffect(() => {
    setSelectedItem(ArtisanwiseItemList);
  }, [ArtisanwiseItemList]);

  useEffect(() => {
    console.log(RegularOrderEditSuccess, RegularOrderEditError);

    if (isRegularOrderEditLoading) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (RegularOrderEditSuccess) {
      toast.success("Order Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setRegularData([
        {
          id: 1,
          PURITY: null,
          OrderDate: currentday.format("YYYY-MM-DD"),
          OrderNo: null,
          Karigr: null,
          ItemCodes: null,
          data: [
            {
              ItemCode: null,
              Item: null,
              wt: null,
            },
          ],
        },
      ]);
    }
    if (RegularOrderEditError && !isRegularOrderEditLoading && !RegularOrderEditSuccess) {
      toast.error(RegularOrderEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateRegularOrderEdit();
  }, [isRegularOrderEditLoading, RegularOrderEditSuccess, RegularOrderEditError]);

  return (
    <div style={{ width: "100%", marginTop: "5px", paddingLeft: "20px" }}>
      <Row style={{ width: "100%" }}>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div>
            <h5 className="p-0">Regular Order</h5>
            <hr className="my-1 p-0" />
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <EstimateTable
            columns={col}
            rows={regularData}
            handleChange={onChangeHandler}
            SearchHandler={handleOpen}
          />
          <ReusableModal
            show={showModal}
            Title={"Item Details"}
            isPrimary={true}
            isSuccess={true}
            handleClose={handleClose}
            handlePrimary={saveItem}
            handleSuccess={addRow}
            SuccessButtonName={"Add Row"}
            PrimaryButtonName={"Save"}
            key={4}
            body={
              <div>
                <EstimateTable
                  columns={Col1}
                  rows={rows || []}
                  handleChange={handleChange1}
                  deleteRow={deleteRow}
                  isDelete={true}
                />
              </div>
            }
          />
          <Button
            style={{
              padding: "5px 8px",
              marginTop: "5px",
              float: "right",
              fontSize: "12px",
            }}
            variant="success"
            onClick={(e) => SubmitHandler(e)}
          >
            Add
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default RegularOrderEdit;

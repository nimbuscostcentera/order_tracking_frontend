import React, { useState, useEffect, useMemo, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EstimateTable from "../../../Component/EstimateTable";
import { Button, Row, Col } from "react-bootstrap";
import moment from "moment";
import useFetchArtisan from "../../../store/useFetchArtisan";
import useFetchCust from "../../../store/useFetchCust";
import usePlaceCustOrder from "../../../store/usePlaceOrderCust";
import useFetchAuth from "../../../store/useFetchAuth";

function CustomerOrder({ isDisable }) {
  let currentday = moment();
  let orderObj = {
    isChecked: false, // New checkbox field
    PURITY: null,
    OrderDate: currentday.format("YYYY-MM-DD"),
    Karigar: null,
    id_customer: null,
    Desc: null,
    Wt: null,
    SampleRcpVou: null,
    Karigarwt: null,
    Img: null,
  };

  const [custOrderData, SetCustOrderData] = useState([{ id: 1, ...orderObj }]);
  const fileInputRef = useRef(null);
  const { user } = useFetchAuth();
  const { ArtisanList, fetchArtisanMaster } = useFetchArtisan();
  const { CustomerList, fetchCustomrData } = useFetchCust();
  const {
    PlaceCustOrder,
    CustOrderSuccess,
    isCustOrderLoading,
    ClearStatePlaceOrder,
  } = usePlaceCustOrder();

  useEffect(() => {
    fetchArtisanMaster(user);
    fetchCustomrData(user);
  }, []);

  useEffect(() => {
    if (CustOrderSuccess) {
      toast.success("Order Placed Successfully", {
        autoClose: 3000,
        position: "top-right",
      });

      // Reset order data
      SetCustOrderData([{ id: 1, ...orderObj }]);

      // Reset file inputs
      document.querySelectorAll("input[type='file']").forEach((input) => {
        input.value = "";
      });

      ClearStatePlaceOrder();
    }
  }, [CustOrderSuccess]);
  //console.log(custOrderData);
  const Artisan = useMemo(() => {
    return ArtisanList.map((item) => ({
      label: `${item?.NAME}:${item?.CODE}`,
      value: item?.id,
    }));
  }, [ArtisanList]);

  const Customer = useMemo(() => {
    return CustomerList.map((item) => ({
      label: `${item?.CUSTCode}:${item?.NAME}`,
      value: item?.id,
    }));
  }, [CustomerList]);

  const col = [
    {
      label: "Customer*",
      key: "id_customer",
      type: "text",
      AutoSearch: true,
      SearchLabel: "id_customer",
      SearchValue: "value",
      PlaceHolder: "Select Customer",
      data: Customer || [],
      width: "135px",
    },
    { label: "OrderDate*", key: "OrderDate", type: "Date" },
    { label: "Image", key: "Img", type: "file" },
    {
      label: "Customer RefNo*",
      key: "SampleRcpVou",
      type: "text",
      width: "135px",
    },
    { label: "Description*", key: "Desc", type: "String", width: "160px" },
    { label: "Weight*", key: "Wt", type: "number", width: "130px" },
    {
      label: "Karigar*",
      key: "Karigar",
      type: "String",
      AutoSearch: true,
      SearchLabel: "Name",
      SearchValue: "Value",
      PlaceHolder: "Select Karigar",
      data: Artisan || [],
      width: "130px",
    },
    // { label: "Karigar Wt.", key: "Karigarwt", type: "number", width: "130px" },
    {
      label: "Sample Vou.",
      key: "isChecked",
      isCheckbox: true, // Checkbox column
      width: "150px",
    },
  ];

  const onChangeHandler = (rowIndex, colKey, value) => {
    let updatedRows = [...custOrderData];

    if (colKey === "Img") {
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        [colKey]: value.target.files[0] || null,
      };
    } else if (colKey === "isChecked") {
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], [colKey]: value };
    } else if (colKey === "Karigarwt" || colKey === "Wt") {
      const regexWt = /^\d*\.?\d{0,3}$/;
      if (regexWt.test(value.target.value)) {
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          [colKey]: value.target.value,
        };
      }
    } else {
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        [colKey]: value.target.value,
      };
    }

    SetCustOrderData(updatedRows);
  };

  const SubmitHandler = (e) => {
    e.preventDefault();

    if (
      !custOrderData[0].Desc ||
      !custOrderData[0].Karigar ||
      !custOrderData[0].OrderDate ||
      !custOrderData[0].Wt ||
      !custOrderData[0].SampleRcpVou ||
      !custOrderData[0].id_customer
    ) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    let formdata = new FormData();
    custOrderData.forEach((item) => {
      for (let key in item) {
        if (
          item[key] !== undefined &&
          item[key] !== "" &&
          item[key] !== null &&
          item[key] !== -1
        ) {
          formdata.append(key, item[key]);
        }
      }
    });

    PlaceCustOrder(formdata);
  };

  return (
    <div style={{ width: "100%", marginTop: "5px", paddingLeft: "20px" }}>
      <Row style={{ width: "100%" }}>
        <Col xs={12}>
          <h5 className="my-0">Place Order</h5>
          <hr className="mt-1 mb-2" />
        </Col>
        <Col xs={12}>
          <EstimateTable
            columns={col}
            rows={custOrderData}
            fileInputRefs={fileInputRef}
            handleChange={onChangeHandler}
          />
          <Button
            style={{ padding: "3px 6px", marginTop: "5px", float: "right" }}
            variant="success"
            disabled={isDisable}
            onClick={SubmitHandler}
          >
            {isCustOrderLoading ? "Please wait..." : "Place Order"}
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default CustomerOrder;

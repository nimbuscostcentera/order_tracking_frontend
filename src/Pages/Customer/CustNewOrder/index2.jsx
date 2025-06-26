import React, { useState, useEffect, useMemo, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EstimateTable from "../../../Component/EstimateTable";
import { Button, Row, Col } from "react-bootstrap";
import moment from "moment";
import useFetchPurity from "../../../store/useFetchPurity";
import useFetchAuth from "../../../store/useFetchAuth";
import useFetchArtisan from "../../../store/useFetchArtisan";
import useFetchCust from "../../../store/useFetchCust";
import usePlaceCustOrder from "../../../store/usePlaceOrderCust";
function CustomerOrder({ isDisable }) {
  let currentday = moment();
  let orderObj = {
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
  // const { PurityList, fetchPurityMaster, loadingPurity } = useFetchPurity();
  const { ArtisanList, fetchArtisanMaster, loadingArtisan } = useFetchArtisan();
  const { CustomerList, fetchCustomrData, isCustLoading } = useFetchCust();
  const {
    PlaceCustOrder,
    CustOrderError,
    isCustOrderLoading,
    CustOrderSuccess,
    ClearStatePlaceOrder,
  } = usePlaceCustOrder();
  //fetch purity,artisan,customer
  useEffect(() => {
    // fetchPurityMaster(user);
    fetchArtisanMaster(user);
    fetchCustomrData(user);
  }, []);
  //toaster
  useEffect(() => {
    if (CustOrderSuccess) {
      toast.success("Order Placed Successfully", {
        autoClose: 3000,
        position: "top-right",
      });

      // Reset order data
      SetCustOrderData([{ id: 1, ...orderObj }]);

      // Reset the file input using state
      document.querySelectorAll("input[type='file']").forEach((input) => {
        input.value = "";
      });

      ClearStatePlaceOrder();
    }
  }, [CustOrderSuccess]);

  // const Purity = useMemo(() => {
  //   let arr = [{ Name: "--Select Purity--", Value: -1 }];
  //   PurityList.map((item) => {
  //     let obj = {};
  //     obj.Name = item?.PURITY;
  //     obj.Value = item?.id;
  //     arr.push(obj);
  //   });
  //   return arr;
  // }, [PurityList]);
  //console.log(fileInputRef.current);
  const Artisan = useMemo(() => {
    let arr = [];
    ArtisanList.map((item) => {
      let obj = {};
      obj.label = `${item?.NAME}:${item?.CODE}`;
      obj.value = item?.id;
      arr.push(obj);
    });
    return arr;
  }, [ArtisanList]);

  const Customer = useMemo(() => {
    let arr = CustomerList.map((item) => ({
      label: `${item?.CUSTCode}:${item?.NAME}`,
      value: item?.id,
    }));
    return arr;
  }, [CustomerList]);
  // //console.log(Customer);

  const col = [
    {
      label: "Customer",
      key: "id_customer",
      type: "text",
      AutoSearch: true,
      SearchLabel: "id_customer",
      SearchValue: "value",
      PlaceHolder: "Select Customer",
      data: Customer || [],
      width: "135px",
    },
    { label: "OrderDate", key: "OrderDate", type: "Date" },
    { label: "Image", key: "Img", type: "file" },
    {
      label: "Customer Ref. No.",
      key: "SampleRcpVou",
      type: "text",
      width: "135px",
    },
    { label: "Description", key: "Desc", type: "String", width: "160px" },

    { label: "Weight", key: "Wt", type: "number", width: "130px" },
    {
      label: "Karigar",
      key: "Karigar",
      type: "String",
      AutoSearch: true,
      SearchLabel: "Name",
      SearchValue: "Value",
      PlaceHolder: "Select Karigar",
      data: Artisan || [],
      width: "130px",
    },
    {
      label: "Karigar Wt.",
      key: "Karigarwt",
      type: "number",
      width: "130px",
    },
  ];
  const onChangeHandler = (rowIndex, colKey, e) => {
    let updatedRows = [...custOrderData];

    if (colKey === "Img") {
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        [colKey]: e.target.files[0] || null, // Store file in state
      };
    } else if (colKey === "Karigarwt" || colKey === "Wt") {
      const regexWt = /^\d*\.?\d{0,3}$/;
      if (regexWt.test(e.target.value)) {
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          [colKey]: e.target.value,
        };
      }
    } else {
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        [colKey]: e.target.value,
      };
    }

    //console.log("Updated Row Data:", updatedRows[rowIndex]); // Debugging log
    SetCustOrderData(updatedRows);
  };

  const SubmitHandler = (e) => {
    e.preventDefault();

    // //console.log(custOrderData);
    if (
      !custOrderData[0].Desc ||
      !custOrderData[0].Karigar ||
      !custOrderData[0].Karigarwt ||
      !custOrderData[0].OrderDate ||
      !custOrderData[0].Wt
    ) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    let formdata = new FormData();
    custOrderData.map((item) => {
      for (let key in item) {
        if (
          item[key] != undefined ||
          item[key] != "" ||
          item[key] != null ||
          item[key] != -1
        )
          formdata.append(key, item[key]);
      }
    });
    PlaceCustOrder(formdata);
  };
  // //console.log(isCustOrderLoading);
  return (
    <div style={{ width: "100%", marginTop: "5px", paddingLeft: "20px" }}>
      <Row style={{ width: "100%" }}>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="m-0">
          <div className="my-0">
            <h5 className="my-0">Place Order</h5>
            <hr className="mt-1 mb-2" />
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
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
            onClick={(e) => SubmitHandler(e)}
          >
            {isCustOrderLoading ? "please wait..." : "Place Order"}
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default CustomerOrder;

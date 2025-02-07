import React from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "./table.css";
import SearchableDropDown from "../SearchableDropDown";
import MultipleSelection from "../MultipleSelection";
function Table({
  params,
  setParams,
  isIcon,
  tab,
  ActionId,
  ActionFunc,
  onSorting,
  Col,
  isKarigarButton,
  receive,
  isDespatchButton,
  despatch,
  isDeliveryButton,
  delivery,
  isEdit,
  OnChangeHandler,
  OnSaveHandler,
  KarigarReceiveFunc,
  DespatchFunc,
  DeliveryFunc,
  EditedData,
  HandleMultiSelection,
  isView,
  viewPref,
  handleViewClick,
  isPrint,
  handleprint,
}) 

{
  console.log(isKarigarButton,"iskarigar")
  return (
    <table className="table table-responsive table-sm table-hover align-middle">
      <thead>
        <tr className="table-secondary">
          <th scope="col" style={{ minWidth: "40px" }}>
            Srn
          </th>
          {Array.isArray(Col) &&
            Col?.map((col, index) => {
              return (
                <th
                  scope="col"
                  style={{ minWidth: col?.width || "100px" }}
                  key={index}
                >
                  {col?.headername}
                  <Button
                    variant="link"
                    style={{ padding: "1px 1px", color: "white" }}
                    onClick={() => {
                      onSorting(col?.fieldname, col?.type);
                    }}
                  >
                    <i className="bi bi-arrow-down-up"></i>
                  </Button>
                </th>
              );
            })}
          {isKarigarButton ? (
            <th scope="col" style={{ minWidth: "65px" }}>
              Karigar Receive
            </th>
          ) : null}
          {isDespatchButton ? (
            <th scope="col" style={{ minWidth: "85px" }}>
              Despatch
            </th>
          ) : null}
          {isDeliveryButton ? (
            <th scope="col" style={{ minWidth: "55px" }}>
              Sample Delivery
            </th>
          ) : null}
          {isEdit ? (
            <>
              <th scope="col" style={{ minWidth: "55px" }}>
                Edit
              </th>
              <th scope="col" style={{ minWidth: "55px" }}>
                {" "}
                Save{" "}
              </th>
            </>
          ) : null}
          {isView ? (
            <>
              <th scope="col" style={{ minWidth: "70px" }}>
                {viewPref} View
              </th>
            </>
          ) : null}
          {isPrint ? (
            <>
              <th scope="col" style={{ minWidth: "70px" }}>
                Print
              </th>
            </>
          ) : null}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(tab) &&
          tab.map((item, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                {Array.isArray(Col) &&
                  Col?.map((field, indexfield) => {
                    return (
                      <td key={indexfield}>
                        {ActionId === index && !field?.isNotEditable ? (
                          field?.isSelection ? (
                            field?.isMultiSelection ? (
                              <MultipleSelection
                                options={field?.options}
                                handleChange={HandleMultiSelection}
                                selectedVal={
                                  EditedData[field?.selectionname] ||
                                  item[field?.selectionname]
                                }
                                label={field?.labelname}
                                placeholder={field?.placeholder}
                                key={indexfield}
                                defaultval={EditedData[field?.labelname]}
                              />
                            ) : (
                              <SearchableDropDown
                                options={field?.options}
                                handleChange={(e) => OnChangeHandler(index, e)}
                                selectedVal={
                                  EditedData[field?.selectionname] ||
                                  item[field?.selectionname]
                                }
                                label={field?.selectionname}
                                placeholder={field?.headername}
                                key={indexfield}
                                defaultval={item[field?.fieldname]}
                              />
                            )
                          ) : (
                            <input
                              name={field?.fieldname}
                              maxLength={field?.max}
                              label={field?.headername}
                              placeholder={field?.headername}
                              value={EditedData[field?.fieldname] || ""}
                              type={field?.type}
                              onChange={(e) => OnChangeHandler(index, e)}
                              className="input-cell"
                              style={{ width: "100%" }}
                            />
                          )
                        ) : field?.fieldname === "Img" ? (
                          <a
                            href={`${
                              process.env.REACT_APP_BASEURL_IMAGE
                            }/images/${item[field?.fieldname]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={`${
                                process.env.REACT_APP_BASEURL_IMAGE
                              }/images/${item[field?.fieldname]}`}
                              alt="img"
                              style={{
                                width: "100%",
                                height: "50px",
                                cursor: "pointer",
                              }}
                            />
                          </a>
                        ) : (
                          item[field?.fieldname]
                        )}
                      </td>
                    );
                  })}
                {isKarigarButton ? (
                  console.log(isIcon,"isIcon"),
                  <td>
                    {item?.[receive] !== 1 ? (
                      <button
                        className="btn btn-link"
                        onClick={() => KarigarReceiveFunc(index)}
                        // disabled={!isIcon}
                        disabled={isIcon==true ? false :true}
                        style={{ cursor: isIcon ? "pointer" : "not-allowed" }}
                      >
                        <i
                        // disabled={isIcon==true ? false:true}
                          className="bi bi-clipboard-check"
                          style={{color: isIcon? "purple":"grey", fontSize: "22px" }}
                          
                        ></i>
                      </button>
                    ) : (
                      console.log(isIcon,"isIcon"),
                      <i
                        className="bi bi-check2-circle"
                        style={{ color:"green", fontSize: "25px" }}
                      ></i>
                    )}
                  </td>
                ) : null}
                {isDespatchButton ? (
                  <td>
                    {item?.[despatch] !== 1 ? (
                      <button
                        className="btn btn-link"
                        onClick={() => DespatchFunc(index)}
                        disabled={isIcon==true ? false:true}
                      >
                        <i
                       
                          className="bi bi-truck"
                          style={{color: isIcon?"blue":"grey", fontSize: "22px" }}
                        ></i>
                      </button>
                    ) : (
                      <i
                        className="bi bi-check2-circle"
                        style={{ color: "green", fontSize: "25px" }}
                      ></i>
                    )}
                  </td>
                ) : null}
                {isDeliveryButton ? (
                  <td>
                    {item?.[delivery] !== 1 ? (
                      <button
                        className="btn btn-link"
                        onClick={() => DeliveryFunc(index)}
                        // disabled={!isIcon}
                        disabled={isIcon==true ? false:true}
                      >
                        <i
                        // disabled={isIcon==true ? false:true}
                          className="bi bi-cart-check"
                          style={{ color:  isIcon ? "green":"grey", fontSize: "25px" }}
                        ></i>
                      </button>
                    ) : (
                      <i
                        className="bi bi-check2-circle"
                        style={{ color: "green", fontSize: "25px" }}
                      ></i>
                    )}
                  </td>
                ) : null}
                {isEdit ? (
                  <>
                    <td>
                      <button
                        className="btn btn-link"
                        style={{ padding: "0" }}
                        onClick={() => {
                          ActionFunc(index);
                        }}
                      >
                        <i
                          className="bi bi-pencil-square"
                          style={{ color: "#ac4bec", fontSize: "20px" }}
                        ></i>
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-link"
                        style={{ padding: "0" }}
                        onClick={() => OnSaveHandler(index)}
                        disabled={
                          ActionId == null ||
                          ActionId == undefined ||
                          ActionId == -1
                        }
                      >
                        <i
                          className="bi bi-floppy"
                          style={{
                            color:
                              index === ActionId && ActionId !== null
                                ? "green"
                                : "lightgrey",
                            fontSize: "20px",
                          }}
                        ></i>
                      </button>
                    </td>
                  </>
                ) : null}
                {isView ? (
                  <>
                    <td>
                      <button
                        className="btn btn-link"
                        style={{ padding: "0" }}
                        onClick={() => handleViewClick(index)}
                      >
                        <i
                          className="bi bi-eye text-primary"
                          style={{ color: "#ac4bec", fontSize: "20px" }}
                        ></i>
                      </button>
                    </td>
                  </>
                ) : null}
                {isPrint ? (
                  <>
                    <td>
                      <button
                        className="btn btn-link"
                        style={{ padding: "0" }}
                        onClick={() => handleprint(index)}
                      >
                        <i
                          className="bi bi-printer text-primary"
                          style={{ color: "#ac4bec", fontSize: "20px" }}
                        ></i>
                      </button>
                    </td>
                  </>
                ) : null}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

export default Table;

import React from "react";
import SelectOption from "../SelectOption";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./EstimateTable.css";
import { Button } from "react-bootstrap";
import SearchableDropdown from "../SearchableDropDown";

function EstimateTable({
  columns,
  rows,
  handleChange,
  FetchRowId,
  deleteRow,
  SelectStyle,
  SearchHandler,
  isDelete,
  id,
  fileInputRefs,
}) {
  return (
    <div
      style={{ overflow: "auto", width: "auto" }}
      className="table-responsive slider border m-0"
    >
      <table className="table align-middle m-0 p-0">
        <thead className="thead-decor">
          <tr>
            <th
              className="th-decor"
              style={{ padding: "0 5px", width: "40px" }}
            >
              Srn
            </th>
            {columns.map((col, index) => (
              <th key={index} className="th-decor">
                {col.label}
              </th>
            ))}
            {isDelete && <th className="th-decor">Actions</th>}
          </tr>
        </thead>
        <tbody className="table-body-decor">
          {rows.map((row, indexrow) => (
            <tr key={indexrow}>
              <td className="th-decor">{indexrow + 1}</td>
              {columns.map((col, indexcol) => (
                <td
                  key={indexcol}
                  className="td-cell"
                  style={{ width: col?.width }}
                >
                  {/* Checkbox Fix */}
                  {col?.isCheckbox ? (
                    <div className="table-input-wrapper mx-5">
                      <input
                        type="checkbox"
                        name={col.key}
                        checked={!!row[col.key]} // Ensuring Boolean value
                        onChange={(event) =>
                          handleChange(indexrow, col.key, event.target.checked)
                        }
                      />
                    </div>
                  ) : col?.SelectOption ? (
                    <div className="table-input-wrapper">
                      <SelectOption
                        Soptions={
                          col?.isCustomized ? row?.StoneSubList : col?.data
                        }
                        SName={col?.key}
                        PlaceHolder={col?.PlaceHolder}
                        Value={row[col?.key]}
                        OnSelect={(event) =>
                          handleChange(indexrow, col?.key, event)
                        }
                        SelectStyle={{
                          minWidth: "180px",
                          width: col?.width || "100%",
                          height: "35px",
                          margin: 0,
                          padding: "0px 5px",
                          fontSize: "12px",
                          color: "grey",
                        }}
                      />
                    </div>
                  ) : col?.isTableSelection ? (
                    <div className="d-flex justify-content-start flex-nowrap table-input-wrapper">
                      {col?.type === "file" ? (
                        <input
                          type="file"
                          name={col.key}
                          ref={fileInputRefs}
                          onChange={(event) =>
                            handleChange(indexrow, col.key, event)
                          }
                          style={{ width: "170px" }}
                          placeholder={col.label}
                          className="input-cell"
                        />
                      ) : (
                        <input
                          type={col.type}
                          name={col.key}
                          value={row[col.key] || ""}
                          maxLength={col?.maxlen}
                          onChange={(event) =>
                            handleChange(indexrow, col.key, event)
                          }
                          style={{ minWidth: "170px", width: "100%" }}
                          placeholder={col.label}
                          className="input-cell"
                        />
                      )}

                      <Button
                        className="table-button"
                        onClick={() => SearchHandler(row?.id, col.key)}
                      >
                        <i className="bi bi-search"></i>
                      </Button>
                    </div>
                  ) : col?.AutoSearch ? (
                    <SearchableDropdown
                      handleChange={(obj) =>
                        handleChange(indexrow, col?.key, obj)
                      }
                      id={col?.SearchValue}
                      label={col?.SearchLabel}
                      options={col?.data}
                      selectedVal={row[col?.key]}
                      key={`${indexrow}${indexcol}`}
                      placeholder={col?.PlaceHolder}
                      defaultval={row[col?.key]}
                      width={col?.width}
                    />
                  ) : (
                    <div className="table-input-wrapper">
                      {col?.type === "file" ? (
                        <input
                          type="file"
                          name={col.key}
                          ref={fileInputRefs}
                          onChange={(event) =>
                            handleChange(indexrow, col.key, event)
                          }
                          style={{ width: "170px" }}
                          placeholder={col.label}
                          className="input-cell"
                        />
                      ) : (
                        <input
                          type={col.type}
                          name={col.key}
                          value={row[col.key] || ""}
                          maxLength={col?.maxlen}
                          onChange={(event) =>
                            handleChange(indexrow, col.key, event)
                          }
                          style={{ minWidth: "170px", width: "100%" }}
                          placeholder={col.label}
                          className="input-cell"
                        />
                      )}
                    </div>
                  )}
                </td>
              ))}
              {isDelete && (
                <td className="td-cell" style={{ width: "50px" }}>
                  <button
                    className={
                      row?.[id] === 1
                        ? "table-button-del-disabled"
                        : "table-button-del"
                    }
                    disabled={row?.[id] === 1}
                    onClick={() => deleteRow(row?.[id])}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EstimateTable;

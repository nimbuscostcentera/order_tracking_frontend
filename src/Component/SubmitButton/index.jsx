import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "./SubmitButton.css";
import "../../GlobalStyle/GlobalTheme.css";
function SubmitButton({ type, OnClickBtn, isdisable,ButtonNm }) {
  return (
    <div className="d-flex justify-content-center align-item-center">
      <button
        className="btn color-btn-success btn-width"
        type={type}
        onClick={OnClickBtn}
        disabled={isdisable}
      >
        <span className="btn-font-size">{ButtonNm ? ButtonNm : "Submit"}</span>
      </button>
    </div>
  );
}

export default SubmitButton
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./authNavBar.css";
import "../../GlobalStyle/GlobalTheme.css";
import useControlSidebar from "../../store/useControlSidebar";
import { OverlayTrigger, Tooltip } from "react-bootstrap"; // Import Tooltip from react-bootstrap

function SideBar() {
  const { Open, CloseSideBarMenu, OpenSideBarMenu } = useControlSidebar();
  const [show, setShow] = useState(false);

  function toggleNav() {
    setShow(!show);
    const titlediv = document.getElementById("title-div");
    const title = document.getElementById("title-h");
    const sidebar = document.getElementById("mySidebar");
    if (Open) {
      CloseSideBarMenu();
      title.classList.add("close");
      titlediv.classList.add("close");
      sidebar.classList.add("close");
    } else {
      OpenSideBarMenu();
      title.classList.remove("close");
      titlediv.classList.remove("close");
      sidebar.classList.remove("close");
    }
  }

  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>; // Use Tooltip from react-bootstrap

  return (
    <div className="sidebar" id="mySidebar" style={{ overflowY: "auto" }}>
      {/**Menu Header */}
      <div className="sidebar-header ml-3" id="title-div">
        <h6 className="sidebar-title" id="title-h">
          Menu
        </h6>
        <button className="toggle-btn" onClick={toggleNav}>
          <i className="bi bi-list"></i>
        </button>
      </div>

      <div style={{ padding: "10px 0" }}>
        {/**Customer */}
        <details className="py-1 border-bottom border-light">
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Customer")}
            >
              <i className="bi bi-person me-2" style={{ fontSize: "22px" }}></i>
            </OverlayTrigger>
            {Open && <span className="ml-2">Customer</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            <Link
              to={"/auth/customer/dashboard"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Order")}
              >
                <i className="bi bi-cart4 ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Manage Order</span>}
            </Link>

            <Link
              to={"/auth/customer/cust-order-report"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Order Report")}
              >
                <i className="bi bi-graph-up-arrow ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Order Report</span>}
            </Link>
          </div>
        </details>

        {/**Regular */}
        <details className="py-1 border-bottom border-light">
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Regular")}
            >
              <i className="bi bi-basket me-2" style={{ fontSize: "22px" }}></i>
            </OverlayTrigger>
            {Open && <span className="ml-2"> Regular</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            <Link
              to={"/auth/regular/dashboard"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Order")}
              >
                <i className="bi bi-cart4 ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Manage Order</span>}
            </Link>

            <Link
              to={"/auth/regular/regular-report-details"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Order Details")}
              >
                <i className="bi bi-graph-up ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Order Details</span>}
            </Link>
            <Link
              to={"/auth/regular/wt-item-report"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Item wise Wt")}
              >
                <i className="bi bi-graph-up-arrow ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Item wise Wt</span>}
            </Link>
          </div>
        </details>

        {/**Party */}
        <details className="py-1 border-bottom border-light">
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger placement="bottom" overlay={renderTooltip("Party")}>
              <i
                className="bi bi-people-fill me-2"
                style={{ fontSize: "22px" }}
              ></i>
            </OverlayTrigger>
            {Open && <span> Party</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            <Link
              to={"/auth/party/dashboard"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Order")}
              >
                <i className="bi bi-cart4 ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Manage Order</span>}
            </Link>

            <Link
              to={"/auth/party/party-order-report"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Order Report")}
              >
                <i className="bi bi-graph-up ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Order Report</span>}
            </Link>
            <Link
              to={"/auth/party/party-summary"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Party summary")}
              >
                <i className="bi bi-graph-up-arrow ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Party summary</span>}
            </Link>
          </div>
        </details>

        {/**Others */}
        <details className="py-1 border-bottom border-light">
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Master Manager")}
            >
              <i
                className="bi bi-person-gear me-2"
                style={{ fontSize: "22px" }}
              ></i>
            </OverlayTrigger>
            {Open && <span>Master Manager</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            <Link
              to={"/auth/manager/customer"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Customer")}
              >
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Manage Customer</span>}
            </Link>
            <Link
              to={"/auth/manager/karigar"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Karigar")}
              >
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span>Manage Karigar</span>}
            </Link>
            <Link
              to={"/auth/manager/item"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Items")}
              >
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Manage Items</span>}
            </Link>
            <Link
              to={"/auth/manager/city"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage City")}
              >
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Manage City</span>}
            </Link>
            <Link
              to={"/auth/manager/state"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage States")}
              >
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Manage States</span>}
            </Link>
            <Link
              to={"/auth/manager/party"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Party")}
              >
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Manage Party</span>}
            </Link>
            <Link
              to={"/auth/manager/purity"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Purity")}
              >
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Manage Purity</span>}
            </Link>
            <Link
              to={"/auth/manager/user"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage User")}
              >
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Manage User</span>}
            </Link>
          </div>
        </details>
      </div>
    </div>
  );
}

export default SideBar;

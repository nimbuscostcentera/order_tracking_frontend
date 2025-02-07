import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import ResetPage from "./Pages/Auth/Resetpass";
import LoginPage from "./Pages/Auth/LoginPage";
import AuthNavigator from "./Layout/AuthNavigator";
import Pagenotfound from "./Pages/PageNotFound";
import CustomerDashboard from "./Pages/Customer/CustDashboard";
import RegularDashboard from "./Pages/Regular/RegularDashboard";
import PartyDashboard from "./Pages/Party/PartyDashboard";
import CustListEdit from "./Pages/Customer/CustListEdit";
import KarigarListEdit from "./Pages/Karigar";
import ItemListEdit from "./Pages/Item";
import ManageCity from "./Pages/City";
import ManageState from "./Pages/State";
import PartyListEdit from "./Pages/Party/PartListEdit";
import Purity from "./Pages/Purity";
import CustOrderReport from "./Pages/Customer/CustOrderReport";
import RegularOrderReport from "./Pages/Regular/RegularOrderReport";
import PartyOrderReport from "./Pages/Party/PartyOrderReport";
import Regularweight from "./Pages/Regular/RegularWeight";
import PartySummary from "./Pages/Party/PartySummary/index"
import Setup from "./Pages/Setup";
import UserListEdit from "./Pages/User";
import Profile from "./Pages/Profile/Profile";
const App = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />, // Use JSX component correctly
    children: [
      {
        path: "",
        element: <LoginPage />, // Use JSX component correctly
      },
      {
        path: "resetpass",
        element: <ResetPage />, // Use JSX component correctly
      },
    ],
  },
  {
    path: "auth",
    element: <AuthNavigator />,
    errorElement: <Pagenotfound />,
    children: [
      {
        path: "customer",
        children: [
          {
            path: "dashboard",
            element: <CustomerDashboard />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "cust-order-report",
            element: <CustOrderReport />,
            errorElement: <Pagenotfound />,
          },
        ],
      },
      {
        path: "profile",
        element: <Profile/>,
        errorElement: <Pagenotfound />,
      },
      {
        path: "regular",
        children: [
          {
            path: "dashboard",
            element: <RegularDashboard />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "wt-item-report",
            element: <Regularweight />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "regular-report-details",
            element: <RegularOrderReport />,
            errorElement: <Pagenotfound />,
          },
          // {
          //   path: "regular-report",
          //   element: <OrderSummary/>,
          //   errorElement: <Pagenotfound />,
          // },
        ],
      },
      {
        path: "party",
        children: [
          {
            path: "dashboard",
            element: <PartyDashboard />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "party-order-report",
            element: <PartyOrderReport />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "party-summary",
            element: <PartySummary />,
            errorElement: <Pagenotfound />,
          },
        ],
      },
      {
        path: "manager",
        errorElement: <Pagenotfound />,
        children: [
          {
            path: "purity",
            element: <Purity />,
          },
          {
            path: "party",
            element: <PartyListEdit />,
          },
          {
            path: "customer",
            element: <CustListEdit />,
          },
          {
            path: "karigar",
            errorElement: <Pagenotfound />,
            element: <KarigarListEdit />,
          },
          {
            path: "item",
            element: <ItemListEdit />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "city",
            element: <ManageCity />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "state",
            element: <ManageState />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "user",
            element: <UserListEdit />,
            errorElement: <Pagenotfound />,
          },
        ],
      },
      {
        path: "setup",
        errorElement: <Pagenotfound />,
        element: <Setup />,
      },
    ],
  },
]);

export default App;

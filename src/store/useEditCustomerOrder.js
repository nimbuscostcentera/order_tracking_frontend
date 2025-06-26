import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/cust-ordermodify`;
const useEditCustomerOrder = create((set) => ({
  CustOrderEditSuccess: null,
  isCustOrderEditLoading: false,
  CustOrderEditError: null,

  EditCustOrderFunc: async (userdata) => {
    set({
      isCustOrderEditLoading: true,
      CustOrderEditError: null,
      CustOrderEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      set({
        CustOrderEditSuccess: response,
        isCustOrderEditLoading: false,
        CustOrderEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        CustOrderEditError: error?.response?.data?.response,
        isCustOrderEditLoading: false,
        CustOrderEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditCustOrder: () => {
    set({
      CustOrderEditSuccess: null,
      isCustOrderEditLoading: false,
      CustOrderEditError: null,
    });
  },
}));

export default useEditCustomerOrder;

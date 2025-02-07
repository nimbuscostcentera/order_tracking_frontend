import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/cust-orderdspatch`;
const useCustOrderDespatch = create((set) => ({
  CustOrderDespatchSuccess:null,
  isCustOrderDespatchLoading: false,
  CustOrderDespatchError: null,

  CustOrderDespatchUpdate: async (userdata) => {
    set({ isCustOrderDespatchLoading: true, CustOrderDespatchError: null }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      set({
        CustOrderDespatchSuccess: response,
        isCustOrderDespatchLoading: false,
      }); // Update state with fetched data
    } catch (error) {
      set({ CustOrderDespatchError: error.response?.data?.response }); // Handle errors
    }
    set({ isCustOrderDespatchLoading: false }); // stop loading
  },
  clearCustOrderDespatch: () => {
    set({
      CustOrderDespatchSuccess:null,
      isCustOrderDespatchLoading: false,
      CustOrderDespatchError: null,
    })
  }
}));

export default useCustOrderDespatch;

import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/cust-orderadd`;
const usePlaceCustOrder = create((set) => ({
  CustOrderSuccess: "",
  isCustOrderLoading: false,
  CustOrderError: null,

  PlaceCustOrder: async (userdata) => {
    set({ isCustOrderLoading: true, CustOrderError: null }); // Start loading
    try {
      const result = await axios.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ CustOrderSuccess: response, isCustOrderLoading: false }); // Update CustOrder with fetched data
    } catch (error) {
      set({
        CustOrderError: error?.response?.data?.response,
        isCustOrderLoading: false,
      }); // Handle errors
    }
  },
  ClearStatePlaceOrder: async () => {
    set({
      CustOrderSuccess: "",
      isCustOrderLoading: false,
      CustOrderError: null,
    });
  },
}));

export default usePlaceCustOrder;

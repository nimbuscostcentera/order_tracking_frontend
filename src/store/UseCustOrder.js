import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/report-routes/customer-ordershow`;
const useCustOrder = create((set) => ({
  CustomerDashList: [],
  CustDashloading: false,
  CustDashError: null,

  fetchCustDash: async () => {
    set({ loading: true, CustDashError: null }); // Start loading
    try {
        const result = await axios.post(API);
        const { data } = result;
        const { response } = data;
        set({ CustomerDashList:response, CustDashloading: false }); // Update state with fetched data
    } catch (error) {
      set({ CustDashError: error.response?.data?.response, CustDashloading: false }); // Handle errors
    }
  },
}));

export default useCustOrder

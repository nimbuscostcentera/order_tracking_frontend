import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/cust-sampledelv`;
const useSampleDelivery = create((set) => ({
  CustSampleDeliverSuccess: null,
  isCustSampleDeliverLoading: false,
  CustSampleDeliverError: null,

  UpdateCustSampleDelivered: async (userdata) => {
    set({ isCustSampleDeliverLoading: true, CustSampleDeliverError: null }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      set({
        CustSampleDeliverSuccess: response,
        isCustSampleDeliverLoading: false,
      }); // Update state with fetched data
    } catch (error) {
      set({
        CustSampleDeliverError: error?.response?.data?.response,
        isCustSampleDeliverLoading: false,
      }); // Handle errors
    }
  },
  ClearCustSampleDelivered: () => {
    set({
      CustSampleDeliverSuccess: null,
      isCustSampleDeliverLoading: false,
      CustSampleDeliverError: null,
    })
  }
}));

export default useSampleDelivery;

import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/report-routes/regular-orderprint`;
const useRegularOrderSummary = create((set) => ({
  RegularOrderSummaryList: null,
  isRegularOrderSummaryLoading: false,
  RegularOrderSummaryError: null,

  FetchRegularOrderSummary: async (userdata) => {
    set({
      isRegularOrderSummaryLoading: true,
      RegularOrderSummaryError: null,
      RegularOrderSummaryList: null,
    }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      console.log(response);
      set({
        RegularOrderSummaryList: response,
        isRegularOrderSummaryLoading: false,
      }); // Update state with fetched data
    } catch (error) {
      console.log(error);
      set({
        RegularOrderSummaryError: error?.response?.data?.response,
        isRegularOrderSummaryLoading: false,
        RegularOrderSummaryList: null,
      }); // Handle errors
    } finally {
      set({ isRegularOrderSummaryLoading: false });
    }
  },
  ClearSummeryRegularOrder: () => {
    set({
      RegularOrderSummaryList: null,
      isRegularOrderSummaryLoading: false,
      RegularOrderSummaryError: null,
    });
  }
}));

export default useRegularOrderSummary;

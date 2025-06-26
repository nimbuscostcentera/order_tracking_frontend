import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/regular-orderadd`;
const usePlaceRegularOrder = create((set) => ({
  RegularOrderSuccess: "",
  isRegularOrderLoading: false,
  RegularOrderError: null,

  PlaceRegularOrder: async (userdata) => {
    set({ isRegularOrderLoading: true, RegularOrderError: null }); // Start loading
    try {
      const result = await axios.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ RegularOrderSuccess: response}); // Update RegularOrder with fetched data
    } catch (error) {
      set({
        RegularOrderError: error?.response?.data?.response
      }); // Handle errors
    }
    set({
      isRegularOrderLoading: false,
    }); // Handle errors
  },
  ClearStatePlaceOrder: async () => {
    set({
      RegularOrderSuccess: "",
      isRegularOrderLoading: false,
      RegularOrderError: null,
    });
  },
}));

export default usePlaceRegularOrder;

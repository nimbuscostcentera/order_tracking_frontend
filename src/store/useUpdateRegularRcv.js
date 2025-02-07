import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/regular-orderrcv`;
const useUpdateRegularRcv = create((set) => ({
  UpdateRegularRcvSuccess: null,
  isUpdateRegularRcvloading: false,
  UpdateRegularRcvError: null,

  UpdateRegularRcv: async (userdata) => {
    set({ isUpdateRegularRcvloading: true, UpdateRegularRcvError: null }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      set({ UpdateRegularRcvSuccess: response, isUpdateRegularRcvloading: false }); // Update state with fetched data
    } catch (error) {
      set({ UpdateRegularRcvError: error.message }); // Handle errors
    }
    set({ isUpdateRegularRcvloading: false }); // stop loading
  },
  clearStateRegularRcv: () =>
    set({
      UpdateRegularRcvSuccess: null,
      isUpdateRegularRcvloading: false,
      UpdateRegularRcvError: null,
    }),
}));

export default useUpdateRegularRcv;

import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/report-routes/regular-orderbywt`;
const useFetchRegularByWt = create((set) => ({
  RegularByWtList: [],
  isRegularByWtloading: false,
  RegularByWtError: null,

  fetchRegularByWtMaster: async (userdata) => {
    set({ isRegularByWtloading: true, RegularByWtError: null }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      set({ RegularByWtList: response, isRegularByWtloading: false }); // Update state with fetched data
    } catch (error) {
      set({ RegularByWtError: error.message }); // Handle errors
    }
    set({ isRegularByWtloading: false }); // stop loading
  },
}));

export default useFetchRegularByWt;

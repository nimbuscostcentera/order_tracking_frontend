import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/report-routes/regular-ordershow`;
const useRegularFetch = create((set) => ({
  RegularList: [],
  isRegularloading: false,
  RegularError: null,

  fetchRegularMaster: async (userdata) => {
    set({ isRegularloading: true, RegularError: null }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      set({ RegularList: response, isRegularloading: false }); // Update state with fetched data
    } catch (error) {
      set({ RegularError: error.message }); // Handle errors
    }
    set({ isRegularloading: false }); // stop loading
  },
}));

export default useRegularFetch;

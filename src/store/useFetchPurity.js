import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/Purity-list`;
const useFetchPurity = create((set) => ({
  PurityList: [],
  isPurityLoading: false,
  PurityError: null,

  fetchPurityMaster: async (userdata) => {
    set({ isPurityLoading: true, PurityError: null }); // Start loading
    try {
        const result = await axios.post(API, userdata);
        const { data } = result;
        const { response } = data;
        set({ PurityList:response, isPurityLoading: false }); // Update state with fetched data
    } catch (error) {
      set({ PurityError: error.message, isPurityLoading: false }); // Handle errors
    }
  },
}));

export default useFetchPurity;

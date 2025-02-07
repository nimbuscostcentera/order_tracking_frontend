import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/Purity-list`;
const useFetchPurity= create((set) => ({
 PurityList: [],
  loading: false,
  error: null,

  fetchPurityMaster: async (userdata) => {
    set({ loading: true, error: null }); // Start loading
    try {
        const result = await axios.post(API, userdata);
        const { data } = result;
        const { response } = data;
        set({PurityList:response, loading: false }); // Update state with fetched data
    } catch (error) {
      set({ error: error.message, loading: false }); // Handle errors
    }
  },
}));

export default useFetchPurity;

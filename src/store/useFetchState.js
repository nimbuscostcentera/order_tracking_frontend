import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/State-list`;
const useFetchState = create((set) => ({
  StateList: [],
  isStateLoading: false,
  StateError: null,

  fetchStateMaster: async (userdata) => {
    set({ isStateLoading: true, StateError: null }); // Start loading
    try {
        const result = await axios.post(API, userdata);
        const { data } = result;
        const { response } = data;
        set({ StateList:response, isStateLoading: false }); // Update state with fetched data
    } catch (error) {
      set({ StateError: error.message, isStateLoading: false }); // Handle errors
    }
  },
}));

export default useFetchState;

import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/cust-orderrcv`;
const usekarigarReceive = create((set) => ({
  kReceiveSuccess:null,
  iskReceiveLoading: false,
  kReceiveError: null,

  UpdateKarigarReceive: async (userdata) => {
    set({ iskReceiveLoading: true, kReceiveError: null }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      set({ kReceiveSuccess: response, iskReceiveLoading: false }); // Update state with fetched data
    } catch (error) {
      set({ kReceiveError: error.response?.data?.response }); // Handle errors
    }
    set({ iskReceiveLoading: false }); // stop loading
  },
  ClearKarigarReceive: () =>{
    set({ kReceiveSuccess:null, iskReceiveLoading: false, kReceiveError: null });
  }
}));

export default usekarigarReceive;

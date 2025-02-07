import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/report-routes/party-ordershow`;
const usePartyOrder = create((set) => ({
  PartyOrder: [],
  isPartyOrderloading: false,
  PartyOrderError: null,

  fetchPartyOrder: async (userdata) => {
    set({ isPartyOrderloading: true, PartyOrderError: null }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      set({ PartyOrder: response, isPartyOrderloading: false }); // Update state with fetched data
    } catch (error) {
      set({ PartyOrderError: error.message }); // Handle errors
    }
    set({ isPartyOrderloading: false }); // stop loading
  },
  ClearStatePlaceOrder: async () => {
    set({
      PartyOrder: [],
      isPartyOrderloading: false,
      PartyOrderError: null,
    });
  },
}));

export default usePartyOrder;

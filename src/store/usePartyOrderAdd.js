import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/party-orderadd`;
const usePlacePartyOrder = create((set) => ({
  PartyOrderSuccess: "",
  isPartyOrderLoading: false,
  PartyOrderError: null,

  PlacePartyOrder: async (userdata) => {
    set({ isPartyOrderLoading: true, PartyOrderError: null }); // Start loading
    try {
      const result = await axios.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ PartyOrderSuccess: response, isPartyOrderLoading: false }); // Update PartyOrder with fetched data
    } catch (error) {
      set({
        PartyOrderError: error?.response?.data?.response,
        isPartyOrderLoading: false,
      }); // Handle errors
    }
  },
  ClearStatePlaceOrder: async () => {
    set({
      PartyOrderSuccess: "",
      isPartyOrderLoading: false,
      PartyOrderError: null,
    });
  },
}));

export default usePlacePartyOrder;

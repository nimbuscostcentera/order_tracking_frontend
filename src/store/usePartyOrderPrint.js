import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/report-routes/party-orderbywt`;
const usePartyPrint = create((set) => ({
  PartyPrintList: [],
  isPartyPrintLoading: false,
  PartyPrintError: null,

  PlacePartyPrint: async (userdata) => {
    set({ isPartyPrintLoading: true, PartyPrintError: null }); // Start loading
    try {
      const result = await axios.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ PartyPrintList: response, isPartyPrintLoading: false }); // Update PartyPrint with fetched data
    } catch (error) {
      set({
        PartyPrintError: error?.response?.data?.response,
        isPartyPrintLoading: false,
      }); // Handle errors
    }
  },
  ClearStatePlaceOrder: async () => {
    set({
      PartyPrintList: [],
      isPartyPrintLoading: false,
      PartyPrintError: null,
    });
  },
}));

export default usePartyPrint;

import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/report-routes/party-ordershow`;
const usePartyFetch = create((set) => ({
  PartyList: [],
  isPartyloading: false,
  PartyError: null,

  fetchPartyMaster: async (userdata) => {
    set({ isPartyloading: true, PartyError: null }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      set({ PartyList: response, isPartyloading: false }); // Update state with fetched data
    } catch (error) {
      set({ PartyError: error.message }); // Handle errors
    }
    set({ isPartyloading: false }); // stop loading
  },
  clearPartyOrderList: () => {
    set({ PartyList: [], isPartyloading: false, PartyError: null });
  }
}));

export default usePartyFetch;

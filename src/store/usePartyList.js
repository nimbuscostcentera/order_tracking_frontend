import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/party-list`;
const useFetchParty = create((set) => ({
  PartyList: [],
  loading: false,
  error: null,

  fetchPartyData: async (userdata) => {
    set({ loading: true, error: null }); // Start loading
    try {
        const result = await axios.post(API, userdata);
        const { data } = result;
        const { response } = data;
        set({ PartyList:response, loading: false }); // Update state with fetched data
    } catch (error) {
      set({ error: error.message, loading: false }); // Handle errors
    }
  },
}));

export default useFetchParty

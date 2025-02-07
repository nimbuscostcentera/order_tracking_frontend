import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/party-orderrcv`;
const usePartyReceive = create((set) => ({
 PartyReceiveSuccess:"",
  isPartyReceiveLoading: false,
 PartyReceiveError: null,

  InsertReceive: async (userdata) => {
    set({ isPartyReceiveLoading: true,PartyReceiveError: null,PartyReceiveSuccess:null}); // Start loading
    try {
        const { data } =await axios.post(API, userdata);
        const { response } = data;
        console.log(response,"partyreceive")
        set({PartyReceiveSuccess:response, isPartyReceiveLoading: false }); // Update state with fetched data
    } catch (error) {
        console.log(error);
      set({PartyReceiveError: error?.response?.data?.response, isPartyReceiveLoading: false ,PartyReceiveSuccess:null}); // Handle errors
    }
  },
  ClearAddParty: () => {
    set({
        PartyReceiveSuccess:null,
         isPartyReceiveLoading: false,
        PartyReceiveError: null,})
  }
}));

export default usePartyReceive;

import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/party-add`;
const useAddParty = create((set) => ({
 PartyRegSuccess:null,
  isPartyRegLoading: false,
 PartyRegError: null,

  InsertParty: async (userdata) => {
    set({ isPartyRegLoading: true,PartyRegError: null,PartyRegSuccess:null}); // Start loading
    try {
        const { data } =await axios.post(API, userdata);
        const { response } = data;
        
        
        set({PartyRegSuccess:response, isPartyRegLoading: false }); // Update state with fetched data
    } catch (error) {
        console.log(error);
      set({PartyRegError: error?.response?.data?.response, isPartyRegLoading: false ,PartyRegSuccess:null}); // Handle errors
    }
  },
  ClearAddParty: () => {
    set({
        PartyRegSuccess:null,
         isPartyRegLoading: false,
        PartyRegError: null,})
  }
}));

export default useAddParty;

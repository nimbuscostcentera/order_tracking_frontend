import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/party-edit`;
const useEditParty = create((set) => ({
  PartyEditSuccess:null,
  isPartyEditLoading: false,
  PartyEditError: null,

  EditPartyFunc: async (userdata) => {
    set({ isPartyEditLoading: true, PartyEditError: null, PartyEditSuccess:null}); // Start loading
    try {
        const { data } =await axios.post(API, userdata);
        const { response } = data;
        set({ PartyEditSuccess:response, isPartyEditLoading: false,PartyEditError:null}); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        PartyEditError: error?.response?.data?.response,
        isPartyEditLoading: false,
        PartyEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditParty: () => {
    set({PartyEditSuccess:null,
  isPartyEditLoading: false,
  PartyEditError: null,})
  }
}));

export default useEditParty;

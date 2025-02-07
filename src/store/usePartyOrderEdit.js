import { create } from "zustand";
import axios from "axios";

const EDIT_API = `${process.env.REACT_APP_BASEURL}/transaction-routes/party-ordermodify`;

const usePartyOrderEdit = create((set) => ({
  PartyOrderEditSuccess: null,
  isPartyOrderEditLoading: false,
  PartyOrderEditError: null,

  UpdatePartyOrder: async (userdata) => {
    set({ isPartyOrderEditLoading: true, PartyOrderEditError: null });
    try {
      const { data } = await axios.post(EDIT_API, userdata);
      const { response } = data;
      set({
        PartyOrderEditSuccess: response,
        isPartyOrderEditLoading: false,
      });
    } catch (error) {
      set({ PartyOrderEditError: error.message });
    }
    set({ isPartyOrderEditLoading: false });
  },

  editPartyOrder: async (orderData) => {
    set({ isPartyOrderEditLoading: true, PartyOrderEditError: null });
    try {
      const { data } = await axios.post(EDIT_API, orderData);
      const { response } = data;
      set({
        PartyOrderEditSuccess: response,
        isPartyOrderEditLoading: false,
      });
    } catch (error) {
      set({ PartyOrderEditError: error.message });
    }
    set({ isPartyOrderEditLoading: false });
  },

  ClearStatePartyOrderEdit: () => {
    set({
      PartyOrderEditSuccess: null,
      isPartyOrderEditLoading: false,
      PartyOrderEditError: null,
    });
  },
}));

export default usePartyOrderEdit;

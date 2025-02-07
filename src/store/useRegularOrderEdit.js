import { create } from "zustand";
import axios from "axios";

const EDIT_API = `${process.env.REACT_APP_BASEURL}/transaction-routes/regular-ordermodify`;

const useRegularOrderEdit = create((set) => ({
  RegularOrderEditSuccess: null,
  isRegularOrderEditLoading: false,
  RegularOrderEditError: null,

  UpdateRegularOrder: async (userdata) => {
    set({ isRegularOrderEditLoading: true, RegularOrderEditError: null });
    try {
      const { data } = await axios.post(EDIT_API, userdata);
      const { response } = data;
      set({
        RegularOrderEditSuccess: response,
        isRegularOrderEditLoading: false,
      });
    } catch (error) {
      set({ RegularOrderEditError: error.message });
    }
    set({ isRegularOrderEditLoading: false });
  },

  editRegularOrder: async (orderData) => {
    set({ isRegularOrderEditLoading: true, RegularOrderEditError: null });
    try {
      const { data } = await axios.post(EDIT_API, orderData);
      const { response } = data;
      set({
        RegularOrderEditSuccess: response,
        isRegularOrderEditLoading: false,
      });
    } catch (error) {
      set({ RegularOrderEditError: error.message });
    }
    set({ isRegularOrderEditLoading: false });
  },

  ClearStateRegularOrderEdit: () => {
    set({
      RegularOrderEditSuccess: null,
      isRegularOrderEditLoading: false,
      RegularOrderEditError: null,
    });
  },
}));

export default useRegularOrderEdit;

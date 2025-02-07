import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/artisan-add`;
const useAddArtisan = create((set) => ({
  KarigarRegSuccess: null,
  isKarigarRegLoading: false,
  KarigarRegError: null,

  InsertKarigar: async (userdata) => {
    set({
      isKarigarRegLoading: true,
      KarigarRegError: null,
      KarigarRegSuccess: null,
    }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      console.log(response);
      set({ KarigarRegSuccess: response, isKarigarRegLoading: false }); // Update state with fetched data
    } catch (error) {
      console.log(error);
      set({
        KarigarRegError: error?.response?.data?.response,
        isKarigarRegLoading: false,
        KarigarRegSuccess: null,
      }); // Handle errors
    } finally {
      set({ isKarigarRegLoading: false });
    }
  },
  ClearStateArtisanAdd: () => {
    set({
      KarigarRegSuccess: null,
      isKarigarRegLoading: false,
      KarigarRegError: null,
    });
  },
}));

export default useAddArtisan;

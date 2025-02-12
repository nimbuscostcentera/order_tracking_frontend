import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/report-routes/regular-orderbyartwt`;
const useArtisanWiseWt = create((set) => ({
  ArtisanWiseWtList: [],
  isArtisanWiseWtLoading: false,
  isArtisanWiseWtError: null,

  fetchArtisanWiseWt: async (userdata) => {
    set({ isArtisanWiseWtLoading: true, isArtisanWiseWtError: null }); // Start loading
    try {
      const result = await axios.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ ArtisanWiseWtList: response, isArtisanWiseWtLoading: false }); // Update state with fetched data
    } catch (error) {
      set({
        isArtisanWiseWtError: error.response?.data?.response,
        isArtisanWiseWtLoading: false,
      }); // Handle errors
    }
  },
}));

export default useArtisanWiseWt;

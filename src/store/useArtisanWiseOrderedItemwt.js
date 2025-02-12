import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/report-routes/regular-orderbyartwtitemlist`;
const useArtisanWiseOrderedItemwt = create((set) => ({
  ArtwtItem: [],
  isArtwtItemLoading: false,
  isArtwtItemError: null,

  fetchArtisanWiseOrderedItemwt: async (userdata) => {
    set({ isArtwtItemLoading: true, isArtwtItemError: null }); // Start loading
    try {
      const result = await axios.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ ArtwtItem: response, isArtwtItemLoading: false }); // Update state with fetched data
    } catch (error) {
      set({ isArtwtItemError: error.message, isArtwtItemLoading: false }); // Handle errors
    }
  },
}));

export default useArtisanWiseOrderedItemwt;

import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/Item-listByArtisan`;
const useFetchArtisanwiseItem = create((set) => ({
  ArtisanwiseItemList: [],
  isArtisanwiseItemLoading: false,
  ArtisanwiseItemError: null,

  fetchArtisanwiseItemMaster: async (userdata) => {
    set({ isArtisanwiseItemLoading: true, ArtisanwiseItemError: null }); // Start loading
    try {
      const result = await axios.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ ArtisanwiseItemList: response, isArtisanwiseItemLoading: false }); // Update state with fetched data
    } catch (error) {
      set({ ArtisanwiseItemError: error.message, isArtisanwiseItemLoading: false }); // Handle errors
    }
  },
}));

export default useFetchArtisanwiseItem;

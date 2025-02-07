import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/Karigar-show`;
const useFetchArtisan = create((set) => ({
  ArtisanList: [],
  isArtisanLoading: false,
  ArtisanError: null,

  fetchArtisanMaster: async (userdata) => {
    set({ isArtisanLoading: true, ArtisanError: null }); // Start loading
    try {
      const result = await axios.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ ArtisanList: response, isArtisanLoading: false }); // Update state with fetched data
    } catch (error) {
      set({ ArtisanError: error.message, isArtisanLoading: false }); // Handle errors
    }
  },
}));

export default useFetchArtisan;

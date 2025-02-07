import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/artisan-edit`;
const useEditArtisan = create((set) => ({
  ArtisanEditSuccess: null,
  isArtisanEditLoading: false,
  ArtisanEditError: null,

  EditArtisanFunc: async (userdata) => {
    set({
      isArtisanEditLoading: true,
      ArtisanEditError: null,
      ArtisanEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      // console.log(response);
      set({
        ArtisanEditSuccess: response,
        isArtisanEditLoading: false,
        ArtisanEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      console.log(error);
      set({
        ArtisanEditError: error?.response?.data?.response,
        isArtisanEditLoading: false,
        ArtisanEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditArtisan: () => {
    set({
      ArtisanEditSuccess: null,
      isArtisanEditLoading: false,
      ArtisanEditError: null,
    });
  },
}));

export default useEditArtisan;

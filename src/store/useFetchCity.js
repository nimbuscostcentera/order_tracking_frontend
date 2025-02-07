import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/City-list`;
const useFetchCity= create((set) => ({
  CityList: [],
  isCityLoading: false,
  CityError: null,

  fetchCityMaster: async (userdata) => {
    set({ isCityLoading: true, CityError: null }); // Start loading
    try {
        const result = await axios.post(API, userdata);
        const { data } = result;
        const { response } = data;
        set({ CityList:response, isCityLoading: false }); // Update state with fetched data
    } catch (error) {
      set({ CityError: error.message, isCityLoading: false }); // Handle errors
    }
  },
}));

export default useFetchCity;

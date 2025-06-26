import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/City-add`;
const useAddCity = create((set) => ({
  AddCitySuccess:null,
  isAddCityLoading: false,
  AddCityError: null,

  InsertCity: async (citydata) => {
    set({ isAddCityLoading: true, AddCityError: null, AddCitySuccess:null}); // Start loading
    try {
        const { data } =await axios.post(API, citydata);
        const { response } = data;
        set({ AddCitySuccess:response, isAddCityLoading: false }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        AddCityError: error?.response?.data?.response,
        isAddCityLoading: false,
        AddCitySuccess: null,
      }); // Handle errors
    }
  },
  ClearStateCityAdd: () => {
  set({AddCitySuccess:null,
  isAddCityLoading: false,
  AddCityError: null})
  }
}));

export default useAddCity;

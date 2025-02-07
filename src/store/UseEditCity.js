import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/City-edit`;
const useEditCity = create((set) => ({
  CityEditSuccess:null,
  isCityEditLoading: false,
  CityEditError: null,

  EditCityFunc: async (userdata) => {
    console.log(userdata,"city edit")
    set({ isCityEditLoading: true, CityEditError: null, CityEditSuccess:null}); // Start loading
    try {
        const { data } =await axios.post(API, userdata);
        const { response } = data;
        set({ CityEditSuccess:response, isCityEditLoading: false,CityEditError:null}); // Update state with fetched data
    } catch (error) {
        console.log(error);
      set({ CityEditError: error?.response?.data?.response, isCityEditLoading: false ,CityEditSuccess:null}); // Handle errors
    }
  },
  ClearStateEditCity: () => {
    set({CityEditSuccess:null,
  isCityEditLoading: false,
  CityEditError: null,})
  }
}));

export default useEditCity;

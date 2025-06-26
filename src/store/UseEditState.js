import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/State-edit`;
const useEditState = create((set) => ({
  StateEditSuccess:null,
  isStateEditLoading: false,
  StateEditError: null,

  EditStateFunc: async (userdata) => {
    //console.log(userdata,"city edit")
    set({
      isStateEditLoading: true,
      StateEditError: null,
      StateEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      set({
        StateEditSuccess: response,
        isStateEditLoading: false,
        StateEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        StateEditError: error?.response?.data?.response,
        isStateEditLoading: false,
        StateEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditState: () => {
    set({StateEditSuccess:null,
  isStateEditLoading: false,
  StateEditError: null,})
  }
}));

export default useEditState;

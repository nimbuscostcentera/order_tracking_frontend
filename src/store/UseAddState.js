import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/State-add`;
const useAddState = create((set) => ({
  AddStateSuccess:null,
  isAddStateLoading: false,
  AddStateError: null,

  InsertState: async (statedata) => {
    set({ isAddStateLoading: true, AddStateError: null, AddStateSuccess:null}); // Start loading
    try {
        const { data } =await axios.post(API, statedata);
        const { response } = data;
        
        
        set({ AddStateSuccess:response, isAddStateLoading: false }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        AddStateError: error?.response?.data?.response,
        isAddStateLoading: false,
        AddStateSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateAdd: () => {
    set({ AddStateSuccess:null,
  isAddStateLoading: false,
  AddStateError: null,})
  }
}));

export default useAddState;

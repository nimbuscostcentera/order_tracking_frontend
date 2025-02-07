import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/Item-list`;
const useFetchItem = create((set) => ({
  ItemList: [],
  isItemLoading: false,
  ItemError: null,

  fetchItemMaster: async (userdata) => {
    set({ isItemLoading: true, ItemError: null }); // Start loading
    try {
        const result = await axios.post(API, userdata);
        const { data } = result;
        const { response } = data;
        set({ ItemList:response, isItemLoading: false }); // Update state with fetched data
    } catch (error) {
      set({ ItemError: error.message, isItemLoading: false }); // Handle errors
    }
  },
}));

export default useFetchItem

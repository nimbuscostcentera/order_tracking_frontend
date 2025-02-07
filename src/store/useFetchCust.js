import { create } from 'zustand';
import axios from 'axios';
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/Customer-list`;
const useFetchCust = create((set) => ({
  CustomerList: [],
  isLoadingCustList: false,
  errorCustList: null,

  fetchCustomrData: async (userdata) => {
    set({ isLoadingCustList: true, error: null }); // Start isLoadingCustList
    try {
        const result = await axios.post(API, userdata);
        const { data } = result;
        const { response } = data;
        set({ CustomerList:response, isLoadingCustList: false }); // Update state with fetched data
    } catch (error) {
      set({ errorCustList: error.message, isLoadingCustList: false }); // Handle errors
    }
  },
}));

export default useFetchCust;

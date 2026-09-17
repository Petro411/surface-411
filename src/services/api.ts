import axios from "axios";


const baseApi = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_API_URL : "http://localhost:3000/api",
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});



// baseApi.interceptors.request.use(
//   (config) => {
//     let token = null;

//     if (typeof window !== "undefined") {
//       token = getItem("token");
//     }

//     if (!token) {
//       const cookies = parseCookies();
//       console.log(cookies)
//       token = cookies.token;
//     }

//     if (token && config.headers) {
//       config.headers.Authorization = `${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error("Axios error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const endpoints = {
  login: "/auth/login",
  signup: "/auth/sign-up",
  lookup: "/auth/lookup",
  google: "/auth/google",
  checkout: "/stripe/checkout",
  portal: "/stripe/portal",
  logout: "/auth/logout",
  updatePassword: "/auth/update-password",
  setNewPassword: "/auth/new-password",
  getOtp: "/auth/get-otp",
  verifyOtp: "/auth/verify-otp",
  queryOwners: "/owners/query-owners",
  ownerDetails: "/owners",
  getOwnerIds:"/owners/get-owners-ids",
  getFaqs: "/faqs",
  getLocations: "/locations",
  contact:"/contact",
  getPage:"/pages/get-page",
  registerEmail:"/register-email",
  getCountiesByState:"/get-counties-by-state",
  getOwnersByCounty:"/owners/query-by-county",
  getPlans:"/stripe/plans",
    createPayPalOrder: "/paypal/create-order",
  capturePayPalOrder: "/paypal/capture-order",
  updateDownloadLimit: "/owners/download-list",
  locationsList:"/locations-list"
}

export default baseApi;

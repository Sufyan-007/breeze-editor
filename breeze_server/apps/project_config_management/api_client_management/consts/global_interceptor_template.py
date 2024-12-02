GLOBAL_INTERCEPTOR_CODE = """
import axios from "axios";
export const defaultResponseInterceptor = (response) => {
  //{DEFAULT_RESPONSE_INTERCEPTOR}
  console.log("Global response");

  return response;
};

export const defaultRequestInterceptor = (request) => {
    //{DEFAULT_REQUEST_INTERCEPTOR}
  console.log("Global request");

  return request;
};

export const defaultRequestErrorInterceptor = (err) => {
    //{DEFAULT_REQUEST_ERROR_INTERCEPTOR}
  return Promise.reject(err);
};

export const defaultResponseErrorInterceptor = (err) => {
    //{DEFAULT_RESPONSE_ERROR_INTERCEPTOR}
  return Promise.reject(err);
};

export const axiosInstance = axios.create({
  //{BASE_URL_CODE}
  baseURL: import.meta.env.VITE_baseurl,
});

axiosInstance.interceptors.request.use(
  defaultRequestInterceptor,
  defaultRequestErrorInterceptor
);
axiosInstance.interceptors.response.use(
  defaultResponseInterceptor,
  defaultResponseErrorInterceptor
);

export const duplicateInstance = (instance) => {
  // console.log(instance);
  const newInstance = axios.create(instance.defaults);

  
  instance.interceptors.request.forEach((interceptor) => {
    newInstance.interceptors.request.use(
      interceptor.fulfilled,
      interceptor.rejected
    );
  });
  instance.interceptors.response.forEach((interceptor) => {
    newInstance.interceptors.response.use(
      interceptor.fulfilled,
      interceptor.rejected  
    );
  });
  return newInstance;
};

"""

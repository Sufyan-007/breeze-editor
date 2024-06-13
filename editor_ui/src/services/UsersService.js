// import axios from "axios";

// export const createUser_raw = async ({ id, name, email, age }) => {
//   const body = {
//     id: id,
//     name: name,
//     email: email,
//     age: age,
//   };

//   const api = axios.create({
//     headers: {
//       "Content-Type": "application/json",
//     },
//     method: "post",
//   });

//   // Add a response interceptor
//   api.interceptors.response.use(
//     (response) => {
//       // block to handle success case
//       console.log(response, "raw");
//       return response;
//     },
//     function (error) {
//       // block to handle error case
//       const originalRequest = error.config;

//       if (error.response.status === 200) {
//         return Promise.reject("successful operation");
//       }
//       console.error(error, "error from interceptors");
//       return Promise.reject(error);
//     }
//   );

//   try {
//     // Make a POST request to create a user
//     const resp = await api.post("http://localhost:4000/user", body);
//     return resp;
//   } catch (error) {
//     console.error(error, "from api");
//     throw error;
//   }
// };

// export const createUser_formdata = async (id, name, email, age, file) => {
//   console.log(id, name, email, age, file, "parameters");
//   let body = new FormData();
//   body.append("id", id);
//   body.append("name", name);
//   body.append("email", email);
//   body.append("age", age);
//   body.append("file", file);

//   const api = axios.create({
//     baseURL: "http://localhost:4000",
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

//   // Add a response interceptor
//   api.interceptors.response.use(
//     (response) => {
//       // block to handle success case
//       console.log("response in use", response);
//       return response;
//     },
//     function (error) {
//       // block to handle error case
//       const originalRequest = error.config;

//       if (error.response.status == 200) {
//         return Promise.reject("successful operation");
//       }

//       return Promise.reject(error);
//     }
//   );
//   try {
//     const response = await axios.post("http://localhost:4000/user", body);
//     console.log("Response:", response);
//     return response.data; 
//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// };

// export const updateUser_raw = async ({ id, updated_data }) => {
//   console.log(id, updated_data, "data ");
//   const api = axios.create({
//     method: "put",

//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const body = {
//     id: id,
//     ...updated_data, // Spread the updated_data object to include its properties
//   };
//   console.log(body, "body");
//   // Add a response interceptor
//   api.interceptors.response.use(
//     (response) => {
//       // block to handle success case
//       return response;
//     },
//     function (error) {
//       // block to handle error case
//       const originalRequest = error.config;

//       if (error.response.status === 200) {
//         return Promise.reject("successful operation");
//       }

//       return Promise.reject(error);
//     }
//   );

//   let resp = await api.put(`http://localhost:4000/user/${id}`, body);

//   return resp;
// };

// export const testBinary_binary = async (binaryData) => {
//   const api = axios.create({
//     method: "put",
//     headers: {
//       "Content-Type": "application/octet-stream",
//     },
//   });

//   // Add a response interceptor
//   api.interceptors.response.use(
//     (response) => {
//       // block to handle success case
//       return response;
//     },
//     function (error) {
//       // block to handle error case
//       const originalRequest = error.config;

//       if (error.response.status === 200) {
//         return Promise.reject("successful operation");
//       }

//       return Promise.reject(error);
//     }
//   );

//  try {
//    const response = await api.put(
//      `http://localhost:4000/test-binary`,
//      binaryData
//    );
//    console.log(response, "response in service");
//    return response;
//  } catch (error) {
//    console.error("Error:", error);
//    throw error;
//  }
// };
import axios from "axios";

export const createUser_raw = async (User) => {
  let reqBody = {
    id: `${User.id}`,
    name: `${User.name}`,
    email: `${User.email}`,
    age: `${User.age}`,
    file: `${User.file}`,
  };
  const api = axios.create({
    // method: "post",
    baseURL: "http://localhost:4000",
    headers: { "content-type": "application/json" },
    // data: reqBody,
  });

  // Add a response interceptor
  api.interceptors.response.use(
    (response) => {
      // block to handle success case
      return response;
    },
    function (error) {
      // block to handle error case
      const originalRequest = error.config;

      if (error.response.status == 200) {
        return Promise.reject("successful operation");
      }

      return Promise.reject(error);
    }
  );

    const config = {
      method: "post",
      url: "/user",
      data: reqBody,
    };

  let resp = await api.request(config);

  return resp;
};

export const createUser_formdata = async (id, name, email, age, file) => {
  let bodyFormData = new FormData();
  bodyFormData.append("id", `${id}`);
  bodyFormData.append("name", `${name}`);
  bodyFormData.append("email", `${email}`);
  bodyFormData.append("age", `${age}`);
  bodyFormData.append("file", `${file}`);
  const api = axios.create({
    method: "post",
    headers: { "content-type": "multipart/form-data" },
    data: bodyFormData,
  });

  // Add a response interceptor
  api.interceptors.response.use(
    (response) => {
      // block to handle success case
      return response;
    },
    function (error) {
      // block to handle error case
      const originalRequest = error.config;

      if (error.response.status == 200) {
        return Promise.reject("successful operation");
      }

      return Promise.reject(error);
    }
  );

  let resp = await api(`http://localhost:4000/user`);

  return resp;
};

export const updateUser_raw = async (User) => {
   console.log(User, "User object");
   let reqBody = {
     id:User.id || "",
     name: `${User.name}` || "",
     email: `${User.email}` || "",
     age: `${User.age}` || 0,
     file: `${User.file}` || null,
   };
  console.log(reqBody,"req body in service");
  const api = axios.create({
    baseURL: "http://localhost:4000",
    headers: { "content-type": "application/json" },
    // data: reqBody,
  });

  // Add a response interceptor
  api.interceptors.response.use(
    (response) => {
      // block to handle success case
      return response;
    },
    function (error) {
      // block to handle error case
      const originalRequest = error.config;

      if (error.response.status == 200) {
        return Promise.reject("successful operation");
      }

      return Promise.reject(error);
    }
  );

  const config={
    method:"put",
    url:`/user/${User.id}`,
    data: reqBody,
  }

  let resp = await api.request(config);

  return resp;
};

export const testBinary_binary = async () => {
  const api = axios.create({
    method: "put",
  });

  // Add a response interceptor
  api.interceptors.response.use(
    (response) => {
      // block to handle success case
      return response;
    },
    function (error) {
      // block to handle error case
      const originalRequest = error.config;

      if (error.response.status == 200) {
        return Promise.reject("successful operation");
      }

      return Promise.reject(error);
    }
  );

  let resp = await api(`http://localhost:4000/test-binary`);

  return resp;
};

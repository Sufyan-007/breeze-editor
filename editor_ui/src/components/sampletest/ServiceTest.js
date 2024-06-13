import React, { useEffect, useState } from "react";
import {
  createUser_raw,
  createUser_formdata,
  updateUser_raw,
  testBinary_binary
} from "../../services/UsersService.js"; // Adjust the import path

function ServiceTest() {
  const [user, setUser] = useState();
  const [error, setError] = useState();
  
  useEffect(() => {
    // const createUser = async () => {
    //   try {
    //     const userData = {
    //       id: 11,
    //       name: "aaaaaa",
    //       email: "v@gmail.com",
    //       age: 23,
    //     };
    //     console.log(userData,"userData");
    //     const response = await createUser_raw(userData);
    //     console.log(response,"response from the api");
    //     setUser(response.data);
    //   } catch (error) {
    //     console.log(error,"error");
    //     setError(error);
    //   }
    // };

    // createUser();
   const updateUser = async () => {
     try {
       const userData = {
         id: 1,
         name: "Updated Name",
         email: "updated@example.com",
         age: 40,
       };
       console.log(userData, "userData");
       const response = await updateUser_raw(userData);
       console.log(response.data, "response from the api");
       setUser(response.data);
     } catch (error) {
       console.log(error, "error");
       setError(error);
     }
   };

   updateUser();

    // const createUserformdata = async() => {

    //   try{
    //     const file = null; 
    //     const response =  await  createUser_formdata(480, "Form Data", "john.doe@example.com", 30,file);
    //     console.log(response,"response in service");
    //     setUser(response.data);
        
    //   }catch(err){
    //     setError(err);
    //     console.log(err,"Error");
    //   }
    // }
    // createUser();
    // createUserformdata();
    // const testBinaryAPI = async() => {
    //    try {
    //     // Create a sample binary data (for example, a Uint8Array)
    //     const binaryData = new Uint8Array([1, 2, 3, 4, 5]);
    //     const response = await testBinary_binary(binaryData);
    //     console.log(response.data);
    //     setUser(response.data);
    //   } catch (error) {
    //     setError(error);
    //   }
    // }

    // testBinaryAPI();
    
  }, []);
  return (
    <div>
      <p>hlo</p>
      {user && <div>User Data: {JSON.stringify(user)}</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

export default ServiceTest;

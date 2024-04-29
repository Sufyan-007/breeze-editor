// import { useRef, useState, useEffect } from "react";
// import ServiceGeneralSetting from "./ServiceGeneralSetting";
// import ServiceLists from "./ServiceList";
// import { fetchYamlApis, fetchPostmanApis } from "../../services/yamlPostmanService";
// export function ServicePage() {
//   const fileInputYAML = useRef(null); // this is created to reference the file input element .
//   const fileInputPostman = useRef(null);
//   const [yamlApis, setYamlApis] = useState({}); // State to store the list of YAML APIs
//   const [yamlUploaded, setYamlUploaded] = useState(false);
//   const [postmanApis, setPostmanApis] = useState({}); //state to store the list of postman collection APis
//   const [postmanUploaded, setPostmanUploaded] = useState(false);
//   // const [tagsList, setTagsList] = useState([]);

//   // useEffect(() => {
//   //   if (yamlUploaded && yamlApis) {
//   //     const tags = getAllTagsFromYamlApis(yamlApis);
//   //     setTagsList(tags);
//   //     // console.log(tags, "tags in use effect");
//   //   }
//   // }, [yamlUploaded, yamlApis]);

//   // function getAllTagsFromYamlApis(yamlApis) {
//   //   if (yamlApis && yamlApis.data) {
//   //     const data = yamlApis.data;
//   //     const tagsList = [];

//   //     for (const dataArray of data) {
//   //       if (Array.isArray(dataArray) && dataArray.length > 0) {
//   //         const item = dataArray[0];

//   //         if (item.tags && Array.isArray(item.tags) && item.tags.length > 0) {
//   //           for (const tag of item.tags) {
//   //             tagsList.push(tag);
//   //           }
//   //         }
//   //       }
//   //     }
//       // console.log(tagsList, "tagsList");
//   //     return tagsList;
//   //   }
//   // }

//   // const allTags = getAllTagsFromYamlApis(yamlApis);
//   // console.log(allTags, "Tags in yaml ");

//   async function fileUpload(file, fileType) {
//     try{
//       const formData = new FormData();
//       formData.append("file", file);

//       let apiFunction;
//       if (fileType === "yaml") {
//         apiFunction = fetchYamlApis;
//       }
//       else if (fileType === "postman"){
//         apiFunction = fetchPostmanApis;
//       }

//       const responseData = await apiFunction(formData);
     
//         if (fileType === "yaml") {
//           setYamlApis(responseData);
//           setYamlUploaded(true);
//         } else if (fileType === "postman") {
//           setPostmanApis(responseData);
//           setPostmanUploaded(true);
//         }

        
//     } catch (error) {
//       alert("Failed to load file, check file syntax");
//       console.error(error);
//     }
//   }

//   function openFileInput(fileType) {
//     if (fileType === "yaml") {
//       fileInputYAML.current.click();

//       setPostmanUploaded(false);
//     } else if (fileType === "postman") {
//       fileInputPostman.current.click();
//       setYamlUploaded(false);
//     }
//   }

//   // const handleCustomButtonClick = () => {
//   //   setYamlUploaded(false);
//   //   setPostmanUploaded(false);
//   // };

//   // console.log(yamlUploaded, "YAML UPLOADED true or false");
//   // console.log(yamlApis, "YAML APIS DATA IN service page ");

//   return (
//     // <Loader loader={loader}>
//     <>
//       <div className="container-fluid d-flex flex-column vh-100  ">
//         <ServiceGeneralSetting
//           openFileInput={openFileInput}
//           fileInputYAML={fileInputYAML}
//           fileInputPostman={fileInputPostman}
//           fileUpload={fileUpload}
//           yamlUploaded={yamlUploaded}
//           // handleCustomButtonClick={handleCustomButtonClick}
//         />
//         <div
//           className="row flex-grow-1 overflow-hidden  "
//           style={{ backgroundColor: "#303033" }}
//         >
//           <div className="col-9 overflow-y-auto h-100 fs-6 text-light">
//             {yamlUploaded && (
//               <div>
//                 <ServiceLists apis={yamlApis} />
//               </div>
//             )}
//             {postmanUploaded && (
//               <div>
//                 <ServiceLists apis={postmanApis} />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default ServicePage;

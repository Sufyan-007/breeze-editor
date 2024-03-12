
import { request } from "../api/request.js"


                export const saveAppConfiguration = async (AppConfigDetails) => {
                    
                    
                    const  apiOptions = { 'method' : 'post', 'url' : '/breeze/config-writer/', 'body' : { 'author' : AppConfigDetails.author, 'defaultComponent' : AppConfigDetails.defaultComponent, 'description' : AppConfigDetails.description, 'name' : AppConfigDetails.name, 'path' : AppConfigDetails.path}} 
                    const resp = await request(apiOptions)
                    return resp
                };
            
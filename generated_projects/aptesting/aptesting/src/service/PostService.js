
import { request } from "../api/request.js"


                export const getPosts = async () => {
                    
                    
                    const  apiOptions = { 'method' : 'get', 'url' : '/posts'} 
                    const resp = await request(apiOptions)
                    return resp
                };
            

                export const createPost = async (PostDetails) => {
                    
                    let validationErrors = [];
                 if(!PostDetails.hasOwnProperty('id')){
                            validationErrors.push("id is required")
                        }
                
 if(!PostDetails.hasOwnProperty('userId')){
                            validationErrors.push("userId is required")
                        }
                
                    if(validationErrors.lengh > 0){
                        return {
                            "error" : true,
                            "message" : validationErrors
                        }
                    }
                
                    
                    const  apiOptions = { 'method' : 'post', 'url' : '/posts', 'body' : { 'body' : PostDetails.body, 'title' : PostDetails.title}} 
                    const resp = await request(apiOptions)
                    return resp
                };
            


                export const getPost = async (postId) => {
                    
                    let validationErrors = [];
                 if(postId == null || postId == ''){
                            validationErrors.push("postId is required")
                        }
                
                    if(validationErrors.lengh > 0){
                        return {
                            "error" : true,
                            "message" : validationErrors
                        }
                    }
                
                    
                    const  apiOptions = { 'method' : 'get', 'url' : '/posts/{postId}', 'path' : { 'postId' : postId}} 
                    const resp = await request(apiOptions)
                    return resp
                };
            

                export const editPost = async (postId) => {
                    
                    let validationErrors = [];
                 if(postId == null || postId == ''){
                            validationErrors.push("postId is required")
                        }
                
                    if(validationErrors.lengh > 0){
                        return {
                            "error" : true,
                            "message" : validationErrors
                        }
                    }
                
                    
                    const  apiOptions = { 'method' : 'put', 'url' : '/posts/{postId}', 'path' : { 'postId' : postId}} 
                    const resp = await request(apiOptions)
                    return resp
                };
            
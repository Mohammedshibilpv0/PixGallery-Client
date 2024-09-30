import { IImageData } from "../../Componets/Home/Home";
import { userType } from "../../types/userType";
import axiosInstance from "../axios";
import  { AxiosError } from "axios";

export const register = async (userData: userType) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }

  }
};

export const login = async (email:string,password:string)=>{
    try{
       const response = await axiosInstance.post('/auth/login',{email,password})
       return response.data
    }catch(err){
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          return axiosError.response.data;
        }
    
    }
}

export const resetPassword = async (userId:string,oldPassword:string,newPassword:string)=>{
    try{
        const response = await axiosInstance.put(`/auth/resetpassword/${userId}`,{oldPassword,newPassword})
        return response.data

    }catch(err){
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          return axiosError.response.data;
        } 
    }
}

export const uploadImage = async (userId:string,imageData:IImageData[])=>{
  try{
    const response = await axiosInstance.post(`/user/addimage/${userId}`,imageData)
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    } 
  }
}


export const getUserGallery = async (userId:string)=>{
  try{

    const response = await axiosInstance.get(`/user/gallery/${userId}`)
    if(response.status==204){
      return response.status
    }
    return response.data

  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    } 
  }
}

export const changePostion = async (updatedImages:any)=>{
  try{

    const response = await axiosInstance.put('/user/image-order',{updatedImages})
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    } 
  }
}

export const editImage = async (id:string,image:string,title:string)=>{
  try{
    const response = await axiosInstance.put('/user/image',{id,image,title})
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    } 
  }
}

  export const deleteImage = async (imageId:string)=>{
    try{
      const response = await axiosInstance.put(`/user/delete-image/${imageId}`)
      return response.data
    }catch(err){
      const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    } 
    }
  }

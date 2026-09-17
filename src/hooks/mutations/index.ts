import baseApi, { endpoints } from "@/services/api";
import { useMutation } from "@tanstack/react-query";


const services = {
    sendMessage:async (payload:any)=>{
        const response = await baseApi.post(endpoints.contact,payload)
        return response.data
    },
    registerNewsLetter:async (payload:any)=>{
        const response = await baseApi.post(endpoints.registerEmail,payload)
        return response.data
    }
}
export const useSendMessage = () =>{
    return useMutation({
        mutationFn:(payload:any)=>services.sendMessage(payload)
    })
}

export const useRegisterNewsLetter = () =>{
    return useMutation({
        mutationFn:(payload:any)=>services.registerNewsLetter(payload)
    })
}
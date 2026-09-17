import baseApi, { endpoints } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { feature } from "topojson-client";
import axios from "axios";


const service = {
    countiesByState: async (state: string) => {
        const response = await baseApi.get(`${endpoints.getCountiesByState}?name=${state}`)
        return response.data
    },
    statesMap: async () => {
        const response = await axios.get('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
        const geo = feature(response.data, response.data?.objects?.states) as any;
        const stateIdMap: Record<string, string> = {};
        for (const feature of geo.features) {
            stateIdMap[feature.id] = feature.properties.name;
        }
        return geo
    },
    getOwnersByCounty:async({
        state,
        county,
        page,
        limit
    }:{
        state:string,
        county:string,
        page:number,
        limit:number
    })=>{
        const response = await baseApi.get(
            `${endpoints.getOwnersByCounty}?county=${county}&state=${state}&page=${page}&limit=${limit}`
          );
          return response.data
    }
}

export const useCountiesByState = (state: string) => {
    return useQuery({
        queryKey: [`counties-by-state-${state || ""}`],
        queryFn: () => service.countiesByState(state),
        staleTime: 600000
    })
}

export const useStatesMap = () => {
    return useQuery({
        queryKey: ['states-map'],
        queryFn: () => service.statesMap(),
        staleTime: 3.6e+6
    })
}

export const useOwnersByCounty =(params:{
        state:string,
        county:string,
        page:number,
        limit:number
    })=>{
    return useQuery({
        queryKey:[`owners-in-${params?.state||""}-${params?.county}||""`],
        queryFn:()=>service.getOwnersByCounty(params)
    })
}
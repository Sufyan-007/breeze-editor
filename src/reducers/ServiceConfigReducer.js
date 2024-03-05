import { createSlice} from '@reduxjs/toolkit'

export const serviceConfigSlice = createSlice({
    name:"serviceConfig",
    initialState:{},
    reducers:{

        setServiceConfig:(state,action)=>{
            return action.payload
        }
    }
})

export default serviceConfigSlice.reducer;
export const {  setServiceConfig} = serviceConfigSlice.actions
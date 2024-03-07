import { createSlice} from '@reduxjs/toolkit'

export const routerConfigSlice = createSlice({
    name:"routerConfig",
    initialState:{},
    reducers:{

        setRouterConfig:(state,action)=>{
            return action.payload
        }
    }
})

export default routerConfigSlice.reducer;
export const {  setRouterConfig} = routerConfigSlice.actions
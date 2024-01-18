import { createSlice} from '@reduxjs/toolkit'

export const configSlice = createSlice({
    name:"config",
    initialState:{},
    reducers:{
        setComponent:(state,action)=>{
            const componentName= action.payload.componentName
            const value= action.payload.value
            state[componentName] = value
        },
        setConfig:(state,action)=>{
            return action.payload
        }
    }
})

export default configSlice.reducer;
export const { setComponent, setConfig} = configSlice.actions
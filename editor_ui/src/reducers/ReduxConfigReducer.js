import { createSlice} from '@reduxjs/toolkit'

export const reduxConfigSlice = createSlice({
    name:"reduxConfig",
    initialState:{reducerConfig:{},reduxStoreConfig:{}},
    reducers:{

        setReducerConfig:(state,action)=>{
            state["reducerConfig"]= action.payload;
        },
        setReduxStoreConfig:(state,action)=>{
            state["reduxStoreConfig"]= action.payload;
        }
    }
})

export default reduxConfigSlice.reducer;
export const {  setReducerConfig,setReduxStoreConfig} = reduxConfigSlice.actions
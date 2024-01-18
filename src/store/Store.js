import configSlice  from "../reducers/ConfigReducer";
import {configureStore} from "@reduxjs/toolkit"

export default configureStore({
    reducer:{
        config:configSlice
    }
})
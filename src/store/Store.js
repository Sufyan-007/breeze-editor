import configSlice  from "../reducers/ConfigReducer";
import {configureStore} from "@reduxjs/toolkit"
import routerConfigSlice from "../reducers/RouterConfigReducer";

export default configureStore({
    reducer:{
        config:configSlice,
        routerConfig:routerConfigSlice
    }
})
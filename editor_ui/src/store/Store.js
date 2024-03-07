import configSlice  from "../reducers/ConfigReducer";
import {configureStore} from "@reduxjs/toolkit"
import routerConfigSlice from "../reducers/RouterConfigReducer";
import reduxConfigSlice  from "../reducers/ReduxConfigReducer";

export default configureStore({
    reducer:{
        config:configSlice,
        routerConfig:routerConfigSlice,
        reduxConfig:reduxConfigSlice
    }
})
MODULE_INTERCEPTOR_CODE = """import { axiosInstance, duplicateInstance } from '../interceptors';
{AUTH_INTERCEPTORS_CODE}
{AUTH_ERROR_INTERCEPTORS_CODE}
export const moduleInstance = duplicateInstance(axiosInstance);
"""

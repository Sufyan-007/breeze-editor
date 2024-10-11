import path from "path";

export const INDEX_FILE_NAME: string = 'index.json';
export const DIRECTORY_PATH: string = "third_party_package_parser";
let rootParentDir = path.dirname(path.dirname(process.cwd()))
export const GENERATED_PROJECTS: string = `${rootParentDir}`+"/generated_projects";
export const CONFIG_PATH: string = "breezeui/configurations";
export const CUSTOMIZED_PROJ_CONFIG:string = "customized_proj_config"
export const UPLOADED_ZIP_DIR:string = "extracted_zip_files"

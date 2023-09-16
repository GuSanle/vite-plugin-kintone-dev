declare module "kintone-types" {
  export type Type = "DESKTOP" | "MOBILE" | "DESKTOP_CSS" | "MOBILE_CSS";

  export type TypeInput = {
    outputName?: string;
  };

  export interface JsList {
    DESKTOP: string[];
    MOBILE: string[];
    DESKTOP_CSS: string[];
    MOBILE_CSS: string[];
  }

  export interface EnvSetting {
    VITE_KINTONE_URL: string;
    VITE_KINTONE_USER_NAME: string;
    VITE_KINTONE_PASSWORD: string;
    VITE_KINTONE_PLATFORM: string;
    VITE_KINTONE_TYPE: string;
    VITE_KINTONE_APP?: string;
    VITE_KINTONE_REACT?: string;
    VITE_KINTONE_BUILD_UPLOAD?: string;
  }

  export interface UploadFileResponse {
    fileKey: string;
  }

  export type ScriptList = {
    type: string | undefined;
    src: string | undefined;
  }[];

  export type ScriptsList = {
    locationType: string;
    type: string;
    name: string;
    contentUrl: string;
    contentId: string;
  }[];

  export interface GetSystemSettingResponse {
    result: { scripts: ScriptsList; scope: string };
  }

  export interface GetAppSettingResponse {
    result: { scripts: ScriptsList; scope: string };
  }

  export interface UpdateResponse {
    result: object;
  }

  export interface GetAppInfo {
    name: string;
    [propName: string]: any;
  }

  export type jsFiles = {
    jsType: string;
    fileKeys: string[];
  };
}

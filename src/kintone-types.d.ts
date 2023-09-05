declare module "kintone-types" {
  export type Type = "DESKTOP" | "MOBILE" | "DESKTOP_CSS" | "MOBILE_CSS";

  export type TypeInput = {
    platform: "APP" | "PORTAL";
    type: "DESKTOP" | "MOBILE";
  };

  export interface JsList {
    DESKTOP: string[];
    MOBILE: string[];
    DESKTOP_CSS: string[];
    MOBILE_CSS: string[];
  }

  export interface EnvSetting {
    VITE_KINTONE_URL: string;
    VITE_USER_NAME: string;
    VITE_PASSWORD: string;
    VITE_APP: string | undefined;
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

  export interface UpdateSystemSettingResponse {
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

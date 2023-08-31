import axios, { Axios } from "axios";
import fs from "node:fs";
import FormData from "form-data";

type ScriptsList = {
  locationType: string;
  type: string;
  name: string;
  contentUrl: string;
  contentId: string;
}[];

type jsFiles = {
  jsType: string;
  fileKeys: string[];
};

interface UploadFileResponse {
  fileKey: string;
}

interface GetSystemSettingResponse {
  result: { scripts: ScriptsList; scope: string };
}

interface UpdateSystemSettingResponse {
  result: object;
}

export default class kintoneApi {
  http: Axios;
  constructor(baseURL: string, username: string, password: string) {
    this.http = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "X-Cybozu-Authorization": Buffer.from(
          `${username}:${password}`
        ).toString("base64"),
      },
    });
    //响应拦截器
    this.http.interceptors.response.use(
      (res) => {
        return res.data;
      },
      (err) => {
        return Promise.reject(new Error(err.message));
      }
    );
  }

  //文件上传
  uploadFile(filePath: string, name: string): Promise<UploadFileResponse> {
    const url = "/k/v1/file.json";
    let formData = new FormData();

    formData.append("file", fs.createReadStream(filePath), name);
    const config = {
      headers: {
        ...formData.getHeaders(),
      },
    };

    return this.http.post(url, formData, config);
  }

  //获取系统设置
  getSystemSetting(): Promise<GetSystemSettingResponse> {
    const url = "/k/api/js/getSystemSetting.json";
    const header = {
      "Content-Type": "application/json",
    };
    return this.http.post(url, header);
  }

  //更新系统设置
  updateSystemSetting(
    jsScope: string,
    jsFiles: Array<jsFiles>
  ): Promise<UpdateSystemSettingResponse> {
    const url = "/k/api/js/updateSystemSetting.json";
    const body = {
      jsScope,
      jsFiles,
    };
    return this.http.post(url, body);
  }
}

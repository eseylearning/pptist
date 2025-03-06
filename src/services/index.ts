import axios from "./config";

export const ASSET_URL = "https://asset.pptist.cn";

export default {
  getMockData(filename: string): Promise<any> {
    return axios.get(`./mocks/${filename}.json`);
  },

  getFileData(filename: string): Promise<any> {
    return axios.get(`${ASSET_URL}/data/${filename}.json`);
  },

  uploadFile(file: File): Promise<any> {
    const data = new FormData();
    data.append("file", file);
    return axios.post("/api/f/files/upload/single", data);
  },

  resultupdate(data: any): Promise<any> {
    return axios.post("/api/ai/ppt/result/update", data);
  },

  getPPTinfo(data: any): Promise<any> {
    return axios.post("/api/ai/ppt/info", data);
  },
};

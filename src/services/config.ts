import axios from "axios";
import message from "@/utils/message";
import { Encrypt, Decrypt, generateRandomKey, rsaEncrypt } from "@/utils/crypto";

const instance = axios.create({ timeout: 1000 * 300 });

function getParamFromQueryString(paramName: string) {
  const queryString = window.location.search;
  return getParamFromString(queryString, paramName);
}
function getParamFromString(queryString: string, paramName: string) {
  if (!queryString || !paramName) {
    return null;
  }
  const params = new URLSearchParams(queryString);
  return params.get(paramName);
}

instance.interceptors.request.use((config: any) => {
  const { url } = config;

  if (url !== "/api/f/files/upload/single") {
    const randomKey = generateRandomKey();
    const encryptedKey = rsaEncrypt(randomKey);
    config._aesKey = randomKey;

    if (url && url.split("?")[1]) {
      const obj: any = {};
      const formatUrl = url.split("?")[1].split("&");
      for (let i = 0; i < formatUrl.length; i++) {
        const item = formatUrl[i].split("=");
        obj[item[0]] = item[1];
      }
      config.url = url.split("?")[0];
      config.params = { encode: Encrypt(obj, randomKey), encryptKey: encryptedKey };
    } else {
      if (config.params !== undefined && Object.keys(config.params).length !== 0) {
        for (const key in config.params) {
          if (config.params[key].length === 0) {
            delete config.params[key];
          }
        }
        config.params = { encode: Encrypt(config.params, randomKey), encryptKey: encryptedKey };
      }
    }

    if (config.data !== undefined && !(config.data instanceof FormData) && Object.keys(config.data).length !== 0) {
      config.data = { encode: Encrypt(config.data, randomKey), encryptKey: encryptedKey };
    }

    if (!config.params?.encryptKey && !config.data?.encryptKey) {
      config.params = { ...(config.params || {}), encryptKey: encryptedKey };
    }
  }

  const token = getParamFromQueryString("token");
  config.headers["source-type"] = "web";
  config.headers["Language-Type"] = "1";
  config.headers["Cache-Control"] = "no-cache";
  config.headers["encode"] = "1";
  if (token) {
    config.headers["X-Csrf-Token"] = token;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 400) {
      const aesKey = (response.config as any)._aesKey;
      let data: any;
      if (response.request?.responseType === "blob") {
        data = response.data;
      } else {
        data = response.data.code
          ? response.data
          : JSON.parse(Decrypt(response.data, aesKey));
      }
      return Promise.resolve(data);
    }

    message.error("未知的请求错误！");
    return Promise.reject(response);
  },
  (error) => {
    if (error && error.response) {
      if (error.response.status >= 400 && error.response.status < 500) {
        return Promise.reject(error.message);
      } else if (error.response.status >= 500) {
        return Promise.reject(error.message);
      }

      message.error("服务器遇到未知错误！");
      return Promise.reject(error.message);
    }

    message.error("连接到服务器失败 或 服务器响应超时！");
    return Promise.reject(error);
  }
);

export default instance;

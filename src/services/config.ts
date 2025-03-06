import axios from "axios";
import message from "@/utils/message";

const instance = axios.create({ timeout: 1000 * 300 });

function getParamFromQueryString(paramName: string) {
  // 获取当前页面的查询字符串
  const queryString = window.location.search;

  // 使用 getParamFromString 函数获取指定参数的值
  return getParamFromString(queryString, paramName);
}
function getParamFromString(queryString: string, paramName: string) {
  // 如果传入的字符串为空或参数名为空，则返回 null
  if (!queryString || !paramName) {
    return null;
  }

  // 使用 URLSearchParams 解析查询字符串
  const params = new URLSearchParams(queryString);

  // 获取指定参数的值
  return params.get(paramName);
}

instance.interceptors.request.use((config) => {
  // 获取 token
  const token = getParamFromQueryString("token");
  config.headers["source-type"] = "web";
  config.headers["Language-Type"] = "1";
  config.headers["encode"] = "";
  if (token) {
    config.headers["X-Csrf-Token"] = token;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 400) {
      return Promise.resolve(response.data);
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

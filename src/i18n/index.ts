import { createI18n } from "vue-i18n";

import ZhCn from "./lang/zh-cn";
import EnUs from "./lang/en-us";
import ZhTw from "./lang/zh-tw";

/** 语言类型 */
export enum LanguageType {
  ZH_CN = "zh-cn",
  ZH_TW = "zh-tw",
  EN_US = "en-us",
}

const lang: any = "zh-tw";

// 通过选项创建 VueI18n 实例
const i18n = createI18n({
  locale: lang,
  legacy: false,
  globalInjection: true,
  messages: {
    "zh-cn": ZhCn,
    "en-us": EnUs,
    "zh-tw": ZhTw,
  },
});

export default i18n;

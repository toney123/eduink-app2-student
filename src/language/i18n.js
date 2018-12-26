/**
 * 翻译配置
 */
import RNLanguages from 'react-native-languages';
import I18n from 'i18n-js';
import en from './translation/en.json';
import zh from './translation/zh.json';

// 有类似匹配就切换，如：en-US回退en去匹配
I18n.fallbacks = true;

//RNLanguages.languages 获取当前设备设置的语言顺序

// 获取当前设备语言
I18n.locale = RNLanguages.language;

// 当前设备获取失败则采用默认语言
I18n.defaultLocale = "en";

I18n.translations = {
  en,
  zh
};

export default I18n;
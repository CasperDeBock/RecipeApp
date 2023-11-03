// contents of I18n.js
import {I18n} from 'i18n-js';
import translations from './translation.json';

import * as RNLocalize from 'react-native-localize';
const locales = RNLocalize.getLocales();

// configure i18n
const i18n = new I18n({...translations});
i18n.locale = locales[0].languageCode;
export default i18n;


import {createI18n } from 'vue-i18n';
import { it } from '../lang/it.js'
import { en } from '../lang/en.js'


const messages = {  'it': it, 'en': en};
const langsaved=localStorage.getItem('lang');
const navlang=navigator.language.split("-")[0];
console.log("navlang  ", navlang);
const i18n = createI18n({locale:navlang,  fallbackLocale: 'en',  messages});

export default i18n;

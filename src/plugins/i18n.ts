
import {createI18n } from 'vue-i18n';
import { it } from '../lang/it.js'
import { en } from '../lang/en.js'
import { fr } from '../lang/fr.js'
import { de } from '../lang/de.js'
import { es } from '../lang/es.js'


const messages = {  'it': it, 'en': en, 'fr':fr, 'de':de, 'es':es};
const langsaved=localStorage.getItem('lang');
let navlang=navigator.language.split("-")[0];
if(localStorage.getItem('savedLangs')!=null){
    const langdownloaded= localStorage.getItem('savedLangs').split(",");
    if(navlang!=langsaved && langdownloaded.length>1){
        navlang=langsaved;
    }
}

console.log("navlang  ", navlang);
const i18n = createI18n({locale:navlang,  fallbackLocale: 'en',  messages});

export default i18n;

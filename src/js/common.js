
import {  alertController} from "@ionic/vue";
import { Plugins } from "@capacitor/core";
import { Thumbs } from "swiper";
const { Storage } = Plugins;
import {global} from '../js/global'
import store from '../store/store'

export default {
    
    detectMobileType(){
        console.log("USER AGENT ",navigator);
          const userAgent = navigator.userAgent.toLowerCase();
          const android = userAgent.indexOf("android") > -1;
          const iphone = userAgent.indexOf("iphone") > -1;
          const ipad = userAgent.indexOf("ipad") > -1;
           let device =""
          if(android) {
              console.log( "Device is Android Phone");
              device="android"
          }
          if(iphone) {
              console.log( "Device is iPhone");
              device="iphone"
          }
          if(ipad) {
            console.log( "Device is ipad");
            device="ipad"
        }
          return device;
    },

    openApp(tag){
        const userAgent = navigator.userAgent.toLowerCase();
        const android = userAgent.indexOf("android") > -1;
        const iphone = userAgent.indexOf("iphone") > -1;
        const ipad = userAgent.indexOf("ipad") > -1;
      
        if(android) {
            console.log( "Device is Android Phone");
            window.location.replace("intent://#Intent;scheme="+this.conf.androidAppName+";S.browser_fallback_url="+this.conf.androidStoreUrl+";end");
        }
        if(iphone) {
            console.log( "Device is iPhone");
            if(tag!=0){
              window.location.replace(this.conf.appleAppName+tag);
            }else{
              window.location.replace(this.conf.appleAppName);
            }
            setTimeout(()=> {
              window.location = this.conf.appleStoreUrl
            }, 500);
            
        }
        if(ipad) {
            console.log( "Device is ipad");
          
        }  
    },
    //comparazione versione swi e versione salvata
    checkVersion(){
      const confsaved=JSON.parse(localStorage.getItem("pubblication"))
      const releaseNew=parseInt(this.swiConf.app_release)
      const savedRelease=(confsaved)?parseInt(confsaved.config.app_release):null
      console.log(releaseNew+" - "+savedRelease);
      if((releaseNew>savedRelease)){
        localStorage.clear();
       // this.$router.replace({ name:'onboard'});
      }     
    },

    ////alert

    async showOptions() {
      const alert = await alertController.create({
        header: this.$t('update.title'),
        message:  this.$t('update.text'),
        buttons: [
          {
            text: this.$t('action.postponi'),
            role: "cancel",
            
            handler: () => {
              console.log("Declined the offer");
              this.notification=true;
            },
          },
          {
            text:  this.$t('action.download'),
            cssClass:"modal-accept-button",
            handler: () => {
              if(window.navigator.onLine){
                console.log("Accepted");
                this.emitter.emit('aggiorna','main');
              }else{
                console.log("THIS ", this)   
                this.networkError;  
                            
                this.notification=true;
              }
              
            },
          },
        ],
      });
  
      await alert.present();
    },

    async networkError() {
      const alert = await alertController.create({
        header:  this.$t('networkerror.title'),
        message: this.$t('networkerror.text'),
        buttons: [
         
          {
            text: this.$t('networkerror.action'), 
          },
        ],
      });
  
      await alert.present();
    },

    async storageError() {
      const alert = await alertController.create({
        header:  this.$t('storageError.title'),
        message: this.$t('storageError.text'),
        buttons: [
         
          {
            text: this.$t('storageError.action'), 
          },
        ],
      });
  
      await alert.present();
    },



    /// save schede visitate

    addtoBucket(ntag){
      this.bucket= localStorage.getItem('schede_viste');
      if(this.bucket==null){
        localStorage.setItem("schede_viste", ntag);

      }else{
        this.bucket= this.bucket.split(",");
       
        if(!this.bucket.includes(ntag)){
          this.bucket.push(ntag);
          localStorage.setItem("schede_viste", this.bucket);
        }
       
        console.log("bucket  "+this.bucket)
        
      }
      
    },

    //clear objectstore in indexed db
    incrementdb(){
      const newdbV=global.dbVersion+1
      global.dbVersion=newdbV;
      console.log("WEN DBV"+newdbV)
      localStorage.setItem("dbVersion",newdbV);
  
    },

    async deleteDB(){
      const req = indexedDB.deleteDatabase('mediaStore');
      req.onsuccess = function () {
          console.log("Deleted database successfully");
      };
      req.onerror = function () {
          console.log("Couldn't delete database");
      };
      req.onblocked = function () {
          console.log("Couldn't delete database due to the operation being blocked");
      };

    },


    async clearStore(){
      this.incrementdb();
     console.log("global.dbVersion" +global.dbVersion)
       
     
       const open = indexedDB.open('mediaStore',  global.dbVersion)
 
     
 
       open.onsuccess = ()=> {
         const db = open.result
         console.log("ILDB ", db);
         db.objectStoreNames.forEach(objStore => {
           console.log("obstores ",objStore)
           const tx = db.transaction([objStore],'readwrite');
           const store = tx.objectStore([objStore])
           const clearRequest =store.clear();
 
           tx.oncomplete = ()=> {
         
             // localStorage.setItem('savedLangs','')
             /*db.deleteObjectStore(['media-'+ this.currLang]);
             db.close()*/
             
           }
 
           clearRequest.onsuccess = event=> {
             localStorage.removeItem('schede_viste');
             console.log("clearRequest SUCCEESS")
             //  db.deleteObjectStore(['media-'+ this.currLang]);
             //db.close()
           }
 
         });
 
       }
      
       open.onerror = (err)=> {
           
         console.error('Error to clear store: ',err)
       }
          
 
    },


    ///  set get storage

    async updateNotification(state) {
      console.log("Update ", state);
      await Storage.set({
        key: 'update',
        value:state
      });
    },

    async getNotificationState(){
      const notification=await Storage.get({key:"update"});
      if(notification){
        return JSON.parse(notification.value);
      }else{
        return null
      }
    },

    async setInactiveTour() {
      await Storage.set({
        key: 'tourActive',
        value:JSON.stringify({
           active: false,
          
        })
      });
    },
    async setActiveTour() {
      await Storage.set({
        key: 'tourActive',
        value:JSON.stringify({
           active: true,
          
        })
      });
    },
    async setstorePerc(state){
      await Storage.set({
          key: 'percorsosel',
          value:state
        });
    },

    getpercinfo(){
       const percorsi =this.getElencoPercorsi()
       const sel= percorsi.find(perc=> perc.percorso==localStorage.getItem("percSel"));
      return sel

    },
    getElencoPercorsi(){
      const percorsi =JSON.parse(localStorage.getItem("percorsi"))
      
     return percorsi

   },


    datetoVersion(date){
      const splitted=date.split("-");
      const year=splitted[2].substring(2);
      const recompose=year+splitted[1]+splitted[0];
      return parseInt(recompose);
    },

    
    async checkOnlineStatus () {
      try {
        const online = await fetch("/1pixel.png");
        console.log("online", online);
        return online.status >= 200 && online.status < 300; // either true or false
      } catch (err) {
        return false; // definitely offline
      }
    },


    getinfo(callback){
      if(this.conf.percorsi==true){

        fetch(store.getters.baseUrl+"/service/rest/v1/mostra-attiva/percorsi")
        .then(response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${reponse.status}`)
          }
          return response.json()
        })
        .then(data => {
          callback(data.result[0]);
        })
        .catch(error => console.log(error))
      }else{

        fetch(store.getters.baseUrl+"/service/rest/v1/mostra-attiva")
        .then(response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${reponse.status}`)
          }
          return response.json()
        })
        .then(data => {
          callback(data.result[0]);
        })
        .catch(error => console.log(error))
      }

       

    },
    async  getPercorsi(callback){
       fetch(store.getters.baseUrl+"/service/rest/v1/percorsiMuseo")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${reponse.status}`)
        }
        return response.json()
      })
      .then(data => {
        callback(data.result);
      })
      .catch(error => console.log(error))

    },

  async  getPercorsiawait(){
      const response= await fetch(store.getters.baseUrl+"/service/rest/v1/percorsiMuseo")
     /// console.log("p response",response, response.json())
      const ret=response.json();
      return ret;
    /*  .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${reponse.status}`)
        }
        return response.json()
      })
      .then(data => {
        callback(data.result);
      })
      .catch(error => console.log(error))*/

    },

    getSchede(callback){
      console.log("conf percorsi",this.conf)
      if(this.conf.percorsi==true){
        
        fetch(store.getters.baseUrl+"/service/rest/v1/app-schede-audible/percorsi")
        .then(response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
          }
          return response.json()
        })
        .then(data => {
        // console.log("schede", data.result);
          callback(data.result);
        
        })
        .catch(error => console.log(error))

      }else{
        fetch(store.getters.baseUrl+"/service/rest/v1/app-schede-audible")
        .then(response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
          }
          return response.json()
        })
        .then(data => {
        // console.log("schede", data.result);
          callback(data.result);
        
        })
        .catch(error => console.log(error))

      }

    },

    alertPercorso() {
      const alert = document.createElement('ion-alert');
      alert.mode='ios'
      alert.header = 'Alert';
      alert.message = 'La scheda fa parte di un altro percorso';
      alert.buttons = ['OK'];

      document.body.appendChild(alert);
      return alert.present();
    },

    getAttivaSuppoto(){
      const supporto=JSON.parse(localStorage.getItem('attivaSupporto'));
      if(supporto){
        if(supporto==true){
          return true
        }else{
          return false
        }

      }else{
        return false
      }
    },


};
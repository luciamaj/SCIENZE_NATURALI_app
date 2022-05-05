
import {  alertController} from "@ionic/vue";
import { Plugins } from "@capacitor/core";
import { Thumbs } from "swiper";
const { Storage } = Plugins;

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
            window.location.replace("intent://#Intent;scheme="+process.env.VUE_APP_ANDROID_APPNAME+";S.browser_fallback_url="+process.env.VUE_APP_ANDROID_STORE_URL+";end");
        }
        if(iphone) {
            console.log( "Device is iPhone");
            if(tag!=0){
              window.location.replace(process.env.VUE_APP_APPLE_APPNAME+tag);
            }else{
              window.location.replace(process.env.VUE_APP_APPLE_APPNAME);
            }
            setTimeout(()=> {
              window.location = process.env.VUE_APP_APPLE_STORE_URL;
            }, 500);
            
        }
        if(ipad) {
            console.log( "Device is ipad");
          
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


    ///  set get storage

    async updateNotification(state) {
      console.log("Update");
      await Storage.set({
        key: 'update',
        value:state
      });
    },

    async getNotificstionState(){
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
    

};
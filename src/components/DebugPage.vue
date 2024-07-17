<template>

  <ion-header class="ion-no-border">
    <ion-toolbar >
      <ion-title color="secondary" > Test</ion-title>
        <ion-buttons slot="start" >
          <ion-back-button ></ion-back-button>
        </ion-buttons>
      </ion-toolbar> 
    </ion-header>
  
    <ion-content :fullscreen="true">
   
      <div class="vertical-center ">
        <div class="center">
          <div class="containInfo">
            <h5>Storage &amp; Quota Test</h5>
    
          <p>
            <b>Quota:</b>
            <span id="quota">{{quota}}</span><br>
            <b>Used:</b>
            <span id="used">{{used}}</span><br>
            <b>Remaining:</b>
            <span id="remaining">{{remaining}}</span>
          </p>
          <p>
            <b>Items Stored:</b> <br>
            <code id="countIDB">{{countIDB}}</code> (IndexedDB) <br>
            <code id="countCache">{{ countCache }}</code> (Cache API) <br>
            <code id="countLocalStorage">{{ countLocalStorage }}</code> (LocalStorage) <br>
      
          </p>
            <div class="" id=""><b>INDEXDB</b></div>
            {{ this.media }}
            <div class="" id="">size </div>
            <div class="infoPubb" id=""><b>Pubblicazione</b> 
              {{ store}}
            </div>
            <div class="infoVersLang" id=""><b>Versioni Lingue</b>
              {{ vLang}}
            </div>
            
            <div class="infoSchede" id="">{{schede}}</div>
            

            <div class="buttons-test">
            
            </div>

          </div>
          

         
          
        </div>
      </div>
    </ion-content>

</template>

<script>
import {

  IonToolbar,
  IonTitle,
  IonContent,
  modalController,
  alertController,
 
  //IonModal
  
} from "@ionic/vue";
import Amplitude from "amplitudejs";
import Scanner from "../views/Scanner.vue";
import Nav from "./Nav.vue";
import factory from "ggwave";
import { Plugins } from "@capacitor/core";
import { useRouter } from "vue-router";
import common from "../js/common"
import { get, set, clear, keys, del } from 'idb-keyval';
      window.idbKV = {
        get: get,
        set: set,
        clear: clear,
        keys: keys,
        del: del
      };
const { Storage } = Plugins;


export default {
  name: "Tab",
  data() {
    return {
      decodedValue: "",
      store:"",
     ntag:"",
     playing:false,
     fileUrl:"assets/sounds/TEST.wav",
     msgUltrasuoni:"TEST",
     inTest:true,
     media:[],
    };
  },

  ionViewWillLeave() {
    console.log('test will leave');
    if(this.fileUrl){
  
      Amplitude.pause();
      
    }

  },
  ionViewWillEnter(){
          
 /*   this.captureStartTest = document.getElementById("captureStartTest");
    this.captureStopTest = document.getElementById("captureStopTest");
    this.captureStartTest.hidden = true;
    this.captureStopTest.hidden = false;*/


  },
  unmounted(){
    
    console.log("Unmounting test- stop audio");
    Amplitude.pause();
    this.inTest=false;
 
    
  },
 
  mounted(){
    this.store=JSON.parse(localStorage.getItem('pubblication'));
    this.schede=JSON.parse(localStorage.getItem('dataMostra'));
    this.vLang=JSON.parse(localStorage.getItem('versionLangs'));
    this.getDBInfo();

    this.updateCount();
    this.updateQuota();
    /*this.anima=document.getElementById("anima");
    this.mostra=document.getElementById("mostra");*/

    
      
   
    
  },
  computed:{
    interactionMode(){
      console.log("interactionMode "+this.conf.interactionMode );
      return this.conf.interactionMode;
    },
    
  

  },
  components: {
    IonToolbar,
    IonTitle,
    IonContent,
   
    
    //IonModal
  
  },
  setup() {
     
    const router = useRouter();
   
    const openMenuModal = async (notification) => {
      const top = await modalController.getTop();

      const menumodal = await modalController.create({
        component: Nav,
        swipeToClose: true,
        presentingElement: top,
        componentProps: { 
          updateNotification:notification,
          
        }
      });

      menumodal.onDidDismiss().then(async _ => {
        console.log("dismissed");
         console.log("dismissed " +notification);
      });

     

      return menumodal.present();
    };

  
    return {
    //  openModal,
      openMenuModal,
     

    };


  },
  created(){
   
    this.showOptions=common.showOptions;
   

    this.emitter.on('changeVersion', _ => {
      this.showOptions();
    });
    
    this.emitter.on('fineAggiornamento', _ => {
      console.log("FINITO");
      this.notification=false;
    });

 
   
  },



  methods: {

    updateQuota() {
      navigator.storage.estimate().then((quota) => {
        // console.log('quota', quota.quota);
        const remaining = quota.quota - quota.usage;
        this.quota = this.formatToMB(quota.quota);
        this.used =  this.formatToMB(quota.usage);
        this.remaining=  this.formatToMB(remaining);
        this.countIDB=this.formatToMB(quota.usageDetails.indexedDB);
        this.countCache=this.formatToMB(quota.usageDetails.caches);
      }).catch((err) => {
        console.error('*** Unable to update quota ***', err);
      }).then(() => {
        setTimeout(() => {
          this.updateQuota();
        }, 500);    
      });

    },
    formatToMB(val) {
      const ONE_MEG = 1000000;
      const opts = {
        maximumFractionDigits: 0,
      };
      let result;
      try {
        result = new Intl.NumberFormat('en-us', opts).format(val / ONE_MEG);
      } catch (ex) {
        result = Math.round(val / ONE_MEG);
      }
      return `${result} MB`;
    },
    updateCount() {
    this.countLocalStorage = localStorage.length;
    this.countSessionStorage = sessionStorage.length;
    console.log("idbKV", idbKV);
    //this.countIDB=navigator.indexedDB.estimate();
    //this.countCache=navigator.caches.estimate();
    /*idbKV.keys()
      .then((keys) => {
      
        this.countIDB = keys.length;
       
      }).catch((err) => {
        console.error('*** Unable to update IDB count ***', err);
      }).then(() => {
        return caches.open('cache/v1');
      }).then((cache) => {
        return cache.keys();
      }).then((keys) => {
        console.log("entro keyscache");
        this.countCache = keys.length; 
      }).catch((err) => {
        console.error('*** Unable to update Cache count ***', err);
      }).then(() => {
        this.elemCountTotal = this.countIDB + this.countCache + this.countLocalStorage + this.countSessionStorage;    
        setTimeout(() => {
          this.updateCount();
        }, 500);
      });*/
  },




    getDBInfo(){

      this.request = indexedDB.open('mediaStore', global.dbVersion);
        this.request.onsuccess = event => {
          this.db = event.target.result;
          if(this.db){
            console.log("ildb ",this.db)
          }else{
            alert("no DB")
          }
          const lingue=["it",'en','es','fr','de'];
          lingue.forEach(lang=>{
            const transaction = this.db.transaction(['media-'+lang]);
            transaction.onerror= event => {
              alert('notransaction ', event);
            
            };

            const media = transaction.objectStore('media-'+lang);
            const reqM = media.getAllKeys();
              
              reqM.onsuccess=event=>{
                const medialist=event.target.result;
                if(medialist.length>0){
                  this.media.push(lang);
                  this.media.push(medialist);
                }
                
              }
              
            
          })
          
          
         
    }
  },

    
    async openModal  ()  {
      if(this.$store.getters.conf.interactionMode=="mix"){
        if(this.tour==true){
          const captureStop=document.getElementById("captureStop");
          captureStop.click();
        }
       

      }
      
      const top = await modalController.getTop();

      const modal = await modalController.create({
        component: Scanner,
        swipeToClose: true,
        presentingElement: top
      });

      modal.onDidDismiss().then(async _ => {
        console.log("dismissed");
        const objStr = await Storage.get({ key: "scheda" });
        const obj = JSON.parse(objStr.value);

        if (obj != null) {
            console.log("OGGETTO ",obj)
          if (obj.path.type == "audio") {
            this.$router.replace({ path: "/audio/" + obj.path.index });
          } else  if (obj.path.type == "video") {
              this.$router.replace({ path: "/video/" + obj.path.index });
          }else{
            this.$router.replace({ path: "/audio/" + obj.path.index });
          }
        }
      });

      await Storage.remove({ key: "scheda" });

      return modal.present();
    },
  

    async openAppModal() {
     
      const alert = await alertController.create({
          header: this.$t('main.alertApp.title') ,
          message: this.$t('main.alertApp.text') ,
          buttons: [
             
              {
                text: this.$t('action.close') ,
                role: "cancel",
                handler: () => {
                    console.log("Declined the offer");
                  
                },
              },
               {
                  text:this.$t('action.app'),
                  cssClass:'modal-accept-button',
                  handler: () => {
                    console.log(this)
                   this.goToApp();
                     
                  },
              },
          ],
      });

      await alert.present();
    },

  presentAlert() {
    const alert = document.createElement('ion-alert');
    alert.mode='ios'
    alert.header = 'Alert';
    alert.message =  this.$t('menu.test.nonCompatibileTest');
    alert.buttons =  ['Riprova'];

    document.body.appendChild(alert);
    return alert.present();
  },
  alertCpatibilità(compatibile) {
    const alert = document.createElement('ion-alert');
    alert.mode='ios'
    alert.header = 'Alert';
    if(compatibile){
      alert.message = this.$t('menu.test.compatibileTest');
      alert.buttons = ['Chiudi'];
    }else{
      alert.message = this.$t('menu.test.nonCompatibileTest');
      alert.buttons = ['Riprova'];
    }


    document.body.appendChild(alert);
    return alert.present();
  },


  }
};
</script>

<style scoped>

ion-content {
  --overflow: hidden;
}

.vertical-center {
  display: flex;
  justify-content: center;
  height: 100%;
}

.center {
  display: block;
  position: absolute;
  bottom: 0;
  padding-bottom: 10vh;
  height: 92vh;
  width: 100%;
}

.containInfo{
  padding: 15px;
  font-size: 15px;
  overflow: scroll;

}
.main-title{
  width: 65%;
  font-size: 1em;
}
.test-text-container {
 /*background-color: #fff;*/
 padding: 17px;
 text-align: center;

  position: relative;
  /* top: 9px; */
  top: 19%;
  width: 77vw;
  margin: auto;
  height: 20vh;
  line-height: 2em;
}

.infoVersLang{
  margin: 20px 10px;
}
.infoPubb{
 margin: 20px 10px;
}
.infoSchede{
  margin: 20px 10px;
    width: 100%;
    scroll-behavior: smooth;
    overflow: scroll;
    font-size: 14px;
    height: 248px;

}



.title {
  color: #2d9fe3;
  font-size: 26px;
  font-weight: 700;
  padding: 10px;
}



.collection-button{
   /* border: 2px solid aliceblue;*/
    border-radius: 50px;
    margin: 5px 17px;
   /* background: #d9d9d9;*/
    height: 36.7px;
}
.collection-button>ion-label{
    margin: 5px 6px;
    font-size: 13px;
    text-transform: capitalize;
}

.icon-button{
  max-height: 65%;
  max-width:70%;
}
.capture-btn-test {
  font-weight: 700;
  /*width: 280px;*/
  width: 45vw;
  margin: 17px auto;
  /* height: 41px;*/
  height: 15vw;
  --border-radius: 10px;
}
#captureStartTest{
    --background:var(--ion-color-secondary);
}
#captureStopTest {
  --background:var(--ion-color-secondary-whitened);
}
.scan-btn{
  font-weight: 700;
  /*width: 280px;*/
  width: 25vw;
  margin: 17px auto;
 /* height: 41px;*/
 height: 25vw;
  --background: #e1e1e1;
  --border-radius: 10px;
}
.toolbar-background {
  color: black !important;
}
.notification{
  width: 10px;
  visibility:hidden;
  height: 16px;
  
  position: absolute;
  top: 3px;
  right: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: transparent;

}
.showNotification{
  visibility: visible;
}

.listen{
  width: 10px;
  height: 16px;
  position: absolute;
  left: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: transparent;

}
/*@media only screen and (orientation:portrait) {
  body {
    height: 100vw;
    transform: rotate(90deg);
  }
}*/

</style>
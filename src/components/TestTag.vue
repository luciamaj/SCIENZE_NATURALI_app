<template>

  <ion-header class="ion-no-border">
    <ion-toolbar >
      <ion-title color="secondary" > Test</ion-title>
        <ion-buttons slot="start" >
          <ion-back-button ></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end" >
          <ion-button color="#efecec40"  @click="openDebug()" >
                <ion-icon  size="large" name="bug-outline" class="debug-icon"></ion-icon>
                
              </ion-button>
        </ion-buttons>
      </ion-toolbar> 
    </ion-header>

    <ion-content :fullscreen="true">
   
      <div class="vertical-center ">
        <div class="center">
          <div class="player-test">

          </div>

         
          <div class="test-text-container" id="istruzioni">{{$t('menu.test.testoIstruzioni')}}</div>

          <!--div class="logo-container" id="anima" hidden><img class="gif-listen" src="assets/background/anima.gif"/></div-->
          <div class="buttons-test">
          <ion-button expand="block" class="capture-btn-test" @click="callJava" id="captureStartTest">{{$t('menu.test.inizioTest')}}</ion-button>
            <ion-button expand="block" class="capture-btn-test" id="captureStopTest" hidden>
            <ion-badge  mode="ios" id="badge" color="danger" class="listen">0</ion-badge>
            {{$t('menu.test.stopTest')}}</ion-button>


            <!--ion-button expand="block" class="capture-btn-test" id="testGps" @click="opengps" >test gps</ion--->

       
         
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
  IonButton,
  modalController,
  alertController,
  IonBadge
  //IonModal
  
} from "@ionic/vue";
import Amplitude from "amplitudejs";
import Scanner from "../views/Scanner.vue";
import GPS from '../views/Map.vue';
import Nav from "./Nav.vue";
import { Plugins } from "@capacitor/core";
import Debug from '@/components/DebugPage.vue';
import { useRouter } from "vue-router";
import common from "../js/common";
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
    this.captureStartTest = document.getElementById("captureStartTest");
    this.captureStopTest = document.getElementById("captureStopTest");
    /*this.anima=document.getElementById("anima");
    this.mostra=document.getElementById("mostra");*/

     window["answMessage"] = (tag) => {
      if(this.inTest){
        this.answMessageTest(tag);
        console.log("in test, arrivato "+ tag);
      }else{
       
        console.log("Test FALSE "+ tag);

     
      }
      
    };

    this.captureStopTest.addEventListener("click", ()=> {
      try{
        AndroidObject.executeJavaCode(false);//aggiungere parametro  false
      }catch(e){
        console.log(e);
      }

      clearTimeout(this.waitingTime);
      this.schedaState(false);
      this.decodedValue = "stopped recording";
      this.captureStartTest.hidden = false;
      this.captureStopTest.hidden = true;
      /*this.anima.hidden=true;
      this.mostra.hidden=false;*/
      
    });
    this.ampliInit();
   
    
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
    IonButton,
    IonBadge
    
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
    this.goToApp=common.openApp;
    this.showOptions=common.showOptions;
    this.setActiveTour=common.setActiveTour;
    this.getNotificationState=common.getNotificationState;

    this.emitter.on('changeVersion', _ => {
      this.showOptions();
    });
    
    this.emitter.on('fineAggiornamento', _ => {
      console.log("FINITO");
      this.notification=false;
    });

    this.getNotificationState().then(state=>{this.notification=state});



   
  },



  methods: {
    
    openDebug(){
      const ionNav = document.querySelector('ion-nav');
      ionNav.push(Debug,{ title: 'Test silence tag' }  );
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
  
  async getTour() {
    const ret = await Storage.get({ key: 'tourActive' });
    const tour = JSON.parse(ret.value);
    if(tour){
       return tour.active;
    }
    else{
      console.log("Not existing");
      return null;
    }
   
  },
  async schedaState(state) {
    console.log("openScheda");
    await Storage.set({
      key: 'openScheda',
      value:state
    });
  },
  async getSchedaState() {
    const ret = await Storage.get({ key: 'openScheda' });
    const scheda = JSON.parse(ret.value);
    return scheda;
  }, 

  ampliInit(){
      Amplitude.init({
        /* eslint-disable */
        songs: [
          {
            name: "",
            artist: "",
            album: "",
            url: this.fileUrl,
            cover_art_url: "/assets/icon/icon.png"
          }
        ],
        callbacks: {
          ended: ()=>{
            console.log("Audio has been stopped.");
            console.log("Document " + document.visibilityState)
            /*if(document.visibilityState=="visible"){
              this.setTimer();
            }else{
              this.back();
            }*/
            
            

          }
        }
      });
      this.audio=Amplitude.getAudio();
      Amplitude.play();
      Amplitude.setRepeat( true );

      /*document.getElementById("song-played-progress-1")
      .addEventListener("click", function(e) {
        if (Amplitude.getActiveIndex() == 0) {
          var offset = this.getBoundingClientRect();
          var x = e.pageX - offset.left;

          Amplitude.setSongPlayedPercentage(
            (parseFloat(x.toString()) /
              parseFloat(this.offsetWidth.toString())) *
              100
          );
        }
      });*/

    },

  openFirst() {
      menuController.enable(true, 'first');
      menuController.open('first');
    },

    
   opengps(){
    Amplitude.pause();
    Amplitude.setRepeat( false );
    const ionNav = document.querySelector('ion-nav');
    ionNav.push(GPS, { title: 'Changeeee' });
   },
       
    callJava(){
     
     
      try{
         AndroidObject.executeJavaCode(true);  //aggiungere parametro  true
          this.setActiveTour();
          this.decodedValue = "recording";
          this.captureStartTest.hidden = true;
          this.captureStopTest.hidden = false; 
         /* this.anima.hidden=false;
          this.mostra.hidden=true;*/
          this.waitingTime=setTimeout(() => {
            this.presentAlert();
        }, 10000);
      }catch(e){
        clearTimeout(this.waitingTime);
      //  console.log("catch "+e);
      // alert("catch "+e);
       if(typeof AndroidObject=="undefined"){
           this.openAppModal();
       }else{
         alert("An error occurred, please restart the app")
       }
      

      }
     

    },
    answMessageTest(tag){
     clearTimeout(this.waitingTime);
      const res = tag
      if (res==this.msgUltrasuoni) {
          this.captureStopTest.click();
          this.alertCpatibilità(true);
            //this.decodedValue = res;
            
      }
      else{
        this.captureStopTest.click();
        this.alertCpatibilità(false);
      }


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


    

    async setObject(param) {
      await Storage.set({
        key: "scheda",
        value: JSON.stringify({
          path: param
        })
      });
    },
    async removeObj() {
      await Storage.remove({ key: "scheda" });
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
#testGps{
 color:var(--ion-color-secondary);
}

.buttons-test{
  width: 100%;
  text-align: center;
  top:50vh;
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 0 6vw;
}
.view-wwave-container {
  background-color: white;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  background-blend-mode: saturation;
}



.title {
  color: #2d9fe3;
  font-size: 26px;
  font-weight: 700;
  padding: 10px;
}

.toolbar {
   --background:  red;
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
.debug-icon{
  
  color: #d4d4d45e;
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
@media only screen and (orientation:portrait) {
  body {
    height: 100vw;
    transform: rotate(90deg);
  }
}

</style>
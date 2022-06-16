<template>
  <ion-header>
    <ion-toolbar>
     
      <ion-title > {{$t('menu.title')}} </ion-title>
       <ion-buttons slot="end" >
        <ion-button  @click="dismiss"><ion-icon size="large" name="chevron-down-outline" /></ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">

    <!--ion-title class="content-title"></ion-title-->
    <div class="button-container">
         
        <ion-button expand="block" size="large" color="secondary" :disabled="!notificationState" @click="showOptions"> 
            <ion-icon slot="start" size="large" name="cloud-download-outline" /><ion-badge  mode="ios" color="warning" class="notification"  v-model="notificationState"   :class="{showNotification:notificationState}">0</ion-badge>
            <div class="button-text"> {{$t('menu.content.title')}}</div>
            <ion-icon  slot="end" size="large" name="chevron-forward" />
        </ion-button>
        <ion-button expand="block" size="large" color="secondary"  @click="pushPage('lang')" id="push-nav-child"> 
            <ion-icon   slot="start" size="large" name="language" />
            <div class="button-text">{{$t('menu.lang.title')}}</div>
            <ion-icon  slot="end" size="large" name="chevron-forward" />
        </ion-button>
        <ion-button expand="block" size="large" color="secondary"  @click="pushPage('help')"> 
            <ion-icon  slot="start" size="large" name="help-circle-outline" />
            <div class="button-text"> {{$t("menu.help")}}</div>
            <ion-icon  slot="end" size="large" name="chevron-forward" />
        </ion-button>
         <ion-button expand="block" size="large" color="secondary" @click="pushPage('copy')" > 
            <ion-icon  slot="start" size="large" name="information-circle-outline" />
            <div class="button-text"> {{$t("menu.copyright")}}</div>
            <ion-icon  slot="end" size="large" name="chevron-forward" />
        </ion-button>
        <ion-button expand="block" size="large" color="secondary" @click="pushPage('privacy')" > 
            <ion-icon  slot="start" size="large" name="glasses" />
            <div class="button-text"> {{$t("menu.privacy")}}</div>
            <ion-icon  slot="end" size="large" name="chevron-forward" />
        </ion-button>
        <ion-button expand="block" size="large" color="secondary" @click="pushPage('terms')" > 
            <ion-icon  slot="start" size="large" name="shield-checkmark-outline"/>
            <div class="button-text"> {{$t("menu.termini")}}</div>
            <ion-icon  slot="end" size="large" name="chevron-forward" />
        </ion-button>
       
    </div>
    <div class="powered" @click="openWebSite">Powered by Engineering Associates</div>
  </ion-content>
</template>

<script lang="ts">
import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  modalController,
alertController,
} from '@ionic/vue';
//import { defineComponent } from 'vue';
import NavChild from '@/components/NavChild.vue';
import Lang from '@/components/ChangeLang.vue';
import Download from '@/components/ScaricamentoContenuti.vue';
import Copy from '@/components/Copy.vue';
import Instructions from '@/views/Onboardv3.vue'
import common from '@/js/common';
export default ({
    
    props: {
        titolo: String,
        notification: Boolean
    },
    
    setup(){
        const openHelpModal = async () => {
          
            const top = await modalController.getTop();

            const modal = await modalController.create({
                component: Instructions,
                swipeToClose: true,
                presentingElement: top,
                componentProps: { 
                context:"help",
                
                }
            });


           

            return modal.present();
        };
        return{
            openHelpModal
        }
    },

          
   
    components: {
        IonButtons,
        IonButton,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        
    },
    created(){
        this.networkError=common.networkError;
         this.emitter.on('fineAggiornamento', _ => {
           this.notificationState=false;
        });
    },

    data: ()=>  {
        return {
        title: "Menu",
        notificationState:false,
        };
    },
    mounted(){
        console.log("NOTIFICATON "+ this.notification);

        this.notificationState=this.notification;
    },
    methods: {
        hide(){
        this.notificationState=false;
        },
        pushPage(page) {
        const ionNav = document.querySelector('ion-nav') as any;
        if(page=="lang"){
            ionNav.push(Lang, { title: 'Changeeee' });
        }else if(page=="aggiorna"){
            ionNav.push(Download,  { lang: localStorage.getItem('lang'), fromC:"update" });
        }else if(page=="copy"){
            ionNav.push(Copy,  {page:"copyright" });
        }else if(page=="privacy"){
            ionNav.push(Copy,  {page:"privacy" });
        }else if(page=="terms"){
            ionNav.push(Copy,  {page:"termini" });
        }else if(page=="help"){
            ionNav.push(Instructions,  {context:"help" });
        }
        else{
            ionNav.push(NavChild, { title: 'Custom Title' });
        }
        
        },
        async dismiss () {
        await modalController.dismiss();
        },

        async showOptions() {
            if(window.navigator.onLine){
                 const alert = await alertController.create({
                    header: this.$t('update.title') ,
                    message: this.$t('update.text') ,
                    buttons: [
                        
                        {
                            text: this.$t('action.postponi') ,
                            role: "cancel",
                            handler: () => {
                                console.log("Declined the offer");
                                
                            },
                        },
                        {
                            text:this.$t('action.download'),
                            handler: () => {
                                console.log("Accepted");
                                this.emitter.emit('aggiorna', "menu");
                                this.pushPage("aggiorna");
                            
                            },
                        },
                    ],
                });

                await alert.present();

            }else{
                this.networkError();
            }
           
        },


        openWebSite(){
            window.open('https://www.engineering-associates.it/', '_blank').focus();
        },
        openCopyPage(){
            window.open('https://www.engineering-associates.it/', '_blank').focus();
        }
    }
});
</script>

<style scoped>

.content-title{
margin-top: 30px;
}
.button-container{
    position: relative;
    height: fit-content;
    top: 50%;
    padding: 8vw;
    transform: translatey(-55%);
}
.button-container>ion-button{
    text-transform: capitalize;
    margin: 20px 0;
    height: 48px
    
}
.button-text{
    width: 80%;
    text-align: start;
    padding-left: 13px;
    font-size: 0.75em;
   
}
.notification{
     width: 10px;
    visibility: hidden;
    height: 16px;
    position: absolute;
    top: 14px;
    left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: transparent;
}
.showNotification{
  visibility: visible;
}
.powered{
    position: absolute;
    bottom: 25px;
    width: 100vw;
    font-size: 15px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
    color: #136c97;

}
</style>
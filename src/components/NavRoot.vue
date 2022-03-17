<template>
  <ion-header>
    <ion-toolbar>
     
      <ion-title >Nav - Root  </ion-title>
       <ion-buttons slot="end" >
        <ion-button  @click="dismiss"><ion-icon size="large" name="chevron-down-outline" /></ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">

    <ion-title class="content-title">Settings</ion-title>
    <div class="button-container">
         
        <ion-button expand="block" size="large" color="secondary" :disabled="!notification" @click="showOptions"> 
            <ion-icon slot="start" size="large" name="checkmark-circle-outline" /><ion-badge  mode="ios" color="danger" class="notification"  v-model="notificationState"   :class="{showNotification:notificationState}">0</ion-badge>
            <div class="button-text"> {{$t('menu.content.title')}}</div>
            <ion-icon  slot="end" size="large" name="chevron-forward" />
        </ion-button>
            <ion-button expand="block" size="large" color="secondary"  @click="pushPage('lang')" id="push-nav-child"> 
            <ion-icon   slot="start" size="large" name="language" />
            <div class="button-text">{{$t('menu.lang.title')}}</div>
            <ion-icon  slot="end" size="large" name="chevron-forward" />
        </ion-button>
        <ion-button expand="block" size="large" color="secondary" > 
            <ion-icon  slot="start" size="large" name="information-circle-outline" />
            <div class="button-text"> Help</div>
            <ion-icon  slot="end" size="large" name="chevron-forward" />
        </ion-button>
         <ion-button expand="block" size="large" color="secondary" > 
            <ion-icon  slot="start" size="large" name="information-circle-outline" />
            <div class="button-text"> Copiright</div>
            <ion-icon  slot="end" size="large" name="chevron-forward" />
        </ion-button>
       
    </div>
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
export default ({
    
    props: {
        titolo: String,
        notification: Boolean
    },
    /*computed:{
        titolo(){
            const titolo=this.params
            console.log("aaaaaaaaaaaaaaaaa ",this.params)
            return titolo
        }
    },*/
   /* setup(){
        const titolo=this.navParams.get("titolo")
         return{
             titolo
         }
     },*/
          
   
    components: {
        IonButtons,
        IonButton,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        
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
        }else{
            ionNav.push(NavChild, { title: 'Custom Title' });
        }
        
        },
        async dismiss () {
        await modalController.dismiss();
        },

        async showOptions() {
            const alert = await alertController.create({
                header: "Aggiornamento",
                message: "Sono disponibili aggiornamenti dei contenuti",
                buttons: [
                    {
                    text: "Scarica",
                    handler: () => {
                        console.log("Accepted");
                        this.emitter.emit('aggiorna');
                        this.notificationState=false
                    },
                    },
                    {
                    text: "Postponi",
                    role: "cancel",
                    handler: () => {
                        console.log("Declined the offer");
                        
                    },
                    },
                ],
            });

            await alert.present();
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
    height: 47vh;
    top: 15%;
    padding: 8vw;
}
.button-container>ion-button{
    text-transform: capitalize;
    margin: 25px 0;
    
}
.button-text{
    width: 80%;
    text-align: start;
    padding-left: 13px;
    font-size: 0.9em;
   
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

</style>
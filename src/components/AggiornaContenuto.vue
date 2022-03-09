<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>{{$t('menu.content.title')}}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding" id="nav-child-content">
    {{ title }}
     
  </ion-content>
</template>

<script lang="ts">
import {
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: "langSwitch",
  props: {
    title: { type: String, default: 'Default Title' }
  },
  components: {
    IonButtons,
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar
  },
  setup(){
      
      return{
      
      }
  },

  methods:{
    switchLang(lang){
        if (this.$i18n.locale !== lang) {
           this.$i18n.locale = lang;
        }
    },
  }
})
</script>
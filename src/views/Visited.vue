<template>
  <ion-page>
     <ion-content>
     
      <raccolta :lang="lang"  :from="fromPage"></raccolta>

    </ion-content>
  </ion-page>
</template>



<script>



import {
  IonPage,
 IonContent,


} from "@ionic/vue";


import Raccolta from './../components/Raccolta.vue'


//import { Plugins } from "@capacitor/core";
//import { useRouter } from "vue-router";


export default {
  name: "Visited",
 

 
 
  components: {
  
    IonContent,
    IonPage,
    Raccolta,
  

  },
  data(){
      return{
          images:[],
          fromPage:""
      }
  },

  mounted(){
    console.log("PASSA DAL MOUNTED")
        this.fromPage = this.$route.params.from || 'main';
    },
    methods:{
     
    }
 
}

</script>

<style scoped>

ion-content {
  --overflow: hidden;
}

.body{
     background:  white;
}
.goback{
  visibility: visible;
}
.next{
 visibility: visible;
}
.invisible{
  visibility:hidden
}
.row{
  width: 100%;
  display: flex;
  margin-bottom: 40px;
}
.onboard-main{
    padding: 5%;
    height: 100%;
     background:  white;

}
ion-fab{
  bottom: 35px;
  right: 28px;
}
.onboard-top{
  margin-top: 5%;
 
}

.onboard-bot{
     margin-bottom: 5%;
  height: 80%;
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
}

.lang-cont {
  margin-bottom: 20px;
}

.lang{
 text-align: center;
 
}
.circle-cont{
  height:100px;
  width: 100px;
  margin: 0 auto 10px;
}
.circle{
  
  height:100%;
  border-radius: 50%;
  border: solid 1px rgb(194, 194, 194);
  opacity: 0.8;

}
.circle> img{
  height: 100%;
}
.cover{
  object-fit: cover;
}
.checked{
   border: solid 5px rgb(11, 124, 11);
     opacity: 1;
}
.swiper-pagination {
  color: red;
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
  padding-bottom: 15vh;
}

.logo-container {
  background-color: #fff;
}

.logo {
  object-fit: contain;
  max-height: 30vh;
  margin-bottom: 50px;
  object-position: center;
  width: 100%;
}

.onb-img{
  height: 300px;
  text-align: center;
}
.onb-img > img{
  height: 100%;
}

.title {
  color: #2d9fe3;
  font-size: 26px;
  font-weight: 700;
  padding: 10px;
}



.toolbar-background {
  color: white !important;
}

@media only screen and (orientation:portrait) {
  body {
    height: 100vw;
    transform: rotate(90deg);
  }
}

</style>
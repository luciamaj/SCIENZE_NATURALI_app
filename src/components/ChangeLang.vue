<template>
  <ion-header>
    <ion-toolbar>
       <ion-title color="secondary">{{$t('menu.lang.subtitile')}}</ion-title>
      <ion-buttons slot="start" >
        <ion-back-button></ion-back-button>
      </ion-buttons>
     
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding" id="nav-child-content">
    <!--div>{{$t('menu.lang.subtitile')}}</div-->
    <ion-grid class="langs-grid">
      <template v-for="lang in saved" v-bind:key="lang">
        <ion-row>
          <div :class="checkIfActive(lang)" class="lang-cont" v-on:click="switchLang(lang)"> 
            <ion-col class="lang-cont-flag" size="6"  :value="lang"   >
              
                <div class="circle-cont"  > <img class="cover circle" id="circle-it" :src="'/assets/background/Flag_'+lang+'.png'" alt=""></div>
        
            </ion-col>
            <ion-col class="lang-cont-name">
               <div class="lang" >{{$t('menu.lang.'+lang)}}</div>

            </ion-col> 
            </div>         
        </ion-row>
      </template>
    </ion-grid>


    <ion-button v-if="remaining.length>0" expand="block" size="slim" color="secondary" class="add-lang" @click="presentActionSheet">  {{$t('menu.lang.add')}} </ion-button>


     
  </ion-content>
</template>

<script lang="ts">
import router from '@/router';
import {
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  alertController,
  actionSheetController ,
  
  } from '@ionic/vue';
  
import common from  "../js/common"
 import Download from '@/components/ScaricamentoContenuti.vue';
//import { defineComponent } from 'vue';
export default ({
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
    IonToolbar,
    
  },
  data(){
    return{
      availableLangs:['it','en','fr','de','es'],
      saved:[],
      remaining:[],
      currLang:this.currentLang,
    }
  },
  setup(){
   
    return{
      
    }
  },
  computed:{

    
    versionLangs(){
       
      let versionLangs= [];
        console.log("linguee ", localStorage.getItem('versionLangs'))
        versionLangs=  JSON.parse(localStorage.getItem('versionLangs'));
        console.log("linguee versionLangs ", versionLangs)
                
      return versionLangs
        
    },
    savedLangs:{
        get() {
          console.log("linguee ", localStorage.getItem('savedLangs'))
          let savedLangs= [];
          savedLangs=  localStorage.getItem('savedLangs').split(",");
          this.assignSaved(savedLangs)
          console.log("linguee savedLangs ", savedLangs)
          return savedLangs
        },
      // setter
      set(newLang) {
      
        this.saved.push(newLang);
        localStorage.setItem('savedLangs', this.saved)
      }

    },

    remainingLang(){
      const pubblication=JSON.parse(localStorage.getItem('pubblication'))
      const publishedLang=pubblication.lang;
      this.currPubbDate(pubblication);
     
      const myArray = publishedLang.filter( ( el ) =>{
        console.log("?? "+!this.savedLangs.includes( el ));
        return !this.savedLangs.includes( el);
      
      });
      this.assignRemaining(myArray);
    return myArray;

    }

    
  },
  created(){
    this.datetoVersion=common.datetoVersion;
    this.networkError=common.networkError;

    this.emitter.on('addLang', (lang)=>{
      this.addLang(lang);
    })

  },
  mounted(){
    this.savedLangs
    this.remainingLang
    this.versionLangs;
  
    this.currLang=localStorage.getItem("lang")
     

    
  },

  methods:{
    addLang(lang){
      console.log("ADDO LANG", lang)
      this.savedLangs=lang;
    },
    checkIfActive(lang){
      if(this.currLang==lang){
        return "checked"
      }
    },
    pushPage(passedLang) {
      const ionNav = document.querySelector('ion-nav') as any;
      
      ionNav.push(Download,  { lang: passedLang , fromC:"lang"});
     
    },
    pushPageAggiorna(passedLang) {
      const ionNav = document.querySelector('ion-nav') as any;
      
      ionNav.push(Download,  { lang: passedLang , fromC:"update"});
     
    },
    buttons(){
      const remainingArray=[];
        this.remaining.forEach(element => {
          const langtoPush={
            text: this.$t('menu.lang.'+element),
            handler: () => {
              
                console.log('clicked')
                this.add(element)
              },
          }
          remainingArray.push(langtoPush);
         
        });
        const cancelbutton={
              text: this.$t('action.cancel'),
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked')
              },
            }
             remainingArray.push(cancelbutton)
             console.log(remainingArray);
        return remainingArray
      },
    async presentActionSheet() {
        const actionSheet = await actionSheetController.create({
            header: this.$t('menu.lang.select'),
            cssClass: 'my-custom-class',
            buttons: this.buttons(),
          });
        await actionSheet.present();

       await actionSheet.onDidDismiss();
        console.log('onDidDismiss');
      },

    async showOptions(lang) {
      const alert = await alertController.create({
        header: this.$t('menu.lang.add') ,
        message:  this.$t('menu.lang.alert') ,
        buttons: [
          {
            text: this.$t('action.download'),
            handler: () => {
              console.log("Accepted");
              if(window.navigator.onLine){
                const pubblication=JSON.parse(localStorage.getItem("pubblication"))
                const suppLang=pubblication.lang.find(el=> el==lang);
                  //this.savedLangs=lang;
                  this.remaining=this.remaining.filter(item => item !== lang);
                if(suppLang){
                    //this.searchMedia(lang);
                  // this.$router.replace({ path: "/scarica/"+ lang});
                    this.pushPage(lang);
                }else{
                    //this.searchMedia('it');
                    //this.$router.replace({ path: "/scarica/it"});
                  this.pushPage("it");
                }
              }else{
                console.log("NON C?èRETE");
                this.networkError();
              }
            
            
            },
          },
          {
            text: this.$t('action.cancel') ,
            role: "cancel",
          },
        ],
      });

      await alert.present();
    },

    async updateLang(lang) {
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
                                this.pushPageAggiorna(lang);
                            
                            },
                        },
                    ],
                });

                await alert.present();

            }else{
                this.networkError();
            }
           
        },

    currPubbDate(pubblication){
      this.pubblication=pubblication;
    },

    checkVersion(lang){
      const currentVersion=this.datetoVersion(this.pubblication.pubblicazione);
      const langVersion=this.versionLangs.find(el=> el.lang==lang).vers;

      if(currentVersion>langVersion){
        console.log("LA LINGUA NON è AGGIORNATA"); 
        this.updateLang(lang);
      }else{
        console.log("versione ok"); 
      }

    },

    switchLang(lang){
       /* if (this.$i18n.locale !== lang) {
           this.$i18n.locale = lang;
           localStorage.setItem('lang', lang);
        }*/
        this.checkVersion(lang);

        if (localStorage.getItem('lang')!= lang) {
          localStorage.setItem('lang', lang);
          this.currLang=lang;
          this.$i18n.locale = lang;
        }
    },
    add(lang){

      this.showOptions(lang)
    /*  this.savedLangs=lang;
      this.remaining=this.remaining.filter(item => item !== lang);*/
    },
    assignSaved(savedLangs){
      this.saved=savedLangs;
    },
    assignRemaining(remainingLangs){
      this.remaining=remainingLangs;
      console.log("REMAINING ",  this.remaining.length);

    },
    searchMedia(lang){
      const schede=localStorage.getItem('dataMostra');
      const jsonSchede=JSON.parse(schede);
      let contenuto;
      console.log("->>", JSON.parse(schede));
      jsonSchede.forEach(scheda => {
        contenuto=scheda.content.find(el=> el.lang==lang)
        console.log("Cont ", contenuto);
        console.log("Conttype ", contenuto.type);
       if(contenuto.type=="audio") {
           /*this.mediaCounter();*/
          this.getmedia(contenuto.audio);
           console.log("Getaudio ")
        }else if(contenuto.type=="video"){
        /*  this.mediaCounter();*/
          this.getmedia(contenuto.video);
          console.log("Getvideo ")
        }else{
          console.log("Non ci sono Media per la scheda  in "+ lang)
          if(lang!= "it"){
            const contenutoit=scheda.content.find(el=> el.lang=='it');

             console.log("contenutoita "+ contenutoit.type)
            if(contenutoit.type=="audio") {
              /*this.mediaCounter();*/
              this.getmedia(contenutoit.audio);
              console.log("Getaudioita ")
            }else if(contenutoit.type=="video"){
            /*  this.mediaCounter();*/
              this.getmedia(contenutoit.video);
              console.log("Getvideoita ")
            }
          }
        }

      });
    },

    getmedia(name){
     console.log("numero di media "+ this.media );
     // fetch(this.$store.getters.baseUrl+"/inventario/download.php?id="+name+"&link=1")
      fetch(this.$store.getters.baseUrl+"/upload/"+name)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        console.log("OK Resp", response);
        if(response.status==200){
           console.log("OK 200");
        }
        return response
      })
      .catch(error => console.log(error))
    },

    /*pushPage() {
      const ionNav = document.querySelector('ion-nav') as any;
  
        ionNav.push(scaricamento, { title: 'Changeeee' });
  
    
    },*/

  }
})
</script>

<style scoped>

.langs-grid{
  margin-top: 6vh;

}
 .checked{
    /*background: #377999b8;*/
    background: var(--ion-color-secondary-whitened);
    color: white;
 }

 .circle-cont{

   width: 15vw;
   height: 15vw;
 }
 .circle-cont>img{
       max-width: 100%;
    border: 0;
    object-fit: cover;
    height: 100%;
    width: 100%;
    border-radius: 50%;
 }
 .lang-cont{
   display: flex;
    margin: 0.2em 1em;
    border-bottom: solid 1px #d5d5d5;
    width: 100%;
    padding: 0.4em 1em;
 }
  .lang-cont-flag{
   
       margin-right: 1em;
 }
 .lang-cont-name{
   
    display: flex;
    align-items: center;
    font-size: 20px;
 }
 .add-lang{
  position: absolute;
    bottom: 5vh;
    width: 91vw;
 }




</style>
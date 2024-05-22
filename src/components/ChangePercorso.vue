<template>
  <ion-header>
    <ion-toolbar>
       <ion-title color="secondary">{{$t('menu.percorsi.subtitile')}}</ion-title>
      <ion-buttons slot="start" >
        <ion-back-button></ion-back-button>
      </ion-buttons>
     
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding" id="nav-child-content">
    <!--div>{{$t('menu.lang.subtitile')}}</div-->
    <ion-grid class="langs-grid">
      <template v-for="perc in intersectarray"  v-bind:key="perc">
        <ion-row>
          <div :class="checkIfActive(perc.percorso)" class="lang-cont" v-on:click="switchPerc(perc)"> 
            <ion-col class="lang-cont-flag" size="3"  :value="perc"   >
              
                <div class="circle-cont"  >  <img class="cover circle" id="circle-it" :src="imgPercorsi(perc.img)" alt=""></div>
          
            </ion-col>
            <ion-col class="lang-cont-name"  size="9">
              <div class="percorso">{{nomeLingua(perc)}}</div>

            </ion-col> 
            </div>         
        </ion-row>
      </template>
    </ion-grid>


    <ion-button v-if="remaining.length>0" expand="block" size="slim" color="secondary" class="add-lang" @click="presentActionSheet">  {{$t('menu.percorsi.change')}} </ion-button>


     
  </ion-content>
</template>

<script lang="ts">
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
  name: "percswitch",
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
     
      saved:[],
      savedperlang:[],
      remaining:[],
      currLang:this.currentLang,
      currPerc:""
    }
  },
  setup(){
   
    return{
      
    }
  },
  
  computed:{

    infoPercorsi() {
   
       const percorsi=JSON.parse(localStorage.getItem('percorsi'))
       
        return percorsi;
  
    },
    intersectarray(){
     
     const  intersected= this.infoPercorsi.filter(p=> this.savedperlang.includes(p.percorso));
     console.log("intersected", intersected)
     return intersected
   },
 
    savedPerc:{
        get() {
          
          let getsaved=  localStorage.getItem('savedPerc');
          const getlang=  localStorage.getItem('lang');
          console.log("linguee savedLangs ",  getsaved)
          getsaved=JSON.parse(getsaved)
          this.assignSaved(getsaved,getlang)
          
          return getsaved
        },
      // setter
      set(newSetPerc) {
      console.log("lang",  this.saved[newSetPerc.lang] )
        this.saved[newSetPerc.lang].push(newSetPerc.newPerc);
        localStorage.setItem('savedPerc', JSON.stringify(this.saved))
      }

    },

    remainingPerc(){
      const pubblication=JSON.parse(localStorage.getItem('pubblication'))
      const publishedPerc=pubblication.percorsi;
      this.currPubbDate(pubblication);
     
      const myArray = publishedPerc.filter( ( el ) =>{
        console.log("?? "+el+ !this.savedperlang.includes( el ));
        return !this.savedperlang.includes( el);
      
      });
      this.assignRemaining(myArray);
      return myArray;

    }

    
  },
  created(){
    this.datetoVersion=common.datetoVersion;
    this.networkError=common.networkError;
    this.checkStatus=common.checkOnlineStatus;

    this.emitter.on('addPerc', (perc)=>{
      this.remaining=this.remaining.filter(item => item !== perc);
      this.addPerc(perc);
    })

  },
  mounted(){
    this.savedPerc
    this.remainingPerc
   
  
    this.currLang=localStorage.getItem("lang")
     

    this.currPerc=localStorage.getItem("percSel")
    
  },

  methods:{

    imgPercorsi(img) {
   
   
      if(img!=null){
       return this.$store.getters.baseUrl+"/upload/"+img
      }else{
       return '/assets/background/dos.png';
      }
     
    },
    nomeLingua(perc){
      
      const retur= perc.lingue.find(item=>item.lang==this.currLang);
        return retur.nome;

    },

    getversionLangs(){
       
       let versionLangs= [];
         console.log("linguee ", localStorage.getItem('versionLangs'))
         versionLangs=  JSON.parse(localStorage.getItem('versionLangs'));
         console.log("linguee versionLangs ", versionLangs)
          
    return versionLangs;
         
     },
    addPerc(perc){
      console.log("ADDO perc", perc)
      this.savedPerc={
        newPerc:perc, lang:this.currLang }
    },
    checkIfActive(perc){
      console.log("checkIfActive p",this.currPerc)
      if(this.currPerc==perc){
        console.log("checkIfActive dentro")
        return "checked"
      }
    },
    pushPage(passedPerc) {
   
      const ionNav = document.querySelector('ion-nav') as any;
      
      ionNav.push(Download,  { lang: this.currLang , fromC:"perc", perc:passedPerc});
     
    },
    pushPageAggiorna(passedPerc) {
      const ionNav = document.querySelector('ion-nav') as any;
      
      ionNav.push(Download,  { lang: this.currLang , fromC:"update", perc:passedPerc});
     
    },
    buttons(){
      const remainingArray=[];
        this.remainingIntersected.forEach(element => {
          const percPush={
            text: this.nomeLingua(element),
            handler: () => {
              
                console.log('clicked')
                this.add(element.percorso)
              },
          }
          remainingArray.push(percPush);
         
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
            header: this.$t('menu.percorsi.select'),
            cssClass: 'my-custom-class',
            buttons: this.buttons(),
          });
        await actionSheet.present();

       await actionSheet.onDidDismiss();
        console.log('onDidDismiss');
      },

    async showOptions(perc) {
      const alert = await alertController.create({
        header: this.$t('menu.percorsi.add') ,
        message:  this.$t('menu.percorsi.alert') ,
        buttons: [
          {
            text: this.$t('action.download'),
            cssClass:'modal-accept-button',
            handler: async() => {
              console.log("Accepted");
              const online= await this.checkStatus();
              console.log("onlòineSTATUS ",online);
              if(online){
                const pubblication=JSON.parse(localStorage.getItem("pubblication"))
                const suppLang=pubblication.percorsi.find(el=> el==perc);
             
                  //this.savedLangs=lang;
                  //this.remaining=this.remaining.filter(item => item !== lang);
                if(suppLang){
                  //this.searchMedia(lang);
                  // this.$router.replace({ path: "/scarica/"+ lang});
                  this.pushPage(perc);
                }
                /*else{
                  //this.searchMedia('it');
                  //this.$router.replace({ path: "/scarica/it"});
                  this.pushPage("it");
                }*/
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

    async updatePerc(perc) {
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
                            cssClass:'modal-accept-button',
                            handler: () => {
                                console.log("Accepted");
                                this.emitter.emit('aggiorna', "menu");
                                this.pushPageAggiorna(perc);
                            
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

    checkVersion(perc){
      const currentVersion=this.datetoVersion(this.pubblication.pubblicazione);
      const langVersion=this.getversionLangs().find(el=> el.lang==this.currLang).vers;

      if(currentVersion>langVersion){
        console.log("LA LINGUA NON è AGGIORNATA"); 
        this.updatePerc(perc);
      }else{
        console.log("versione ok"); 
      }

    },

    switchPerc(percorso){
      const perc=percorso.percorso
       /* if (this.$i18n.locale !== lang) {
           this.$i18n.locale = lang;
           localStorage.setItem('lang', lang);
        }*/
        if (localStorage.getItem('percSel')!= perc) {
          localStorage.setItem('percSel', perc);
          console.log("entro,cambio era", this.currPerc,"sarà ", perc);
          this.currPerc=perc;

          common.setstorePerc(percorso);
         
           let  jsonSchede =JSON.parse(localStorage.getItem('allDataMostra'));
            jsonSchede=jsonSchede.filter(scheda=>scheda.percorsi.includes(perc))
            console.log("filtro per percorso scelto", jsonSchede)
            localStorage.setItem('dataMostra',JSON.stringify(jsonSchede));
          

          this.$forceUpdate()
          
        }
        this.checkVersion(perc);
    },
    add(perc){

      this.showOptions(perc)
    /*  this.savedLangs=lang;
      this.remaining=this.remaining.filter(item => item !== lang);*/
    },
    assignSaved(savedPerc, lang){
      this.saved=savedPerc;
      console.log("lllang",lang)
      console.log("savedperlang",this.saved[lang]);
      this.savedperlang= this.saved[lang]
      //this.savedperlang=savedPerc["en"].split(",")
     
    },
    assignRemaining(remainingLangs){
      this.remaining=remainingLangs;

      this.remainingIntersected= this.infoPercorsi.filter(p=> this.remaining.includes(p.percorso));
      console.log("REMAINING ",  this.remaining);
      console.log("REMAINING Inter ",  this.remainingIntersected);

    },

   
   

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
 .modal-accept-button{
  color: var(--ion-color-primary);
}




</style>
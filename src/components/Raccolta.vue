<template>

<ion-content class="ion-padding">
    <div class="collection-title">rivivi l'esperienza</div>
    <div class="list-container">
         <ion-grid class="schede-grid">
            <template v-for="scheda in visited" v-bind:key="scheda" >
                <ion-row v-on:click="openScheda(scheda.tag, scheda.content.type)">
                    <div class="schede-cont"> 
                        <ion-col class="scheda-cont-thumb" size="4"  :value="lang"   >
                        
                            <div class="thumb-cont"  > <img class="cover thumb" id="thumb-it" :src="this.$store.getters.baseUrl+'/upload/'+scheda.img" alt=""></div>
                    
                        </ion-col>
                        <ion-col class="scheda-cont-name">
                            <div class="name" >  {{scheda.content.titolo}}</div>

                        </ion-col> 
                    </div>         
                </ion-row>
            </template>
        </ion-grid>
       
    </div>
</ion-content>
   

</template>

<script>
   // import common from '@/js/common';

    export default ({
       
        computed:{

            visited(){
               const visitedTag=localStorage.getItem("schede_viste").split(',');
               this.savedtag(visitedTag);
                const schedemostra=JSON.parse(localStorage.getItem("dataMostra"));
                const visitedSchede=schedemostra.filter(scheda => visitedTag.includes(scheda.tag));
                console.log("VISITED ", visitedSchede);
                let lang= localStorage.getItem("lang");
                if (lang==null) {
                    lang=this.$i18n.locale;
                }

                visitedSchede.forEach(scheda => {
                    scheda.content= scheda.content.find(content=> content.lang==lang)
                    
                });
                return visitedSchede;
            }
        },
        methods:{
            savedtag(tags){
                this.visitedTag=tags;
            },
            openScheda(tag, type){
                if(type=="video"){
                     this.$router.replace({ path: "/video/" + tag});

                }else{
                       this.$router.replace({ path: "/audio/" + tag});
                }

            }
        }

    })
</script>

<style >
.collection-title{
    margin-top: 4vh;
}
.list-container{
    height: 82vh;
    overflow: overlay;
      margin-top: 4vh;
}

 .thumb-cont{

   width: 25vw;
   height: 15vw;
 }
 .thumb-cont>img{
       max-width: 100%;
    border: 0;
    object-fit: cover;
    height: 100%;
    width: 100%;
  
 }
 .schede-cont{
   display: flex;
    margin: 0.5em 1em;
    border-bottom: solid 4px var(--ion-color-secondary-whitened);
    background-color: #ededed ;
    width: 100%;
    padding: 0.4em 0.5em;
 }
  .scheda-cont-thumb{
   
       margin-right: 1em;
 }
 .scheda-cont-name{
   
    display: flex;
    align-items: center;
    font-size: 16px;
 }

</style>

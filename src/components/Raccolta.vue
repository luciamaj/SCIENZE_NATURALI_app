<template>
    <ion-header class="ion-no-border">
      <ion-toolbar >
        <ion-title > {{$t('raccolta.title')}}</ion-title>
       <ion-buttons slot="start" >
        <ion-button  @click="back"><ion-icon size="large" name="chevron-back" /></ion-button>
      </ion-buttons>
      </ion-toolbar> 
    </ion-header>
    <ion-content class="ion-padding">
        <div class="collection-title"> {{$t('raccolta.subtitle')}}</div>
        <div class="list-container">
            <ion-grid class="schede-grid" v-if="visited!=null">
                <template v-for="scheda in visited" v-bind:key="scheda" >
                    <ion-row v-on:click="openScheda(scheda.tag, scheda.content.type)">
                        <div class="schede-cont"> 
                            <ion-col class="scheda-cont-thumb" size="4"  :value="lang"   >
                            
                                <div class="thumb-cont"  > <img class="cover thumb"  :id="'thumb-'+scheda.img" src="scheda.img" alt=""></div>
                        
                            </ion-col>
                            <ion-col class="scheda-cont-name">
                                <div class="name" >  {{scheda.content.titolo}}</div>

                            </ion-col> 
                        </div>         
                    </ion-row>
                </template>
            </ion-grid>
            <div v-else class="text-alert">
              {{$t('raccolta.alerttext')}}
            </div>
        
        </div>
    </ion-content>
   

</template>

<script>
   // import common from '@/js/common';
    export default ({
       
        computed:{
            data(){
                return{
                    images:[],
                }
            },
            visited(){
                let visitedTag=localStorage.getItem("schede_viste");
                if(visitedTag){
                    visitedTag=visitedTag.split(',');
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
                }else{
                    return null;
                }
               
            }
        },
        
        created(){
             this.lang= localStorage.getItem("lang");
            this.getImages();

        },

        methods:{
         
            getImages(){
                 this.images=[];
                this.request = indexedDB.open('mediaStore', global.dbVersion);
                this.request.onsuccess = event => {
                    this.db = event.target.result;
                    const transaction = this.db.transaction(['media-'+this.lang],'readwrite');
                    const objectStore = transaction.objectStore('media-'+this.lang);
                    if(this.visited){
                        this.visited.forEach(scheda=>{
                            const  test= objectStore.get(scheda.img);

                            test.onsuccess = event => {
                                console.log("GET RESULT ", event.target.result)
                                const testget = event.target.result;      
                                if (testget) {
                                    const obj={}
                                    obj['name=']=testget.name
                                     obj['blob=']=testget.blob
                                    this.images.push(obj);
                                    document.getElementById("thumb-"+testget.name).src=URL.createObjectURL(testget.blob);
                                    
                                } else {
                                /*console.log('testget dont exixst error');
                                    this.fetchimg(name);*/
                                }

                                
                            };
                        })
                     }
                        
                    

                }

            },

            schedaImage(name){
                console.log('tiro su le immagini ', this.images);
                if(this.images){
                    const img= this.images.find(image=>image.name==name);
                if(img){
                    console.log("tiro su le immagini "+img.blob)
                   return URL.createObjectURL(img.blob);
                }

                }

              
            },
            back(){
                this.$router.replace("/")
            },
            savedtag(tags){
                this.visitedTag=tags;
            },
            openScheda(tag, type){
                if(type=="video"){
                    this.$router.replace({ path: "/video/" + tag});

                }else   if(type=="audio"){
                    this.$router.replace({ path: "/audio/" + tag});
                }else{
                    this.$router.replace({ path: "/soloImg/" + tag});
                }

            },

           
        }

    })
</script>

<style >
.collection-title{
    
    margin-top: 2vh;
    margin-left: 5vw;
    font-size: 18px;
    color: var(--ion-color-secondary);
}
.list-container{
    height: 80vh;
    overflow: overlay;
      margin-top: 3vh;
}
.text-alert{
    padding: 30px;

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
   /* border-bottom: solid 4px var(--ion-color-secondary-whitened);*/
    /*background-color: #ededed ;*/
    width: 100%;
    padding: 0.4em 0.5em;
    border-radius: 4px;
    box-shadow: 1px 4px 5px 2px #9797974a;
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

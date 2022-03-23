<template>
  <ion-slides pager="true" :options="slideOpts">
    <ion-slide>
        <div> In quale lingua preferisci ascoltare i contenuti? </div>
        <ion-grid>
            <ion-row>
            <ion-col v-for="lang in publishedLang" class="lang-cont" size="6" v-on:click="setLang(lang)" :key="lang">
                
                    <div class="circle-cont"  > <img class="cover circle" id="circle-it" :class="checkLang(lang)" :src="'/assets/background/Flag_'+lang+'.png'" alt=""></div>
                    <div class="lang">{{$t('menu.lang.'+lang)}}</div>
            
                </ion-col>
                
            </ion-row>
        </ion-grid>
      

    </ion-slide>
    <ion-slide>
        <div class="slide">
            <h2>Welcome</h2>
            <p>
            The <b>ionic conference app</b> is a practical preview of the ionic framework in action, and a
            demonstration of proper code use.
            </p>
        </div>
    </ion-slide>
    <ion-slide>
      <h1>Slide 3</h1>
    </ion-slide>
  </ion-slides>
</template>


<script>
import { IonSlides, IonSlide } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonSlides, IonSlide },
  setup() {
    // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
    const slideOpts = {
      initialSlide: 1,
      speed: 400
    };
    return { slideOpts }
  }
});
</script>
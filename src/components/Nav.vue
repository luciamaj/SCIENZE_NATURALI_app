
<template>
  <ion-nav :root="NavRoot" :rootParams="{notification:updateNotification}" id="nav" ></ion-nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonNav } from '@ionic/vue';
import NavRoot from '@/components/NavRoot.vue';
export default defineComponent({
  props: {
       updateNotification: { type: Boolean, default: false },
  },
  components: { IonNav },
  setup() {
    return { NavRoot  }
  },

});
</script>


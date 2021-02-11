<template>
  <div id="container">
    <QrStream @decode="onDecode"></QrStream>
    <div class="result">{{ value }}</div>
  </div>
</template>
<script>
/* eslint-disable */
// @ts-ignore
import { QrStream, QrCapture, QrDropzone } from "vue3-qr-reader";
import { Camera, CameraOptions } from "@ionic-native/camera";
/* eslint-enable */

export default {
  name: "ScanContainer",
  props: {
    name: String
  },
  data: function() {
    return {
      value: ""
    };
  },
  mounted() {
    console.log("remounted");
  },
  updated() {
    console.log("remounted");
  },
  components: {
    QrStream,
    QrCapture,
    QrDropzone
  },
  methods: {
    onDecode(decodedString) {
      console.log("the result", decodedString);
      window.open(decodedString);
      this.value = decodedString;
    }
  }
};
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.result {
  color: #fff;
  font-size: 30px;
  position: absolute;
  background-color: #000;
  bottom: 0;
  left: 0;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
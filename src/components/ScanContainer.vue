<template>
  <div id="container">
    <QrStream @decode="onDecode"></QrStream>
  </div>
</template>

<script>
/* eslint-disable */
// @ts-ignore
import { QrStream, QrCapture, QrDropzone } from "vue3-qr-reader";

export default {
  name: "ScanContainer",
  props: {
    name: String
  },
  components: {
    QrStream,
    QrCapture,
    QrDropzone
  },
  methods: {
    onDecode(decodedString) {
      console.log("the result", decodedString);
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
/* eslint-enable */
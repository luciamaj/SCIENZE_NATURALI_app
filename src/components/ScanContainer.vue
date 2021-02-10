<template>
  <div id="container">
    <div id="interactive" class="viewport scanner">
      <video />
      <canvas class="drawingBuffer" />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// @ts-ignore
import Quagga from "quagga";

export default {
  name: "ExploreContainer",
  props: {
    name: String
  },
  data() {
    return {
      width: 0,
      height: 0,
      readers: ["ean_reader", "upc_reader", "code_128_reader"]
    };
  },
  computed: {
    config() {
      return {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: this.width,
            height: this.height,
            facingMode: "environment",
            aspectRatio: {
              min: 1,
              max: 2
            }
          }
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
          readers: ["ean_reader", "upc_reader", "code_128_reader"]
        },
        locate: true
      };
    }
  },
  mounted() {
    setTimeout(() => {
      this.loadCanvas();
      this.loadScanner();
    }, 1000);
  },
  destroyed() {
    Quagga.stop();
  },
  methods: {
    loadCanvas() {
      let ratio = 0.7;
      let container = document.querySelector("#interactive");
      // @ts-ignore: I don't care that it might not be a HTML Canvas Element
      this.width = container.offsetWidth;
      // @ts-ignore: I don't care that it might not be a HTML Canvas Element
      this.height = container.offsetWidth * ratio;
    },
    loadScanner() {
      Quagga.init(this.config, err => {
        if (err) {
          return console.error(err);
        }
        Quagga.start();
      });
      Quagga.onDetected(this.onDetected);
      Quagga.onProcessed(this.onProcessed);
    },
    onDetected(result) {
      console.log("onDetected", result);
    },
    onProcessed(result) {
      if (result) {
        let drawingCtx = Quagga.canvas.ctx.overlay;
        let drawingCanvas = Quagga.canvas.dom.overlay;
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute("width")),
            parseInt(drawingCanvas.getAttribute("height"))
          );
          result.boxes
            .filter(function(box) {
              return box !== result.box;
            })
            .forEach(function(box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 2
              });
            });
        }
        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2
          });
        }
        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          );
        }
      }
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
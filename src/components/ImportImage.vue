<template>
  <div class="import-image">
    <canvas class="canvas-image" :width=canvasWidth :height=canvasHeight></canvas>
    <!-- <button>添加文件</button> -->
    <div class="file-input">
      <bezier-button :title="`选择图片`" @handleImport="handleImport"></bezier-button>
      <bezier-button :title="`清除画图`" :type="`button`" @handleClick="handleClear"></bezier-button>
      <bezier-button :title="`画一条线`" :type="`button`" @handleClick="drawBazierCurve"></bezier-button>
    </div>
  </div>
</template>
<script>
import BezierButton from '@/components/BezierButton.vue'
import BazierCurve from '../utils/bezierCurve.js'
let canvasObj, ctx
export default {
  data() {
    return {
      canvasWidth: 0,
      canvasHeight: 0
    }
  },
  components: {
    BezierButton
  },
  mounted () {
    canvasObj = document.getElementsByClassName('canvas-image')[0]
    ctx = canvasObj.getContext('2d')
    this.canvasWidth = canvasObj.offsetWidth
    this.canvasHeight = canvasObj.offsetHeight
    ctx.clearRect(0, 0, canvasObj.width, canvasObj.height)
    let imageSrc = localStorage.getItem('imageurl') || ''
    this.getImage(imageSrc)
  },
  methods: {
    drawBazierCurve () {
      this.handleClear()
      const options = {
        points: {
          start: { x: 50, y: 20 },
          cp1: { x: 230, y: 30 },
          cp2: { x: 150, y: 80 },
          end: { x: 250, y: 100 }
        },
        color: '#0F0',
        size: 10,
      }
      let bezierCurveTest = new BazierCurve(options)
      bezierCurveTest.isClose = true
      bezierCurveTest.draw(ctx)
    },
    handleImport (fileList) {
      ctx.clearRect(0, 0, canvasObj.width, canvasObj.height)  
      const imgSrc = this.getObjectURL(fileList[0])
      this.getImage(imgSrc)
    },
    handleClear () {
      ctx.clearRect(0, 0, canvasObj.width, canvasObj.height)
    },
    getImage (imgSrc) {
      const imageObj = new Image()
      const vm = this
      imageObj.src = imgSrc
      // debugger
      imageObj.onload = function() {
        // debugger
        const imageSize = vm.getImageSize(this.width, this.height)
        ctx.drawImage(this, imageSize.left, imageSize.top, imageSize.width, imageSize.height)
      }
    },
    getImageSize (oldWidth, oldHeight) {
      let imageSize = {}
      const imageScale = oldWidth / oldHeight
      const canvasScale = this.canvasWidth / this.canvasHeight
      if ( canvasScale > imageScale ) {
        imageSize.height = this.canvasHeight
        imageSize.width = this.canvasHeight * imageScale
        imageSize.top = 0
        imageSize.left = (this.canvasWidth - imageSize.width) / 2
      } else {
        imageSize.width = this.canvasWidth
        imageSize.height = this.canvasWidth / imageScale
        imageSize.top = (this.canvasHeight - imageSize.height) / 2
        imageSize.left = 0
      }
      return imageSize
    },
    getObjectURL (file) {
      var url = null;
      if (window.createObjectURL!=undefined) { // basic
          url = window.createObjectURL(file) ;
      } else if (window.URL!=undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file) ;
      } else if (window.webkitURL!=undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file) ;
      }
      return url ;
    }
  }
}
</script>
<style lang="sass">
.import-image 
  height: 100%
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
  .canvas-image
    background-color: #eeeeee
    height: 80vh
    width: 80vw
  .file-input
    margin-top: 2vh
</style>
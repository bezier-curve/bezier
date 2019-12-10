<template>
<div>
  <div class="header">
    <el-menu default-active="1" mode="horizontal">
      <el-menu-item index="1">
        <el-tooltip class="item" effect="dark" content="添加路径" placement="bottom">
          <i class="el-icon-location"></i>
        </el-tooltip>
      </el-menu-item>
      <el-menu-item index="2">
        <el-tooltip class="item" effect="dark" content="添加新路径" placement="bottom">
          <i class="el-icon-menu"></i>
        </el-tooltip>
      </el-menu-item>
      <el-menu-item index="3">
        <el-tooltip class="item" effect="dark" content="重绘" placement="bottom">
          <i class="el-icon-document"></i>
        </el-tooltip>
      </el-menu-item>
      <el-submenu index="4">
        <template slot="title">
          <el-tooltip class="item" effect="dark" content="速度选择" placement="bottom">
            <i class="el-icon-setting"></i>
          </el-tooltip>
        </template>
        <el-menu-item index="4-1">
          <el-slider v-model="speed"></el-slider>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="5">
        <template slot="title">
          <el-tooltip class="item" effect="dark" content="颜色选择" placement="bottom">
            <el-color-picker v-model="color" show-alpha size="mini"></el-color-picker>
          </el-tooltip>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
  <div class="import-image">
    <el-upload
      v-if="uploadShow"
      class="upload-demo"
      drag
      action="/aa"
      multiple
      :auto-upload=false
      :on-change="getFile"
      @handleImport="handleImport">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <canvas v-show="canvasShow" class="canvas-image" :width=canvasWidth :height=canvasHeight></canvas>
    <bezier-cancas :bezierStyle=bezierStyle :isVisible=isVisible style="position: absolute"></bezier-cancas>
    <!-- <button>添加文件</button> -->
    <!-- <div class="file-input">
      <bezier-button :title="`选择图片`" @handleImport="handleImport"></bezier-button>
      <bezier-button :title="`清除画图`" :type="`button`" @handleClick="handleClear"></bezier-button>
      <bezier-button :title="`画一条线`" :type="`button`" @handleClick="drawBazierCurve"></bezier-button>
    </div> -->
  </div>
</div>

</template>
<script>
// import BezierButton from '@/components/BezierButton.vue'
import BazierCurve from '../utils/bezierCurve.js'
import BezierCancas from './bezier/BezierCanvas.vue'
let canvasObj, ctx
export default {
  data() {
    return {
      canvasWidth: 0,
      canvasHeight: 0,
      bezierStyle: {},
      isVisible: false,
      canvasShow: false,
      file: {},
      uploadShow: true,
      speed: 20,
      color: 'rgba(19, 206, 102, 0.8)'
    }
  },
  components: {
    // BezierButton,
    BezierCancas
  },
  mounted () {
    canvasObj = document.getElementsByClassName('canvas-image')[0]
    ctx = canvasObj.getContext('2d')
    this.canvasWidth = document.documentElement.clientWidth //  //canvasObj.offsetWidth
    this.canvasHeight = document.documentElement.clientHeight - 61  //  //canvasObj.offsetHeight
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
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
    getFile(err, file) {
      this.file = file[0].raw;
      this.canvasShow = true;
      this.handleImport();
      this.uploadShow = false;
    },
    handleImport () {
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)  
      const imgSrc = this.getObjectURL(this.file)
      this.getImage(imgSrc)
    },
    handleClear () {
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      this.isVisible = false
    },
    handleDispaly (code) {
      this.bezierCode.code = code
      this.bezierCode.isVisible = true
    },
    getImage (imgSrc) {
      const imageObj = new Image()
      const vm = this
      imageObj.src = imgSrc
      imageObj.onload = function() {
        // debugger
        const imageSize = vm.getImageSize(this.width, this.height)
        ctx.drawImage(this, imageSize.left, imageSize.top, imageSize.width, imageSize.height)
      }
    },
    getImageSize (oldWidth, oldHeight) {
      let imageSize = {}
      // debugger
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
      let {offsetTop, offsetLeft} = document.getElementsByClassName('canvas-image')[0]
      this.bezierStyle = {
        width: imageSize.width + 'px',
        height: imageSize.height + 'px',
        top: imageSize.top + offsetTop + 'px',
        left: imageSize.left + offsetLeft + 'px'
      }
      this.isVisible = true
      return imageSize
    },
    getObjectURL (file) {
      // debugger
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
  .file-input
    margin-top: 2vh
.upload-demo
  margin-top: 30vh
</style>
<template>
<div>
  <div class="header">
    <el-menu default-active="1" mode="horizontal">
      <el-menu-item index="1" @click="btnOperation(1)">
        <el-tooltip v-if="!currentAnimationState" class="item" effect="dark" content="开始当前操作路径动画" placement="bottom">
          <i class="el-icon-location"></i>
        </el-tooltip>
        <el-tooltip v-else class="item" effect="dark" content="停下" placement="bottom">
          <i class="el-icon-video-pause"></i>
        </el-tooltip>
      </el-menu-item>
      <el-menu-item index="2" @click="btnOperation(2)">
        <el-tooltip v-if="!allAnimationState" class="item" effect="dark" content="开始全路径动画" placement="bottom">
          <i class="el-icon-menu"></i>
        </el-tooltip>
        <el-tooltip v-else class="item" effect="dark" content="停下" placement="bottom">
          <i class="el-icon-video-pause"></i>
        </el-tooltip>
      </el-menu-item>
      <!-- <el-menu-item index="3" @click="btnOperation(3)">
        <el-tooltip class="item" effect="dark" content="停下" placement="bottom">
          <i class="el-icon-video-pause"></i>
        </el-tooltip>
      </el-menu-item> -->
      <el-submenu index="4">
        <template slot="title">
          <el-tooltip class="item" effect="dark" content="速度选择" placement="bottom">
            <i class="el-icon-setting"></i>
          </el-tooltip>
        </template>
        <el-menu-item index="4-1">
          <el-slider :max=0.1 :step=0.01 :min=0  v-model="speed" @change="btnOperation(4)"></el-slider>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="5">
        <template slot="title">
          <el-tooltip class="item" effect="dark" content="更改小球颜色" placement="bottom">
            <el-color-picker v-model="ballColor" color-format='hex' @active-change='getBallColor'  size="mini"></el-color-picker>
          </el-tooltip>
        </template>
      </el-menu-item>
      <el-menu-item index="6"> 
        <!-- @click="btnOperation(6)" -->
        <template slot="title">
          <el-tooltip class="item" effect="dark" content="更改曲线颜色" placement="bottom">
            <el-color-picker v-model="curveColor" color-format='hex' @active-change='getCurveColor' size="mini"></el-color-picker>
          </el-tooltip>
        </template>
      </el-menu-item>
      <el-submenu index="7">
        <template slot="title">
          <el-tooltip class="item" effect="dark" content="更改曲线粗细" placement="bottom">
            <i class="el-icon-s-open"></i>
          </el-tooltip>
        </template>
        <el-menu-item index="7-1">
          <el-slider v-model="curveSize" @change="btnOperation(7)"></el-slider>
        </el-menu-item>
      </el-submenu>
      <!-- <el-submenu index="15" @click="btnOperation(15)"> -->
        
        <el-menu-item index="15-1">
          <!-- <template slot="title">
            <el-tooltip class="item" effect="dark" content="" placement="bottom">
              <i class="el-icon-s-open"></i>
            </el-tooltip>
          </template> -->
          <el-input v-model="animationNum" size='mini' style="width:140px" placeholder="设置移动图标个数"></el-input>
        </el-menu-item>
      <!-- </el-submenu> -->
      <el-menu-item index="14" @click="btnOperation(14)">
        <template slot="title">
          <!-- <el-tooltip class="item" effect="dark" content="更改动态图标" placement="bottom"> -->
            <!-- <i class="el-icon-s-open"></i> -->
            <el-select @change="getAnimationType" v-model="AnimationType" style="width:130px" size='mini' placeholder="更改移动图标">
            <el-option
              v-for="item in AnimationTypes"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
          <!-- </el-tooltip> -->
        </template>
      </el-menu-item>
      <el-menu-item index="8" @click="btnOperation(8)">
        <el-tooltip class="item" effect="dark" content="重绘" placement="bottom">
          <i class="el-icon-refresh"></i>
        </el-tooltip>
      </el-menu-item> 
      <el-menu-item index="11" @click="btnOperation(11)">
        <el-tooltip class="item" effect="dark" content="回退" placement="bottom">
          <i class="el-icon-arrow-left"></i>
        </el-tooltip>
      </el-menu-item>
      <el-menu-item index="12" @click="btnOperation(12)">
        <el-tooltip class="item" effect="dark" content="前进" placement="bottom">
          <i class="el-icon-arrow-right"></i>
        </el-tooltip>
      </el-menu-item>
      <el-menu-item index="13" @click="btnOperation(13)">
        <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
          <i class="el-icon-edit"></i>
        </el-tooltip>
      </el-menu-item>
      <el-menu-item index="9" @click="btnOperation(9)">
        <el-tooltip class="item" effect="dark" content="加入路径" placement="bottom">
          <!-- <i class="el-icon-menu"></i> -->
          <span>加入路径</span> 
        </el-tooltip>
      </el-menu-item>
      <el-menu-item index="10" @click="btnOperation(10)">
        <el-tooltip class="item" effect="dark" content="加入新路径" placement="bottom">
          <!-- <i class="el-icon-menu"></i> -->
          <span>加入新路径</span> 
        </el-tooltip>
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
    <bezier-cancas  ref="buttonList" :bezierStyle=bezierStyle :isVisible=isVisible style="position: absolute" @generateCode="generateCode"></bezier-cancas>
    <bezier-code :isCodeShow="isCodeShow" :code="code" @close="handleClose"></bezier-code>
    <!-- <button>添加文件</button> -->
    <!-- <div class="file-input">
      <bezier-button :title="`选择图片`" @handleImport="handleImport"></bezier-button>
      <bezier-button :title="`清除画图`" :type="`button`" @handleClick="handleClear"></bezier-button>
      <bezier-button :title="`画一条线`" :type="`button`" @handleClick="drawBazierCurve"></bezier-button>
    </div> -->
  </div>
  <el-dialog
    :visible="uploadImgIcon"
    title="上传图标"
    width="50%"
    @close="closeDialog">
      <el-upload
        drag
        action="/aa"
        multiple
        :auto-upload=false
        :on-change="getFile"
        @handleImport="handleImport">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="closeDialog">确 定</el-button>
    </span>
  </el-dialog>
</div>

</template>
<script>
import BezierCode from '@/components/BezierCode.vue'
import BazierCurve from '../utils/bezierCurve.js'
import BezierCancas from './bezier/BezierCanvas.vue'
import { _changPointsStyle, _changCurveStyle } from '../assets/drawTool.js'
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
      speed: 20,  // <0.1
      ballColor: '#409EFF',
      curveColor: '#409EFF',
      curveSize: 0,
      currentAnimationState: false,   //控制 开始当前操作路径动画 状态 false 未开始  true 正在进行
      allAnimationState: false,      //  开始全路径动画
      AnimationType: '',
      AnimationTypes: [{
        text: '上传图标',
        value: 'add'
      }, {
        text: '实心圆',
        value: 'aa'
      }, {
        text: '空心圆',
        value: 'bb'
      }],
      uploadImgIcon: false,
      animationNum: 1,
      isCodeShow: false,
      code: ''
    }
  },
  components: {
    BezierCode,
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
    btnOperation(index) {
      switch(index){
        case 1:    //开始当前操作路径动画
          this.$refs.buttonList.beginMotion();
          this.currentAnimationState = !this.currentAnimationState;
          break;
        case 2:   //开始全路径动画
          this.$refs.buttonList.beginMotionA();
          this.allAnimationState = !this.allAnimationState;
          break;
        // case 3:    //停下
        case 4:    //速度选择
          this.$refs.buttonList.movingBallSpeed = this.speed;
          break;
/*         case 5:    //更改小球颜色
          break;
        case 6:     //更改曲线颜色
          break; */
        case 7:     //调整曲线粗细
          if(this.$refs.buttonList.gIndex > 0) {
            _changCurveStyle(this.$refs.buttonList.allBezierData, 'size', this.curveSize, this.$refs.buttonList.gIndex);
          } else {
            _changCurveStyle(this.$refs.buttonList.allBezierData, 'size', this.curveSize);
          }
          break;
        case 8:     //重绘
          this.$refs.buttonList.redraw();
          break;
        case 9:     //加入路径
          this.$refs.buttonList.joinPath();
          break;
        case 10:   //加入新路径
          this.$refs.buttonList.anotherPath();
          break;
        case 11:   //回退
          this.$refs.buttonList.back();
          break;
        case 12:    //前进
          this.$refs.buttonList.forward();
          break;
        case 13:    //修改
          this.$refs.buttonList.edit();
          break;
        case 14:   //更换移动图标
          this.$refs.buttonList.movingBallType = this.AnimationType;
          break;
        case 15:    //更改移动图标个数
          this.$refs.buttonList.movingBallNum = this.animationNum;
          break;
      }
    },
    getCurveColor(color) {
      if(this.$refs.buttonList.gIndex > 0) {
        _changCurveStyle(this.$refs.buttonList.allBezierData, 'color', color, this.$refs.buttonList.gIndex);
      } else {
        _changCurveStyle(this.$refs.buttonList.allBezierData, 'color', color);
      }
    },
    getBallColor(color) {
      _changPointsStyle(this.$refs.buttonList.allBezierData, 'color', color);
    },
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
    handleClose() {
      this.isCodeShow = false
      this.code = ''
    },
    generateCode(code) {
      this.isCodeShow = true
      this.code = code
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
    },
    getAnimationType (type) {
      if (type == 'add') {
        // 显示上传图片弹框
        this.uploadImgIcon = true;
      }
    },
    closeDialog () {
      this.uploadImgIcon = false;
      this.AnimationType = '';
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
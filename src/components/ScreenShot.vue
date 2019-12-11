<template>
  <div>
    <!-- <div class="screen-shot"> -->
      <!-- <canvas class="canvas"></canvas> -->
      <!-- <div></div> -->
      <!-- <bezier-button class="bezier-button" :title="`清除画图`" :type="`button`"></bezier-button> -->
    <!-- </div> -->
    <!-- <button @click="handleClick()">点击复制</button> -->
    <bezier-curve :options="options"></bezier-curve>
    <!-- <image src="../../static/test1.png"></image> -->
  </div>
</template>
<script>
// import html2canvas from 'html2canvas'
// import BezierButton from '../assets/test1.png'
import options from '../assets/test.json'
import BezierCurve from '@/components/BezierCurve.vue'
export default {
  components: {
    BezierCurve
  },
  data() {
    return {
      options: ''
    }
  },
  created() {
    this.options = options
  },
  methods: {
    handleClick() {
      // const element = document.getElementsByClassName('bezier-button')[0]
      // html2canvas(element).then((canvas) => {
      //   console.log('imageurl', canvas.toDataURL('image/jpeg', 0.9))
      //   document.body.appendChild(canvas);
      // })
    }
  }
}
</script>
<style lang="sass" scoped>
// .screen-shot
  // height: 300px
  // width: 300px
  // background-color: #409e9e
  // .canvas
  //   background-color: #409e9e
</style>
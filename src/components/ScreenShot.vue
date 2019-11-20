<template>
  <div>
    <div class="screen-shot">
      <!-- <canvas class="canvas"></canvas> -->
      <!-- <div></div> -->
      <bezier-button class="bezier-button" :title="`清除画图`" :type="`button`"></bezier-button>
    </div>
    <button @click="handleClick()">点击复制</button>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
import BezierButton from '@/components/BezierButton.vue'
export default {
  components: {
    BezierButton
  },
  mounted() {

  },
  methods: {
    handleClick() {
      const element = document.getElementsByClassName('bezier-button')[0]
      html2canvas(element).then((canvas) => {
        console.log('imageurl', canvas.toDataURL('image/jpeg', 0.9))
        document.body.appendChild(canvas);
      })
    }
  }
}
</script>
<style lang="sass" scoped>
.screen-shot
  // height: 300px
  // width: 300px
  // background-color: #409e9e
  .canvas
    background-color: #409e9e
</style>
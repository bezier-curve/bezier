<template>
  <div>
    <div class="placehold">
      <bezier-curve class="bazier-curve" :options="options"></bezier-curve>
    </div>
  
  </div>
</template>
<script>

import options from '../assets/test.json'
import BezierCurve from '@/components/BezierCurve.vue'
export default {
  components: {
    BezierCurve
  },
  data() {
    return {
      options: '',
    }
  },
  created() {
    this.options = options
  },
  methods: {
  }
}
</script>
<style lang="sass" scoped>
.placehold
  height: 800px
  width:600px
  background-color: #eee
  
  top: 0px
  left: 0px
.bazier-curve
  // position: absolute
  // z-index: 9999
// .screen-shot
  // height: 300px
  // width: 300px
  // background-color: #409e9e
  // .canvas
  //   background-color: #409e9e
</style>
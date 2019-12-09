<template>
  <canvas></canvas>
</template>

<script>
import {
  _drawCurveALL,
  _drawPointsALL,
  _drawAnimationALL,
  _drawAnimation,
  _drawPoints,
  _drawCurve
} from "../../assets/drawTool";
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    draw() {
      contextBuffer.clearRect(0, 0, oCanvas.width, oCanvas.height);
      // this.movePoint();
      if (this.allBezierData.length > 0) {
        this.allBezierData.forEach((item, index) => {
          // console.log(item.bezierCurve)
          // contextBuffer.clearRect(0, 0, oCanvas.width, oCanvas.height);
          _drawPointsALL(item.bezierCurve, contextBuffer);
          _drawCurveALL(item.bezierCurve, contextBuffer);
          if (this.allMotionState) {
            _drawAnimationALL(
              item.bezierCurve,
              index,
              this.allBalls,
              contextBuffer,
              this.img
            );
          }
        });
      }
      _drawPoints(this.pointsArr.bezierCurve, this.bezierCurve, contextBuffer);
      //画曲线函数(路径数组，当前画的未加入路径的路径点)
      _drawCurve(this.pointsArr.bezierCurve, this.bezierCurve, contextBuffer);
      //画路径中点的动画
      if (this.motionState && this.pointsArr.bezierCurve.length != 0) {
        //运动状态为true,路径点数组长度不为0
        _drawAnimation(
          this.pointsArr.bezierCurve,
          this.balls,
          contextBuffer,
          this.img
        );
      }
      //描点函数(路径数组，当前画的未加入路径的路径点)
      ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
      ctx.drawImage(canvasBuffer, 0, 0);
      // ctx.fill();
    },
  }
}
</script>

<style>

</style>
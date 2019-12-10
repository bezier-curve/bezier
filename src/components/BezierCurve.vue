<template>
  <canvas class="bezier-curve"></canvas>
</template>

<script>
import {
  _drawCurveALL,
  _drawPointsALL,
  _drawAnimationALL,
  // _drawAnimation,
  // _drawPoints,
  // _drawCurve
} from "../assets/drawTool.js";
// import animationBall from "../../assets/animationBall";
import BezierBall from "../assets/bezierBall";
import BezierCurve from "../assets/bezierCurve";
import JointBezier from "../assets/jointBezier";
let oCanvas;
let ctx;
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      allBezierData: {}
    }
  },
  mounted() {
    this.allBezierData = this.genJointBezier(JSON.parse(this.options))
  },
  methods: {
    initCanvas() {
      // oCanvas = document.querySelector("canvas");
      oCanvas = document.getElementsByClassName("bezier-curve")[0];
      // oCanvas.width = parseFloat(this.bezierStyle.width) || window.innerWidth;
      // oCanvas.height = parseFloat(this.bezierStyle.width) || window.innerHeight;
      oCanvas.width = window.innerWidth;
      oCanvas.height = window.innerHeight;
      ctx = oCanvas.getContext("2d");
      ctx.font = "14px Courier";
      ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
      // oCanvas.width = parseFloat(this.bezierStyle.width) || window.innerWidth;
      // oCanvas.height =
      //   parseFloat(this.bezierStyle.height) || window.innerHeight;
      window.requestAnimationFrame(this.render.bind(this));
    },
    genJointBezier(options) {
      if (options) {
        options.forEach(item => {
          new JointBezier(item)
          this.genBezierCurve(item.bezierCurve)
        })
      }
    },
    genBezierCurve (curves) {
      if (curves) {
        curves.forEach(item => {
          new BezierCurve(item)
          this.genBezierBall(item)
        })
      }
    },
    genBezierBall (balls) {
      if (balls) {
        for (let item in balls) {
          new BezierBall(item)
        }
      }
    },
    draw() {
      oCanvas.clearRect(0, 0, oCanvas.width, oCanvas.height);
      // this.movePoint();
      if (this.allBezierData.length > 0) {
        this.allBezierData.forEach((item, index) => {
          // console.log(item.bezierCurve)
          // contextBuffer.clearRect(0, 0, oCanvas.width, oCanvas.height);
          _drawPointsALL(item.bezierCurve, ctx);
          _drawCurveALL(item.bezierCurve, ctx);
          if (this.allMotionState) {
            _drawAnimationALL(
              item.bezierCurve,
              index,
              this.allBalls,
              ctx,
              this.img
            );
          }
        });
      }
      // _drawPoints(this.pointsArr.bezierCurve, this.bezierCurve, ctx);
      // //画曲线函数(路径数组，当前画的未加入路径的路径点)
      // _drawCurve(this.pointsArr.bezierCurve, this.bezierCurve, ctx);
      // //画路径中点的动画
      // if (this.motionState && this.pointsArr.bezierCurve.length != 0) {
      //   //运动状态为true,路径点数组长度不为0
      //   _drawAnimation(
      //     this.pointsArr.bezierCurve,
      //     this.balls,
      //     ctx,
      //     this.img
      //   );
      // }
      //描点函数(路径数组，当前画的未加入路径的路径点)
      ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
      // ctx.drawImage(canvasBuffer, 0, 0);
      // ctx.fill();
    },
    render() {
      this.draw();
      window.requestAnimationFrame(this.render.bind(this));
    }
  }
}
</script>

<style>

</style>
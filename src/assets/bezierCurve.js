// import
class BezierCurve {
  constructor(options, scale) {
    this.points = options.points||[]
    this.color = options.color || '#66FFFF'
    // this.editColor =  '#764587'
    this.size = options.size * (scale || 1) || 2
    this.parentIndex = options.parentIndex || 0
    this.index = options.index || 0
    this.isSelected = false
    this.isClose = false
    this.Tspeed = 0.01
  }
  draw (ctx) {
    // 画曲线
    this.drawCurve(ctx)
    if (!this.isClose) {
      //画控制线2
      this._drawCtrl2(ctx)
      //画控制线1
      this._drawCtrl1(ctx)
    }
  }
  update () {
    this.color = this.isSelected ? this.color : '#111'
    // this.drawCurve(ctx)
  }
  drawCurve (ctx,editOn,pIndex,gIndex) {
    // if(!this.isSelected){
      ctx.beginPath()
      ctx.moveTo(this.points.start.x, this.points.start.y)
      ctx.bezierCurveTo(this.points.c1.x, this.points.c1.y, this.points.c2.x, this.points.c2.y, this.points.end.x, this.points.end.y)
      ctx.lineWidth = this.size
      if(editOn){
        // ctx.strokeStyle = this.isSelected?this.editColor:"#F00"
        if(this.parentIndex == gIndex){
          if(this.index == pIndex){
            ctx.strokeStyle = this.color
          }else{
            ctx.strokeStyle = "#FF0"
          }
        }else{
          ctx.strokeStyle = this.color
        }
      }else{
        ctx.strokeStyle = this.color
      }
      ctx.stroke()
      ctx.closePath();
    // }
  } 
  _drawCtrl1 (ctx) {
    ctx.lineWidth = 2
    ctx.strokeStyle = '#333'
    ctx.beginPath()
    ctx.moveTo(this.points.start.x, this.points.start.y)
    ctx.lineTo(this.points.c1.x, this.points.c1.y)
    ctx.stroke()
    ctx.closePath()
  }
  _drawCtrl2 (ctx) {
    ctx.lineWidth = 2
    ctx.strokeStyle = '#333'
    ctx.beginPath()
    ctx.moveTo(this.points.end.x, this.points.end.y)
    ctx.lineTo(this.points.c2.x, this.points.c2.y)
    ctx.stroke()
    ctx.closePath()
  }
}
export default BezierCurve
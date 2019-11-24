// import
export default class BezierCurve {
  constructor(options) {
    this.points = options.points||[]
    this.color = options.color || '#0F0'
    this.size = options.size || 2
    this.parent = options.parent || 0
    this.end = options.points.end
    this.index = options.index || 0
    this.isSelected = true
    this.isClose = false
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
  drawCurve (ctx) {
    ctx.beginPath()
    ctx.moveTo(this.points.start.x, this.points.start.y)
    ctx.bezierCurveTo(this.points.cp1.x, this.points.cp1.y, this.points.cp2.x, this.points.cp2.y, this.points.end.x, this.points.end.y)
    ctx.lineWidth = this.size
    ctx.strokeStyle = this.color
    ctx.stroke()
  } 
  _drawCtrl1 (ctx) {
    ctx.lineWidth = 2
    ctx.strokeStyle = '#666'
    ctx.beginPath()
    ctx.moveTo(this.points.start.x, this.points.start.y)
    ctx.lineTo(this.points.cp1.x, this.points.cp1.y)
    ctx.stroke()
  }
  _drawCtrl2 (ctx) {
    ctx.lineWidth = 2
    ctx.strokeStyle = '#111'
    ctx.beginPath()
    ctx.moveTo(this.points.end.x, this.points.end.y)
    ctx.lineTo(this.points.cp2.x, this.points.cp2.y)
    ctx.stroke()
  }
}
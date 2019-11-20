class animationBall {
    constructor(o) {
        this.x = o.x || 0,
            this.y = o.y || 0,
            this.color = o.color || '#0F0',
            this.radius = o.radius || 10,
            this.visible = o.visible || true,
            this.t = o.t || 0,
            this.loopIndex = o.loopIndex || 0
            this.oldLoopIndex = o.oldLoopIndex || 0
    }
    drawBall(ctx) {
        if (!this.visible) { return }  // 不可见
        //画一个实心圆
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false) // 顺时针
        ctx.fillStyle = this.color;//填充颜色,默认是黑色
        ctx.fill()//画实心圆
    }
    update(m_x, m_y) {
        if (this.isSelect) {
            this.x = m_x;
            this.y = m_y;
        }
    }
}
export default animationBall
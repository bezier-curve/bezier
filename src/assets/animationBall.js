class animationBall {
    constructor(o,type) {
        this.x = o.x || 0,
            this.y = o.y || 0,
            this.color = o.color || '#0F0',
            this.radius = o.radius || 10,
            this.visible = o.visible || true,
            this.t = o.t || 0,
            this.loopIndex = o.loopIndex || 0
            this.oldLoopIndex = o.oldLoopIndex || 0
            this.type = type||'ball',
            this.img = o.img||null,
            this.angle = 0
    }
    drawTo(ctx) {
        switch (this.type) {
            case 'ball':
                this.drawBall(ctx)
                break;
            case "img":
                this.drawImg(ctx)
                break;
            default:
                this.drawBall(ctx)
        }
    }
    drawImg(){
        if (!this.visible) { return }  // 不可见
        //画一个实心圆
        ctx.save()
        ctx.beginPath()
        ctx.translate(this.x, this.y);
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false) // 顺时针
        ctx.fillStyle = this.color;//填充颜色,默认是黑色
        ctx.fill()//画实心圆
        ctx.restore()
    }
    drawBall(ctx,img) {
        if (!this.visible) { return }  // 不可见
        //画一个实心圆
        ctx.save()
        ctx.beginPath()
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle+1)
        ctx.translate(-this.x, -this.y);
        ctx.drawImage(img, this.x - 20, this.y - 20, 39, 38);
        // ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false) // 顺时针
        // ctx.fillStyle = this.color;//填充颜色,默认是黑色
        ctx.fill()//画实心圆
        ctx.restore()
        
        
    }
    update(m_x, m_y) {
        if (this.isSelect) {
            this.x = m_x;
            this.y = m_y;
        }
    }
}
export default animationBall
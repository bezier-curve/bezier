class BezierBall {
    constructor(o, pointType) {
        this.x = o.x || 0,
        this.y = o.y || 0,
        this.color = o.color || '#0F0',
        this.radius = o.radius || 10,
        this.visible = o.visible || true,
        this.isSelect = false,    //拖拽
        this.selectable = false,   //能否被选中
        // this.t = o.t || 0,
        this.parentIndex = o.parentIndex || 0,
        this.type = o.type,     //start, c1, c2, end
        this.img = o.img || '',
        this.opr = o.opr || 1,
        this.pointType = pointType || 'ball'
    }
    drawBall(ctx) {
        if (!this.visible) { return }  // 不可见
        //画一个实心圆
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false) // 顺时针
        ctx.fillStyle = this.color;//填充颜色,默认是黑色
        ctx.fill()//画实心圆
    }
    draw(ctx) {
        if(this.pointType == 'img') {
            this.drawImg(ctx)
        } else {
            this.drawBall(ctx)
        }
    }
    drawImg(ctx){
        if (!this.visible) { return }  // 不可见
        ctx.globalAlpha = this.opr;
        ctx.drawImage(this.img, this.x - this.img.width/2, this.y - this.img.heigth/2, 40, 40);
    }
    update(m_x, m_y) {
        if (this.selectable && this.isSelect) {
            this.x = m_x;
            this.y = m_y;
        }
        // isselect visible  parentIndex    
    }
    drag() {
        /* if(this.isSelect && this.visible) {
        } */
    }
}
export default BezierBall
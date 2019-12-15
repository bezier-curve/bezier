class BezierBall {
    constructor(o, scale) {
        this.x = o.x * (scale || 1) || 0,
        this.y = o.y * (scale || 1) || 0,
        this.color = o.color || '#0F0',
        this.radius = o.radius * (scale || 1) || 4,
        this.visible = o.visible || true,
        this.isSelect = false,    //拖拽
        this.selectable = false,   //能否被选中
        // this.t = o.t || 0,
        this.parentIndex = o.parentIndex || 0,
        this.grandParentIndex = o.grandParentIndex || 0,
        this.type = o.type || 'start',     //start, c1, c2, end
        this.img = o.img || '',
        this.opr = o.opr || 1,
        this.size = o.size||2,
        this.animationSize = o.size||2,
        this.scale = scale || 1,
        this.animationRadius = 10;
        this.animationRadiusSpeed = 0.1;
        this.constColor = 0x0;
        // this.material = material || 'ball'
    }
    drawBall(ctx) {
        if (!this.visible) { return }  // 不可见
        //画一个实心圆
        if(this.type == 'start'||this.type == 'end'){
            // console.log('c1')
            this.drawNormal(ctx)
        }else{
            // console.log('c1')
            this.drawControl(ctx)
        }
    }
    drawNormal(ctx){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false) // 顺时针
        ctx.lineWidth = this.size;
        ctx.strokeStyle = this.color;//填充颜色,默认是黑色
        // ctx.fillText(this.type, this.x + 10, this.y + 10);
        ctx.stroke()//画实心圆
        ctx.closePath()
        ctx.beginPath()
        ctx.arc(this.x, this.y, 4 * this.scale, 0, 2 * Math.PI, false) // 顺时针
        ctx.fillStyle = this.color;//填充颜色,默认是黑色
        // ctx.fillText(this.type, this.x + 10, this.y + 10);
        ctx.fill()//画实心圆
        ctx.closePath()
    }
    drawControl(ctx){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.animationRadius, 0, 2 * Math.PI, false) // 顺时针
        ctx.strokeStyle = this.color;//填充颜色,默认是黑色
        // ctx.fillText(this.type, this.x + 10, this.y + 10);
        ctx.lineWidth = this.animationSize;
        ctx.stroke()//画实心圆
        ctx.closePath()
        if(this.animationRadius<10){
           this.animationRadiusSpeed = 0.1
        //    this.colorChange()
        }else if(this.animationRadius>16){
            // this.colorChange()
           this.animationRadiusSpeed = -0.1
        }
        this.animationSize += this.animationRadiusSpeed/4
        this.animationRadius += this.animationRadiusSpeed
    }
    draw(ctx,type) {
        if(this.pointType == 'img') {
            this.drawImg(ctx,type)
        } else {
            this.drawBall(ctx,type)
        }
    }
    drawImg(ctx){
        if (!this.visible) { return }  // 不可见
        ctx.globalAlpha = this.opr;
        ctx.drawImage(this.img, this.x - this.img.width/2, this.y - this.img.heigth/2, 40, 40);
    }
    MoveBall(m_x, m_y) {
        if (this.selectable && this.isSelect) {
            this.x = m_x;
            this.y = m_y;
        }
        // isselect visible  parentIndex    
    }
    colorChange() {
        let strColor = (Math.random() * 0xffffff).toString()
        // console.log(strColor.substring(strColor.length-6,strColor.length))
        this.color = "#" + strColor.substring(strColor.length-6,strColor.length); 
    }
}
export default BezierBall
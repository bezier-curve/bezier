class basicObj {
    constructor(o,type) {
        this.x = o.x || 0,
        this.y = o.y || 0,
        this.color = o.color || '#F00',
        this.type = type || 'ball',
        this.radius = o.radius || 30,
        this.visible = o.visible || true,
        this.img = o.img || { src: '', width: 0, heigth: 0 },
        this.opr = o.opr || 1
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
    drawBall(ctx) {
        if (!this.visible) { return }  // 不可见
        //画一个实心圆
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false) // 顺时针
        ctx.fillStyle = this.color;//填充颜色,默认是黑色
        ctx.fill()//画实心圆
    }
    drawImg(ctx) {
        if (!this.visible) { return }  // 不可见
        //画一个实心圆
        var img = new Image();
        img.src = this.img.src;
        ctx.globalAlpha = this.opr;
        ctx.drawImage(img, this.x - this.img.width/2, this.y - this.img.heigth/2, 40, 40);
    }
}
export default basicObj
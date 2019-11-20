	function random(min,max){
			return Math.random()*(max-min)+min;
		}
	function bbubble(w,h) {
			init:{
				this.x = random(500, w);
				this.y = random(500, h);
				this.r = 40;
				this.cr = Math.floor(random(0, 255));
				this.cg = Math.floor(random(0, 255));
				this.cb = Math.floor(random(0, 255));
				this.cop = 0.9;
				this.r1 = random(0, 3);
				this.xr = random(-3, 3);
				this.yr = random(-3, 3);
				this.oxr = random(-2, 2);
				this.oyr = random(-2, 2);
				this.opr = 0.9;
				this.speed = 4;
			}
			draw:{
				
				canvass.beginPath();
				canvass.fillStyle = 'rgba(' + this.cr + ',' + this.cg + ',' + this.cb + ',' + this.cop + ')';
				canvass.arc(this.x, this.y, this.r, 0, Math.PI * 2);
				canvass.globalAlpha = this.opr;
				canvass.fill();
			}
			crash:{
				for (let i = 0; i < bubbleArry.length; i++) {
					//确保不和自己对比  
					if (this != bubbleArry[i]) {
		
						let x1 = bubbleArry[i].x;
						let y1 = bubbleArry[i].y;
						let ca = this.x - x1;
						let cb = this.y - y1;
						let ba = this.r + bubbleArry[i].r;
						let cc = Math.abs(ca / (Math.abs(ca) + Math.abs(cb))) * this.speed;
						let cd = Math.abs(cb / (Math.abs(ca) + Math.abs(cb))) * this.speed;
						let ce = Math.pow(ca, 2) + Math.pow(cb, 2);
						let cf = Math.pow(ba, 2);
						//判断位置的平方和小球的圆心坐标的关系  
						if (ce < cf) {
							//判断传过来的小球对象，相对于碰撞小球的哪个方位  
							if (ca < 0) {
								if (cb < 0) {
									//小球对象在被碰小球的左上角  
									this.xr = -cc;
									this.yr = -cd;
									bubbleArry[i].xr = cc;
									bubbleArry[i].yr = cd;
								} else if (cb > 0) {
									//小球对象在被碰小球的左下角  
									this.xr = -cc;
									this.yr = cd;
									bubbleArry[i].xr = cc;
									bubbleArry[i].yr = -cd;
								}
							} else if (ca > 0) {
								if (cb < 0) {
									//小球对象在被碰撞小球的右上方  
									this.xr = cc;
									this.yr = -cd;
									bubbleArry[i].xr = -cc;
									bubbleArry[i].yr = cd;
								} else if (cb > 0) {
									//小球对象在被碰撞小球的右下方  
									this.xr = cc;
									this.yr = cd;
									bubbleArry[i].xr = -cc;
									bubbleArry[i].yr = -cd;
								}
							}
							break;
						}
					}
				}
			}
			update:{
				this.speed = 3;
				this.crash();
				this.x += this.xr;
				this.y += this.yr;
				this.r = 70;
				if (this.x - this.r < 0 || this.x + this.r > w) {
					this.xr = -this.xr;
				}
				if (this.y - this.r < 0 || this.y + this.r > h) {
					this.yr = -this.yr;
				}
				this.draw();
			}
		
	};
export default bbubble

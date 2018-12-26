define(["helper/transform2d"],function(Transform2D){
    class View{
        constructor(options){
            options = options || 
                {
                    //in pixels
                    center        : {x: 0, y: 0},
                    //in pixels
                    halfDimensions: {x: 0, y: 0},
                    //in proportions
                    viewPort      : {x: 0, y: 0, w: 0, h: 0}
                };
            Object.assign(this,options);
        }
        
        /**@param {CanvasRenderingContext2D} ctx*/
        applyTransform(ctx){
            const w  = ctx.canvas.width, 
                  h  = ctx.canvas.height, 
                  vp = this.viewPort,
                  c  = this.center,
                  hd = this.halfDimensions;
            //clip viewport
            ctx.beginPath();
            ctx.rect(w*vp.x, h*vp.y, w*vp.w, h*vp.h);
            ctx.clip();
            
            //move to viewport
            ctx.translate(w*vp.x, h*vp.y);
            //move to view center
            ctx.translate(c.x,c.y);
            //move to top left corner
            ctx.translate(-hd.x,-hd.y);
            
            ctx.scale(vp.h, vp.w);
            //ctx.scale(w/(hd.x*2), h/(hd.y*2));
            
            //scale around it
            
            
            
            
        }
        getWorldTransform(ctx){
            const w  = ctx.canvas.width, 
                  h  = ctx.canvas.height, 
                  c  = this.center,
                  hd = this.halfDimensions;
            
            let ret = new Transform2D();
            //move to view in World units so no division by scale
            ret.translate(-c.x + hd.x, -c.y + hd.y);
            //scale view
            ret.scale(w/(hd.x*2), h/(hd.y*2));
            return ret;
        }
        getViewPortTransform(ctx){
            const w  = ctx.canvas.width, 
                  h  = ctx.canvas.height, 
                  vp = this.viewPort;
            
            let ret = new Transform2D();
            //move to viewposrt
            ret.translate(vp.x*w,vp.y*h);
            //scale to viewport
            ret.scale(vp.w, vp.h);
            return ret;
        }
    }
    return View;
});
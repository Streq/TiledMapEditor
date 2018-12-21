define(function(){
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
            //*
            
            
            //clip viewport
            ctx.beginPath();
            ctx.rect(w*vp.x, h*vp.y, w*vp.w, h*vp.h);
            ctx.clip();
            
            //scale view
            let sx = vp.w*w/(hd.x*2);
            let sy = vp.h*h/(hd.y*2);
            
            ctx.scale(sx, sy);
            
            //move to view
            //World units so no division by scale
            ctx.translate(-c.x + hd.x, -c.y + hd.y);
            //canvas units so division by scale
            ctx.translate(+w*vp.x/sx, +h*vp.y/sy);
            
            //ctx.translate(-c.x + w*vp.x, -c.y + w*vp.y);
            
            /**/
            
            
        }
        
    }
    return View;
});
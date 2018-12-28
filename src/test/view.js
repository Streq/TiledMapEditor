requirejs(["helper/dom","helper/view"],function(dom,View){
    let blocks = [
                 [0,0,200,200,"black"],
                 [200,200,200,200,"cyan"],
                 [0,200,200,200,"yellow"],
                 [200,0,200,200,"orange"],
                 [0,0,20,20,"yellow"],
                 [100,0,20,20,"yellow"],
                 [30,40,20,20,"yellow"],
                 [100,100,20,20,"yellow"],
                 [85,50,20,20,"yellow"],
                 [50,10,20,20,"yellow"],
                 [200+0,0,20,20,"cyan"],
                 [200+100,0,20,20,"cyan"],
                 [200+30,40,20,20,"cyan"],
                 [200+100,100,20,20,"cyan"],
                 [200+85,50,20,20,"cyan"],
                 [200+50,10,20,20,"cyan"],
                 [200+0,200+0,20,20,"orange"],
                 [200+100,200+0,20,20,"orange"],
                 [200+30,200+40,20,20,"orange"],
                 [200+100,200+100,20,20,"orange"],
                 [200+85,200+50,20,20,"orange"],
                 [200+50,200+10,20,20,"orange"],
                 [85,200+50,20,20,"black"],
                 [50,200+10,20,20,"black"],
                 [0,200+0,20,20,"black"],
                 [100,200+0,20,20,"black"],
                 [30,200+40,20,20,"black"],
                 [100,200+100,20,20,"black"],
                 [85,200+50,20,20,"black"],
                 [50,200+10,20,20,"black"]
                 ];
    
    /**@param {HTMLCanvasElement} canvas1*/
    let canvas1 = dom.get("canvas");
    let canvas2 = dom.get("canvas2");
    
    let ctx1 = canvas1.getContext("2d");
    let ctx2 = canvas2.getContext("2d");
    
    
    let draw = (ctx)=>{
        ctx.fillStyle = "blue";
        ctx.fillRect(-100000,-100000,1000000+ctx.canvas.height,1000000+ctx.canvas.width);
        blocks.forEach((each)=>{
            ctx.fillStyle = each[4];
            ctx.fillRect(each[0],each[1],each[2],each[3]);
        });
    };
    
//*/
	function drawFrame(ctx2,view){
		let w = ctx2.canvas.width,
			h = ctx2.canvas.height,
			vp = view.viewPort;
		
		let frame = {
			x:vp.x*w,
			y:vp.y*h,
			w:vp.w*w,
			h:vp.h*h
		}
		ctx2.save();
		ctx2.strokeStyle="black";
		ctx2.beginPath();
		ctx2.rect(frame.x,frame.y,frame.w,frame.h);
        ctx2.stroke();
		ctx2.restore();
	}
    (()=>{
        let view = new View();
        view.center.x = 200;
        view.center.y = 200;
        view.halfDimensions.x = 300;
        view.halfDimensions.y = 300;
        view.viewPort.x = 0.0;
        view.viewPort.y = 0.0;
        view.viewPort.w = 0.5;
        view.viewPort.h = 0.5;
        
        ctx2.save();
        view.applyTransform(ctx2);
        draw(ctx2);
        ctx2.restore();
		drawFrame(ctx2,view);
        
    })();/**/
    
//*/
    (()=>{
        let view = new View();
        view.center.x = 200;
        view.center.y = 200;
        view.halfDimensions.x = 400;
        view.halfDimensions.y = 400;
        view.viewPort.x = 0.5;
        view.viewPort.y = 0.0;
        view.viewPort.w = 0.5;
        view.viewPort.h = 0.5;

        ctx2.save();
        view.applyTransform(ctx2);
        draw(ctx2);
        ctx2.restore();
		drawFrame(ctx2,view);
        
    })();/**/
//*/
    (()=>{
        let view = new View();
        view.center.x = 400;
        view.center.y = 400;
        view.halfDimensions.x = 400;
        view.halfDimensions.y = 400;
        view.viewPort.x = 0.0;
        view.viewPort.y = 0.5;
        view.viewPort.w = 0.5;
        view.viewPort.h = 0.5;

        ctx2.save();
        view.applyTransform(ctx2);
        draw(ctx2);
		ctx2.restore();
		drawFrame(ctx2,view);
    })();/**/
//*/
    (()=>{
        let ctx2 = canvas2.getContext("2d");
        ctx2.restore();
        let view = new View();
        view.center.x = 0;
        view.center.y = 0;
        view.halfDimensions.x = 400;
        view.halfDimensions.y = 400;
        view.viewPort.x = 0.5;
        view.viewPort.y = 0.5;
        view.viewPort.w = 0.5;
        view.viewPort.h = 0.5;

        ctx2.save();
        view.applyTransform(ctx2);
        draw(ctx2);
        ctx2.restore();
		drawFrame(ctx2,view);
        
    })();/**/
    
    draw(ctx1);
    
});
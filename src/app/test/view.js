requirejs(["helper/dom","helper/view"],function(dom,View){
    let blocks = [
                 [0,0,200,200,"white"],
                 [0,0,20,20,"purple"],
                 [100,0,20,20,"purple"],
                 [30,40,20,20,"purple"],
                 [100,100,20,20,"purple"],
                 [85,50,20,20,"purple"],
                 [50,10,20,20,"purple"],
                 [200+0,0,20,20,"red"],
                 [200+100,0,20,20,"red"],
                 [200+30,40,20,20,"red"],
                 [200+100,100,20,20,"red"],
                 [200+85,50,20,20,"red"],
                 [200+50,10,20,20,"red"],
                 [200,200,200,200,"cyan"],
                 [200+0,200+0,20,20,"green"],
                 [200+100,200+0,20,20,"green"],
                 [200+30,200+40,20,20,"green"],
                 [200+100,200+100,20,20,"green"],
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
    (()=>{
        let view = new View();
        view.center.x = 200;
        view.center.y = 200;
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
        
    })();/**/
    
//*/
    (()=>{
        let view = new View();
        view.center.x = 200;
        view.center.y = 200;
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
    })();/**/
//*/
    (()=>{
        let ctx2 = canvas2.getContext("2d");
        ctx2.restore();
        let view = new View();
        view.center.x = 200;
        view.center.y = 200;
        view.halfDimensions.x = 400;
        view.halfDimensions.y = 400;
        view.viewPort.x = 0.;
        view.viewPort.y = 0.;
        view.viewPort.w = 0.5;
        view.viewPort.h = 0.5;

        ctx2.save();
        view.applyTransform(ctx2);
        draw(ctx2);
        ctx2.restore();
        
    })();/**/
    
    draw(ctx1);
    
});
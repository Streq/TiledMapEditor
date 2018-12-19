define(["helper/dom","helper/view"],function(dom,View){
    class MapEditor {
        constructor(){
            this.x = 0;
            this.y = 0;
            this.view = new View();
        }
    }
    return MapEditor;
});
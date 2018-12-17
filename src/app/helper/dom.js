define(function(){
    return {
        create(html){
            var template = document.createElement('template')
              , text = html.trim();
            template.innerHTML = text;
            return template.content.firstChild;
        },

        get(id, root){
            root = root||document.body;
            return document.querySelector(`[app-id=${id}]`);
        },

        set(id, html, root){
            root = root||document.body;
            let target = this.get(id, root);
            if(!target){
                target = document.createElement("template");
                root.appendChild(target);
            }
            target.outerHTML = html;
            return target;
        },

        inner(id, value, root){
            root = root||document.body;
            let target = this.get(id);
            target.innerHTML = content;
            return target;
        }
    };
});
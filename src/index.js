requirejs.config({
    //By default load any module IDs from src/app
    baseUrl: 'src/app',
    //except, if the module ID starts with "dep",
    //load it from the src/dependencies directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        dep: '../dependencies'
    }
});
requirejs(["test/view"]);
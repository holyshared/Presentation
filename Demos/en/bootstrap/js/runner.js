(function(global, module){

    var p = null,
        bootstrapper = null;

    global.addEvent('domready', function(){

        p = new Presentation('presentation');

        bootstrapper = new Moostrap('async', module, {
            onBeforeBootstrap: function(key ,title, current, total){
                if ('console' in window){
                    console.log(current + '/' + total + ' ' + key + ' - ' + title + ' start');
                }
            },
            onAfterBootstrap: function(key ,title, current, total){
                if ('console' in window){
                    console.log(current + '/' + total + ' ' + key + ' - ' + title + ' start');
                }
            },
            onSuccess: function(){
                p.start();
            }
        });
        bootstrapper.execute(p);

    });

}(this, Presentation.Bootstrap.Module));
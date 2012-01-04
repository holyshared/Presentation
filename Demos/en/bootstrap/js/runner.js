(function(global, module){

    var p = null,
		bootstrapper = null;

    global.addEvent('domready', function(){

        p = new Presentation('presentation');

        bootstrapper = new Moostrap(Moostrap.ASYNC_EXECUTER, module, {
            onStart: function(){
				console.log('start!!');
            },
            onAfterBootstrap: function(key ,title, current, total){
                if ('console' in window){
					console.log(current + '/' + total + ' ' + key + ' - ' + title + ' complete');
                }
            },
            onSuccess: function(){
				p.displayFullScreen().start();
            },
            onFailure: function(){
				alert('oops!!');
            }
        });
		bootstrapper.execute(p);

	});

}(this, Presentation.Bootstrap.Module));
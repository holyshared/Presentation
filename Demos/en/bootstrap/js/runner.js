(function(global, module){

    global.addEvent('domready', function(){

	    var p = null,
			bootstrapper = null,
			adapter = null;

        p = new Presentation('presentation');

        bootstrapper = new Moostrap(Moostrap.ASYNC_EXECUTER, module);

		adapter = new BootstrapAdapter(bootstrapper);
		adapter.start(p);

	});

}(this, Presentation.Bootstrap.Module));
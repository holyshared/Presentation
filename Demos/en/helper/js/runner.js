(function(plugins){

this.addEvent('domready', function(){

    var p = new Presentation('presentation');

    p.addHelper(new plugins.CustumController())
        .addHelper(new plugins.ThemeSelector())
        .addHelper(new plugins.Keyboard())
        .addHelper(new plugins.Page());

	p.displayFullScreen()
		.start();

});

}.call(this, Presentation.Helper));
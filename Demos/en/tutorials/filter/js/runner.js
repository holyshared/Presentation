(function(yournamespace){

this.addEvent('domready', function(){

	var p = new Presentation('presentation');

    p.addFilter(yournamespace.KeywordFilter);

    p.addHelper(new Presentation.Helper.Controller());

	p.displayFullScreen()
		.start();

});

}.call(this, yournamespace));
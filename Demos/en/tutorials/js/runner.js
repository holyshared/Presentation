(function(yournamespace){

this.addEvent('domready', function(){

	var p = new Presentation('presentation');

    p.addFilter(yournamesapce.KeywordFilter);

    p.addHelper(new yournamesapce.Controller());

	p.displayFullScreen()
		.start();

});

}.call(this, yournamespace));
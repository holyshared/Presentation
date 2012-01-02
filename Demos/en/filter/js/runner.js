(function(win){

this.addEvent('domready', function(){

	var p = new Presentation('presentation');

	p.addHelper(new Presentation.Helper.Controller())
		.addHelper(new Presentation.Helper.Keyboard())
		.addHelper(new Presentation.Helper.Page());

	p.addFilter(filters.MarkdownFilter)
		.addFilter(filters.ProcessingFilter)
		.addFilter(filters.SyntaxHighlighterFilter);

	p.displayFullScreen()
		.start();

});

}.call(this, this));
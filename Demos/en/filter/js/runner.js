(function(plugins){

this.addEvent('domready', function(){

	var p = new Presentation('presentation');

	p.addHelper(new plugins.Controller())
		.addHelper(new plugins.Keyboard())
		.addHelper(new plugins.Page());

	p.addFilter(filters.MarkdownFilter)
		.addFilter(filters.ProcessingFilter)
		.addFilter(filters.SyntaxHighlighterFilter);

	p.displayFullScreen()
		.start();

});

}.call(this, Presentation.Helper));
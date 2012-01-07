(function(markdown, Module){

var markdown = this.markdown = markdown;

var handlers = markdown.handlers;

Module.register('showdown', {

	title: 'load markdown library',

	handler: handlers.isLoadedShowDown

});

Module.register('parser', {

	title: 'load markdown parser',

	handler: handlers.isLoadedParser

});

[1, 2, 3, 4, 5].each(function(order){

	name = 'content-' + order.toString();

	Module.register(name, {

		title: 'load presentation ' + name,
	
		configuration: 'content/' + name + '.md',
	
		handler: handlers.loadContent

	});

});

}(this.markdown || {}, Presentation.Bootstrap.Module));
(function(win, doc){

	win.addEvent('domready', function(){

		var presentation = new Presentation('presentation', {
			keyboard: {
				prev: ['j', 'left'],
				next: ['k', 'right'],
				first: '0',
				last: '4' //$
			},
			swipe: true
		});
		presentation.start();

	});

}(window, document));

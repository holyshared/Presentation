(function(win, doc){

	win.addEvent('domready', function(){

			var height = 0;
			if (win.innerHeight) {
				height = win.innerHeight;
			} else if (doc.documentElement.clientHeight) {
				height = doc.documentElement.clientHeight;
			} else if (doc.body.clientHeight) {
				height = doc.body.clientHeight;
			}

			var pht = (height/100) * 90;
			var phm = (height/100) * 80;

			var container = $('presentation').getElement('.container');
			var contents = container.getElements('.content');
			container.setStyle('height', height);
			contents.setStyle('height', phm);

			contents.setStyle('margin-top', -pht/2);

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

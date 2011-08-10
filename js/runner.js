(function(win, doc){

	win.addEvent('domready', function(){

		try {
			var height = 0;
			if (win.innerHeight) {
				height = win.innerHeight;
			} else if (doc.documentElement.clientHeight) {
				height = doc.documentElement.clientHeight;
			} else if (doc.body.clientHeight) {
				height = doc.body.clientHeight;
			}

			var content = $('presentation').getElement('.container');
//			var contents = content.getElements('.content');
			content.setStyle('height', height);
/*			contents.setStyle('height', height);
*/
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
		} catch(e) {
			alert(e);
		}

	});

}(window, document));

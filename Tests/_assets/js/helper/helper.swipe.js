(function(doc){

	window.addEventListener('load', function(){

		var container = $('container');

		var helper = new Presentation.Helper.Swipe();
		var controller = new Controller(container);
		controller.addHelper(helper);
		controller.start();

		var event = {};
		event.direction = 'left';
		event.start = { x: 0, y: 0 };
		event.end = { x: 0, y: 0 };

		$(doc.body).fireEvent('swipe', [event]);

	}, false);

}(document));
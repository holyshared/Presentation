(function(doc){

	window.addEventListener('load', function(){

		var container = $('container');

		var helper = new Presentation.Helper.Controller({
			first: 'firstButton',
			prev: 'prevButton',
			next: 'nextButton',
			last: 'lastButton'
		});
		var controller = new Controller(container);
		controller.addHelper(helper);

	}, false);

}(document));
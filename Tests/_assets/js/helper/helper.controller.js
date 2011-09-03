(function(doc){

	window.addEventListener('load', function(){

		var container = $('container');

		var helper = new Presentation.Helper.Controller({
			first: 'first',
			prev: 'prev',
			next: 'next',
			last: 'last'
		});
		var controller = new Controller(container);
		controller.addHelper(helper);

	}, false);

}(document));
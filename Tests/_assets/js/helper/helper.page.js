(function(doc){

	window.addEventListener('load', function(){

		var container = $('container');

		var helper = new Presentation.Helper.Page({
			current: 'currentPage',
			total: 'totalPages'
		});
		var controller = new Controller(container);
		controller.addHelper(helper);
		controller.start();

		controller.next();

	}, false);

}(document));
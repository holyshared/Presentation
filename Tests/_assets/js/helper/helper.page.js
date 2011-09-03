(function(doc){

	window.addEventListener('load', function(){

		var container = $('container');

		var helper = new Presentation.Helper.Page({
			current: 'current',
			total: 'total'
		});
		var controller = new Controller(container);
		controller.addHelper(helper);
		controller.next();

	}, false);

}(document));
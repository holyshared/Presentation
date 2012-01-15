(function(doc){

	window.addEventListener('load', function(){

		function Controller(){
		};

		Controller.implement({
			prev: function(){
				alert('prev');
			},
			next: function(){
				alert('next');
			},
			first: function(){
				alert('first');
			},
			last: function(){
				alert('last');
			}
		});
		Controller.implement(new Helper());
		Controller.implement(new Events());

		var helper = new Presentation.Helper.Keyboard({
			keybinds: {
				prev: ['j', 'left'],
				next: ['k', 'right'],
				first: '0',
				last: '4' //$
			}
		});
		var controller = new Controller();
		controller.addHelper(helper);

	}, false);

}(document));
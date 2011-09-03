(function(doc){

	window.addEventListener('load', function(){

		var testcases = [];

		testcases.push({
			title: 'fullscreen options',
			description : 'fullscreen options test.',
			fn: function(){

				var myPresen = new Presentation('container', {
					fullScreen: true
				});

			}
		});

		makeActions(testcases);

	}, false);

}(document));
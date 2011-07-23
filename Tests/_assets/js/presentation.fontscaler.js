(function(doc){

	window.addEventListener('load', function(){


		var testcases = [];

		testcases.push({
			title: 'FontScaler',
			description : 'FontScaler test.',
			fn: function(){

				var myPresen = new Presentation('container');
				myPresen.start();

			}
		});

		makeActions(testcases);

	}, false);

}(document));
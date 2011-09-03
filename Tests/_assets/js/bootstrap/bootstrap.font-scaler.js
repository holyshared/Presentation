(function(doc){

	window.addEventListener('load', function(){

		var testcases = [];

		testcases.push({
			title: 'font-scaler options',
			description : 'font-scaler options test.',
			fn: function(){

				var myPresen = new Presentation('container', {
					font: {
						width: 1024,
						height: 768
					}
				});

			}
		});

		makeActions(testcases);

	}, false);

}(document));
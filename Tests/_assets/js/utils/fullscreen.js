(function(doc){

	window.addEventListener('load', function(){

		var testcases = [];

		testcases.push({
			title: 'displayFulllScreen',
			description : 'displayFulllScreen method test.',
			fn: function(){

				var myPresen = new Presentation('presentation');
				myPresen.displayFullScreen()
					.start();

			//	log( (filter2Result == 2) ? 'Filter2 enable - assert ok' : 'Filter2 is not enable.' );
			//	log( (filter3Result == 2) ? 'Filter3 enable - assert ok' : 'Filter3 is not enable.' );

			}
		});

		makeActions(testcases);

	}, false);

}(document));
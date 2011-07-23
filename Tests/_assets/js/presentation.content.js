(function(doc){

	window.addEventListener('load', function(){

		var margin = {
			'margin-top': -(100/2),
			'margin-left': -(120/2)
		}; 

		var container = new Element('section', {
			'class': 'slideContainer'
		});

		var forwardElement = new Element('section', {
			'class': 'slideContent',
			'styles': Object.merge({
				'left': '150%'
			}, margin),
			'html': 'forwardElement'
		});

		var backwardElement = new Element('section', {
			'class': 'slideContent',
			'styles': Object.merge({
				'left': '150%'
			}, margin),
			'html': 'backwardElement'
		});

		var centerElement = new Element('section', {
			'class': 'slideContent',
			'styles': Object.merge({
				'left': '150%'
			}, margin),
			'html': 'centerElement'
		});

		container.adopt([
			forwardElement,
			backwardElement,
			centerElement
		]);
		container.inject($('mt-content'));


		var testcases = [];

		testcases.push({
			title: 'animation methods',
			description : 'forward, backward, center animaton test',
			fn: function(){

				var content = new Presentation.Content(forwardElement);
				content.forward();

				var content = new Presentation.Content(backwardElement);
				content.backward();

				var content = new Presentation.Content(centerElement);
				content.center();

			}
		});

		makeActions(testcases);

	}, false);

}(document));
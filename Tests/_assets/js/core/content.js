(function(doc){

	window.addEventListener('load', function(){

		var margin = {
			'margin-top': -(100/2),
			'margin-left': -(120/2)
		}; 

		var container = new Element('section', {
			'data-presentation-role': 'container'
		});

		var forwardElement = new Element('section', {
			'data-presentation-role': 'content',
			'styles': Object.merge({
				'left': '0%'
			}, margin),
			'html': 'forwardElement'
		});

		var backwardElement = new Element('section', {
			'data-presentation-role': 'content',
			'styles': Object.merge({
				'left': '150%'
			}, margin),
			'html': 'backwardElement'
		});

		var centerElement = new Element('section', {
			'data-presentation-role': 'content',
			'styles': Object.merge({
				'left': '0%'
			}, margin),
			'html': 'centerElement'
		});

		var eventElement = new Element('section', {
			'data-presentation-role': 'content',
			'styles': Object.merge({
				'left': '0%'
			}, margin),
			'html': 'eventElement'
		});

		container.adopt([
			forwardElement,
			backwardElement,
			centerElement,
			eventElement
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


		testcases.push({
			title: 'animation events',
			description : 'animation events',
			fn: function(){
				eventElement.setStyle('left', '0%');
				var content = new Presentation.Content(eventElement, {
					onTransitionStart: function(content){
						log('assert ok');
					},
					onTransitionEnd: function(content){
						log('assert ok');
					}
				});
				content.forward();
			}
		});

		makeActions(testcases);

	}, false);

}(document));
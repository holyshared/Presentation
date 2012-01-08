(function(doc){

	window.addEventListener('load', function(){

		var margin = {
//			'margin-top': -(100/2),
//			'margin-left': 0
		}; 

		var container = new Element('section', {
			'data-presentation-role': 'container'
		});

		var forwardElement = new Element('section', {
			'data-presentation-role': 'content',
			'styles': Object.merge({
				'left': '50%',
				'top': 0
			}, margin),
			'html': 'forwardElement'
		});

		var backwardElement = new Element('section', {
			'data-presentation-role': 'content',
			'styles': Object.merge({
				'left': '50%',
				'top': 170
			}, margin),
			'html': 'backwardElement'
		});

		var centerElement = new Element('section', {
			'data-presentation-role': 'content',
			'styles': Object.merge({
				'left': '-50%',
				'top': 340
			}, margin),
			'html': 'centerElement'
		});

		var eventElement = new Element('section', {
			'data-presentation-role': 'content',
			'styles': Object.merge({
				'left': '50%',
				'top': 510
			}, margin),
			'html': 'eventElement'
		});

		container.adopt([
			forwardElement,
			backwardElement,
			centerElement,
			eventElement
		]);

		var a = $('mt-content');
		container.inject(a);


		var testcases = [];


		testcases.push({
			title: 'forward methods',
			description : 'forward animaton test',
			fn: function(){
				var content = new Presentation.Content(forwardElement);
				content.forward();
			}
		});

		testcases.push({
			title: 'backward methods',
			description : 'backward animaton test',
			fn: function(){
				var content = new Presentation.Content(backwardElement);
				content.backward();
			}
		});


		testcases.push({
			title: 'center methods',
			description : 'center animaton test',
			fn: function(){
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
						log('assert onTransitionStart ok');
					},
					onTransitionEnd: function(content){
						log('assert onTransitionEnd ok');
					}
				});
				content.forward();
			}
		});

		makeActions(testcases);

	}, false);

}(document));
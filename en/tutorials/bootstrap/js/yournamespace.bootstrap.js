(function(yournamespace){

	var yournamespace = this.yournamespace = yournamespace;

	yournamespace.Module = new Moostrap.Module();

	yournamespace.Module.register('controller', {

		title: 'gui controller setup',

		configuration: {
			prev: 'prevButton',
			next: 'nextButton',
			disabled: 'disabled'
		},

		handler: function(pt, config){
			var helper = null,
				action = this;

			try {
				helper = new yournamespace.Controller(config);
			} catch(exception){
				action.failure(exception);
			}
			pt.addHelper(helper);

			action.success();
		}

	});


	yournamespace.Module.register('keyword-filter', {

		title: 'keyword filter setup',

		configuration: [],

		handler: function(pt, config){
			var filter = null,
				action = this;

			try {
				filter = yournamespace.KeywordFilter;
				filter.keywords.concat(config);
			} catch(exception){
				action.failure(exception);
			}
			pt.addFilter(filter);

			action.success();
		}

	});


	yournamespace.Module.register('contents', {

		title: 'presentation content loading',

		configuration: {
			method: 'get',
			url: 'content/document.html'
		},

		handler: function(pt, config){
			var action = this,
				parser = null,
				content = null,
				sections = [],
				container = pt.getContainerElement();

			var request = new Request.HTML({
				url: config.url,
				method: config.method,
				onSuccess: function(tree, elements, html, js){

					parser = new Element('div', { html: html });
					sections = parser.getElements('section');

					sections.each(function(element, key){
						element.inject(container);
						content = new Presentation.Content(element);
						pt.addContent(content);
					});
					action.success();
				},
				onFailure: function(xhr){
					action.failure(xhr);
				}
			});
			request.send();

			action.success();
		}

	});

}.call(this, this.yournamespace || {}));

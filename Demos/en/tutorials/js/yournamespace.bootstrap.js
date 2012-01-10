(function(yournamesapce){

	var yournamesapce = this.yournamesapce = yournamesapce;

	yournamespace.Module = Moostrap.Module();

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
				filter.keyword.contat(config);
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
			url: '/document/'
		},

		handler: function(pt, config){
			var content = null,
				action = this;

			var request = new Request.HTML({
				url: config.url,
				method: config.method,
				onSuccess: function(tree, elements, html, js){
					elements.each(function(element, key){
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

}.call(this, this.yournamesapce || {}));

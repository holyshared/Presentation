(function(Presentation, Module, Helper){

var Markdown = {};

var ResponseParser = Markdown.ResponseParser = {

	_result: [],

	parse: function(text){
		var converter = null,
			parser = null,
			html = null;
	
		converter = new Showdown.converter(),
		html = converter.makeHtml(text);
	
		parser = new Element('div', { html: html });
	
		this._result = parser.getChildren();

		return this;
	},

	createSection: function(elements){
		var content = new Element('section', {
			'data-presentation-role': 'content',
			'class': 'content'
		}).adopt(elements);
		return content;
	},

	createHeader: function(element){
		var header = new Element('header');
		element.inject(header);
		return header;
	},

	toSections: function(){
		var contents = [],
			sections = [],
			parser = this,
			elements = this._result;

		elements.each(function(element){
			switch(element.tagName.toLowerCase()){
				case 'h1':
					break;
				case 'h2':
					if (contents.length > 0){
						sections.push(parser.createSection(contents));
						contents = [];
					}
					contents.push(parser.createHeader(element));
					break;
				default:
					contents.push(element);
			}
		});
		if (contents.length > 0){
			sections.push(parser.createSection(contents));
		}
		return sections;
	}

};

var Bootstrapper = Markdown.Module = {

	title: 'load presentation content',

	configuration: 'content/content.md',

	handler: function(presentation, configuration){
		var bootstrapper = this,
			container = null,
			sections = [],
			request = null;

		if (!Showdown){
			bootstrapper.failure();
		}

		container = presentation.getContainerElement();

		var request = new Request({
			url: configuration,
			onSuccess: function(text, xml){

				try {
					sections = ResponseParser.parse(text).toSections();
				} catch(exception){
					bootstrapper.failure();
					throw exception;
				}

				sections.each(function(section){
					section.inject(container);
					presentation.addContent(new Presentation.Content(section));
				});

				bootstrapper.success();

			}
		});
		request.get();
	}

};

Module.register('contents', Bootstrapper);

}(Presentation, Presentation.Bootstrap.Module, Presentation.Helper));
(function(markdown){

var markdown = this.markdown = markdown;

markdown.MarkdownParser = new Class({

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

});

}(this.markdown || {}));
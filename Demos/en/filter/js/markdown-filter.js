(function(global, filters){

var filters = global.filters = filters;

filters.MarkdownFilter = {

    activate: function(content){
alert('aa');
        var element = $(content),
            filter = element.get('data-presentation-filter'),
            isMarkdown = element.retrieve('markdown'),
            converter = null,
            markdownResult = '',
            markdownText = '';

        if (isMarkdown === true || !Showdown || filter !== 'markdown') {
            return;
        }

        var markdownContents = element.getElements('[data-markdown-content="true"]');
        if (markdownContents.length <= 0) {
            return;
        }

        markdownContents.each(function(element){

            markdownText = element.get('html');

            converter = new Showdown.converter();
            markdownResult = converter.makeHtml(markdownText);

            element.set('html', markdownResult);

        });

        element.store('markdown', true);
    }

};

}(this, this.filters || {}));
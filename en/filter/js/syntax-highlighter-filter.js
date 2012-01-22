(function(global, filters){

var filters = global.filters = filters;

filters.SyntaxHighlighterFilter = {

    activate: function(content){

        var element = $(content),
            filter = element.get('data-presentation-filter'),
            isHighlight = element.retrieve('syntax-highlight');

        if (!SyntaxHighlighter || filter !== 'syntax-highlighther' || isHighlight === true){
            return;
        }
    
        var elements = element.getElements('pre[class~="brush:"]');
        elements.each(function(element){
            SyntaxHighlighter.highlight({}, element);
        });        

        element.store('syntax-highlighther', true);

    }

};

}(this, this.filters || {}));

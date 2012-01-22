(function(global){

describe('SyntaxHighlightherFilter', function() {

    var filter = global.filters.SyntaxHighlighterFilter;

    it('The flag of syntax highligther should be set to true.', function() {
        global.addEvent('domready', function(){

            var element = $('syntax-highlighther1'),
                isApply = element.retrieve('syntax-highlighther');

            expect(isApply).toEqual(null);

            filter.activate(element);

            isApply = element.retrieve('syntax-highlighther');

            expect(isApply).toEqual(true);

        });
    });
/*
	it('The flag of markdown should be set to null.', function() {
        global.addEvent('domready', function(){

            var markdown = $('markdown2'),
                isMarkdown = markdown.retrieve('markdown');

            expect(isMarkdown).toEqual(null);

            filter.activate(markdown);

            isMarkdown = markdown.retrieve('markdown');

            expect(isMarkdown).toEqual(null);

        });
	});
*/
});

}(this));
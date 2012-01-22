(function(global){

describe('MakdownFilter', function() {

    var filter = global.filters.MarkdownFilter;

	it('The flag of markdown should be set to true.', function() {
        global.addEvent('domready', function(){

            var markdown = $('markdown1'),
                isMarkdown = markdown.retrieve('markdown');

            expect(isMarkdown).toEqual(null);

            filter.activate(markdown);

            isMarkdown = markdown.retrieve('markdown');

            expect(isMarkdown).toEqual(true);

        });
    });

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

});

}(this));
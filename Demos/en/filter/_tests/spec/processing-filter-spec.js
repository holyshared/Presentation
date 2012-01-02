(function(global){

describe('ProcessingFilter', function() {

    var filter = global.filters.ProcessingFilter;

    it('The flag of processing should be set to true.', function() {

        global.addEvent('domready', function(){

            var processing = $('processing1'),
                isProcessing = processing.retrieve('processing');

            expect(isProcessing).toEqual(null);

            filter.activate(processing);

            isProcessing = processing.retrieve('processing');

            expect(isProcessing).toEqual(true);

        });

    });


    it('The flag of processing should be set to false.', function() {

        global.addEvent('domready', function(){

            var processing = $('processing2'),
                isProcessing = processing.retrieve('processing');

            filter.activate(processing);
            filter.deactivate(processing);

            isProcessing = processing.retrieve('processing');

            expect(isProcessing).toEqual(false);

        });

    });


});

}(this));
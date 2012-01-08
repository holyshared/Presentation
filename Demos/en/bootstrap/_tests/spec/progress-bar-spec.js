(function(global){

describe('Progresser', function() {

    var Progresser = global.Progresser;

	it('', function() {
        global.addEvent('domready', function(){

			var counter = 1,
				interval = 1000,
				view = new Progresser(5);

			view.show();

			view.next();
            expect(view.getCurrent()).toEqual(counter);

			function nextProgress(){
				counter++;
				view.next();
				expect(view.getCurrent()).toEqual(counter);
			}

			nextProgress.periodical(interval);

        });
    });

});

}(this));
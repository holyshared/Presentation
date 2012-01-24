(function(yournamespace){

this.addEvent('domready', function(){

    var pt = new Presentation('presentation');

    var bootstrapper = new Moostrap(Moostrap.ASYNC_EXECUTER, yournamespace.Module, {
        onSuccess: function(){
        	pt.displayFullScreen().start();
        },
        onFailure: function(error){
            if (error instanceof Error){
                throw error;
            } else {
            	throw new Error(error.statusText);
            }
        }
    });

    bootstrapper.execute(pt);

});

}.call(this, yournamespace));
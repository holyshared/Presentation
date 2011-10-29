(function(doc){

	window.addEventListener('load', function(){

		var myPresen = new Presentation({
			configurations: {
				helpers: {
					swipe: true,
					keyboard: {
						'prev': ['left'],
						'next': ['right']
					}
				}
			},
			onStart: function(){
			}
		});
		myPresen.start();

	}, false);

}(document));
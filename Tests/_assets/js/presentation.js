(function(){

this.addEventListener('load', function(){

var p = new Presentation({

	configurations: {

		helpers: {

			//Keyboard options
			keyboard: {
				prev: ['j', 'left'],
				next: ['k', 'right'],
				first: '0',
				last: '4' //$
			},

			//Swipe options
			swipe: true,

			//Page options
			page: {
				current: 'current',
				total: 'total'
			},

			//Controller options
			controller: {
				first: 'first',
				prev: 'prev',
				next: 'next',
				last: 'last'
			}

		}

	},
	onStart: function(){
console.log('onStart');
	},
	onFailure: function(){
console.log('onFailure');
	}

}); 
p.start();

});

}.call(this));

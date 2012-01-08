(function(){

	var BootstrapAdapter = this.BootstrapAdapter = function(bootstrap){
		this.setBootstrap(bootstrap)
			.setup();
	}

	//The display function of progress is incorporated. 
	BootstrapAdapter.implement(new Progressable());

	BootstrapAdapter.implement({
		start: function(resource){
			this.setTarget(resource);
			this.getBootstrap()
				.execute(resource);
		},
		setup: function(){
			var adapter = this,
				handlers = {},
				bootstrap = this.getBootstrap();

			handlers = {
				onStart: this.onStart,
				onAfterBootstrap: this.onAfterBootstrap,
				onSuccess: this.onSuccess,
				onFailure: this.onFailure
			};
			Object.each(handlers, function(callback, key){
				adapter[key] = function(){
					callback.apply(adapter, arguments);
				};
				bootstrap.addEvent(key, adapter[key]);
			});
		},
		setTarget: function(target){
			this._target = target;
			return this;
		},
		getTarget: function(target){
			return this._target;
		},
		setBootstrap: function(bootstrap){
			this._bootstrap = bootstrap;
			return this;
		},
		getBootstrap: function(bootstrap){
			return this._bootstrap;
		},
		onStart: function(module){
			this.progresser.setTotal(module.getLength());
			this.progresser.show();
		},
		onAfterBootstrap: function(key ,title, current, total){
			this.progresser.next();
		},
		onSuccess: function(){
			this.progresser.hide();
			this.getTarget().displayFullScreen().start();
		},
		onFailure: function(){
			this.progresser.hide();
		}
	});

}());
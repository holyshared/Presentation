(function($, helper){

helper.ThemeSelector = new Class({

    Implements: [Helper.Pluggable],

    //Helper properties
    //@see http://holyshared.github.com/Docs
	_name: 'themeSelector',

    //Helper require methods
    //setup, enable, disable, destory
	setup: function(){
        this._layout = this.getTarget().getLayoutElement();
        this._menu = this._layout.getElement('.themes');
        this._items = this._menu.getElements('a');
        this._handler = this._menuClick.bind(this);
        this._stylesheet = new StyleSheet();
    },

    _menuClick: function(evt){
        var theme = null,
            target = evt.target;

        if (target.nodeName.toLowerCase() !== 'a'){
            return;
        }

        theme = target.get('href');

        this._stylesheet.setStyle(theme.replace('#', ''));
        this._items.each(function(item, key){
            if (item.get('href') !== theme){
                item.removeClass('selected');
            } else {
                item.addClass('selected');
            }
        }, this);
        evt.preventDefault();
    },

	enable: function(){
        this._menu.addEvent('click', this._handler);
    },

	disable: function(){
        this._menu.removeEvent('click', this._handler);
	},

	destroy: function(){
        this._handler = null;
    }

});

}(document.id, Presentation.Helper));

(function(global){

describe('ThemeSelector', function() {

    var layout = null, helper = null, p = null;
     
    global.addEvent('domready', function(){
        layout = $('presentation');

        helper = new Presentation.Helper.ThemeSelector();

        p = new Presentation('presentation', {});

        p.addHelper(helper)
            .start();
    });

    it('select', function(){

        var element = layout.getElement('.themes li a[href="#whiteout"]');

        var evt = document.createEvent('MouseEvent');
        evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        element.dispatchEvent(evt);

        expect(element.hasClass('selected')).toEqual(true);

        element = layout.getElement('.themes li a[href="#standard"]');
        expect(element.hasClass('selected')).toEqual(false);

        element = layout.getElement('.themes li a[href="#rich-black"]');
        expect(element.hasClass('selected')).toEqual(false);

    });

    it('disable', function(){
        p.disableHelper('themeSelector');

        var element = layout.getElement('.themes li a[href="#whiteout"]');
        var standard = layout.getElement('.themes li a[href="#standard"]');

        var evt = document.createEvent('MouseEvent');
        evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        standard.dispatchEvent(evt);

        expect(element.hasClass('selected')).toEqual(true);

        element = layout.getElement('.themes li a[href="#standard"]');
        expect(element.hasClass('selected')).toEqual(false);

        element = layout.getElement('.themes li a[href="#rich-black"]');
        expect(element.hasClass('selected')).toEqual(false);

    });


    it('enable', function(){
        p.enableHelper('themeSelector');

        var element = layout.getElement('.themes li a[href="#whiteout"]');
        var standard = layout.getElement('.themes li a[href="#standard"]');

        var evt = document.createEvent('MouseEvent');
        evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        standard.dispatchEvent(evt);

        expect(element.hasClass('selected')).toEqual(false);

        element = layout.getElement('.themes li a[href="#standard"]');
        expect(element.hasClass('selected')).toEqual(true);

        element = layout.getElement('.themes li a[href="#rich-black"]');
        expect(element.hasClass('selected')).toEqual(false);

    });

});

}(this));
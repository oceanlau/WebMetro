//Forked from olton / Metro-UI-CSS
//original: https://github.com/olton/Metro-UI-CSS/blob/master/demo/js/metro.js

//use css3 effect to animate. But it proves to be not responsive enough. So I rolled back to original metro.js

;(function($){
    $.fn.metro = function(){

        var el = {
                body:'.metro-body',
                section:'.metro-section',
                content:'.metro-content',
                next:'.metro-next',
                back:'.metro-back'
            },
            currentSectionIndex = 0

        /*
            var tilesSections = $(el.section)//$(".metro-section");
            var currentSection = tilesSections[currentSectionIndex];
            var maxSectionIndex = tilesSections.length - 1;
            var scrollTarget = $(el.next)//$(".metro-next")[currentSectionIndex];
         */

        /*
        $(el.body).mousewheel(function(event, delta, deltaX, deltaY){
            var scrollNext = delta < 0;
            return false;
        });
         */


        $(el.next).bind("click", function(){
            var target = $(this);
            if ($(this).hasClass(el.back)) {
                currentSectionIndex -=1;
                if (currentSectionIndex == 0) {
                    target = target.parent(el.section);
                } else {
                    target = $($($(this).attr("data-prior")).parent().children(el.section)[0]).children(el.next);
                }
                $(this).removeClass(el.back);
            } else {
                currentSectionIndex +=1;
                var target = $(this);
                $(this).addClass(el.back);
            }
        })

        // Tiles click&hover effects
        var tiles = $(el.content);
        $.each(tiles, function(i, e){
            var el = $(this);
            var duration = 100;
            el.data('metro',{
                clicking:   false,
                origin:     0,
                ang:        '',
                orizorvert: 0,
                slide: 0
            });

            /* for a better antialiasing */

            if(el.css('box-shadow')=='none') el.css({'box-shadow':'0 0 1px transparent'});
            el.parent().css({'-webkit-perspective':el.outerHeight()*20});
            el.parent().css({'-o-perspective':el.outerHeight()*20});
            el.parent().css({'-moz-perspective':el.outerHeight()*20});
            el.parent().css({'-ms-perspective':el.outerHeight()*20});

            el.mousedown(function(e){

                var mouse = {
                    x:e.pageX-el.offset().left,
                    y:e.pageY-el.offset().top
                },

                metro=$(this).data('metro');
                metro.clicking=true;

                if( mouse.x < el.outerWidth()/3 ){
                    metro.orizorvert = 1;
                    metro.origin = 100;
                    metro.ang = 'Neg';
                    /* left */
                }else if(mouse.x > parseInt(el.outerWidth()*2/3)){
                    metro.orizorvert = 1;
                    metro.ang = 'Pos';
                    /* right */
                }else{
                    if(mouse.y < el.outerHeight()/3){
                        metro.orizorvert = 2;
                        metro.origin = 100;
                        metro.ang = 'Pos';
                        /* top */
                    }else if(mouse.y > parseInt(el.outerHeight()*2/3)){
                        metro.orizorvert = 2;
                        metro.ang = 'Neg';
                        /* bottom */
                    }
                }
                el.data('metro',metro)

                if( metro.orizorvert > 0 && $.browser.webkit){
                    var anim = 'press'+ metro.ang + (metro.orizorvert==1 ? 'Y':'X');
                    el
                        .attr('class', 'metro-content ' + anim)
                        .delay(duration)
                } else if( metro.orizorvert==0 || !$.browser.webkit ){
                    var anim = 'press';
                    el
                        .attr('class', 'metro-content ' + anim)
                        .delay(duration);
                }
            }).mouseup(function(e){
                var a = el.data('metro');

                if( a.clicking==true ){
                    if( a.orizorvert > 0 && $.browser.webkit){
                        var anim = 'pressed'+ a.ang + (a.orizorvert==1 ? 'Y':'X');
                        el
                            .attr('class', 'metro-content ' + anim)
                            .delay(duration);
                    }else if( a.orizorvert==0 || !$.browser.webkit){
                        var anim = 'pressed';
                        el
                          .attr('class', 'metro-content ' + anim)
                          .delay(duration);
                    }
                    el.data('metro',{
                        clicking:   false,
                        origin:     0,
                        ang:        '',
                        orizorvert: 0
                    })
                }
            }).mouseenter(function(){
                if (el.hasClass("tile-multi-content")){
                    var c_main = $(el.children(".tile-content-main"));
                    var c_sub = $(el.children(".tile-content-sub"));
                    var subHeight = c_sub.height()+5;
                    c_main.animate({"marginTop": - subHeight}, 100);
                    c_sub.css("opacity", 1);
                }
            }).mouseleave(function(){
                if (el.hasClass("tile-multi-content")){
                    var c_main = $(el.children(".tile-content-main"));
                    var c_sub = $(el.children(".tile-content-sub"));
                    var subHeight = c_sub.height();
                    c_main.animate({"marginTop": 0}, 100);
                    c_sub.css("opacity", .1);
                }
            }).mouseout(function(){
                if( el.data('metro').clicking ){
                   el.mouseup()
                }
            })
        })

        /*

        // Selectable
        var selectables = $(".selectable");
        $.each(selectables, function(i, e){
            var el = $(this);
            var items = el.children(".metro-image, .metro-image-overlay, .metro-icon-text, .metro-image-text");
            items.bind("click", function(){
                if ($(this).hasClass("disabled")) return;
                $(this).toggleClass("selected");
            })
        })

        // Metro-Switchers
        var switchers = $(".metro-switch");
        switchers.bind("click", function(){
            var el = $(this);
            if (el.hasClass('disabled') || el.hasClass('static')) return false;
            el.toggleClass("state-on");
        })

        */
    }
})(jQuery)

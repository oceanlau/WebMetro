;(function($, window, undefined){
    $.fn.metro = function(options){

        var opts = $.extend({}, $.fn.metro.defaults, options);
        var _el = opts.el;
        var _page = {
            scrollLeft: document.body.scrollLeft 
        }

        //Turn Interaction Effect - init
        //$('.' + _el.top).css({ '-webkit-perspective' : $('.' + _el.top).outerHeight()*3 });

        // mousewheel to scroll
        //--------------------------------------------------------------------------------------------------
        $('.'+_el.top).mousewheel(function(event, delta, deltaX, deltaY){
            var next = _page.scrollLeft - delta*40;
            next = (next < 0)?0:next;
            window.scrollTo(next, 0);
            $('.'+_el.h1).css({ 'text-indent' : document.body.scrollLeft/1.4 });//adding this in mousewheel event handler while it is already in scroll's makes it more smooth-like.
            //$('.'+_el.h1).animate({textIndent:document.body.scrollLeft/1.4}, {duration:50} );//animation only makes it lag, not smoothy.
        });
        $(window).scroll(function(){
            $('.'+_el.h1).css({ 'text-indent' : document.body.scrollLeft/1.4 });
            _page.scrollLeft = document.body.scrollLeft;
        })

        
        //Binding Events
        //-----------------------------------------------------------------------------------------------------
        $.each($('.'+_el.content), function(i, e){
            var el = $(this);

            // for a better antialiasing
            if(el.css('box-shadow')=='none') el.css({ 'box-shadow' : '0 0 1px transparent' });
            el.parent().css({ '-webkit-perspective' : el.outerHeight()*20 });
            el.parent().css({ '-o-perspective' : el.outerHeight()*20 });
            el.parent().css({ '-moz-perspective' : el.outerHeight()*20 });
            el.parent().css({ '-ms-perspective' : el.outerHeight()*20 });

            // Interaction effects
            var interaction = {
                clicking:   false,
                origin:     0,
                ang:        '',
                orizorvert: 0,
                class:      ''
            }
            el.data('interaction', interaction);
            _i.press(el);

            // Presentation effects
            var presentation = {
                mode: 'static',
                manual: false,//Given that now automaton.unserve is unsupported, you can set p.manual to true to override automaton's control right
                stat: 'initial',
                trigger: el.attr('data-trigger')||'auto'
            }

            if(el.hasClass('backface') && !el.hasClass('fragment')){
                presentation.mode = 'backface';
                el.data('presentation', presentation);
                _p.backface(el);
            } else if(el.hasClass('extend')){
                presentation.mode = 'extend';
                presentation.dir = el.attr('data-dir')||'top';
                el.data('presentation', presentation);
                _p.extend(el);
            } else if(el.hasClass('shatter')){
                presentation.mode = 'shatter';
                el.data('presentation', presentation);
                _p.shatter(el);
            } else if(el.hasClass('tag')){
                presentation.mode = 'tag';
                presentation.dir = el.attr('data-dir')||'bottom';
                el.data('presentation', presentation);
                _p.tag(el);
            }
        })
    }

    $.metro = {};

    //Interaction Effects
    //-----------------------------------------------------------------------------------------------------
    var _i = $.metro.interaction = {
        press: function(el){
            el.bind('mousedown._i', function(e){

                var mouse = {
                    x:e.pageX-el.offset().left,
                    y:e.pageY-el.offset().top
                },

                interaction=$(this).data('interaction');
                interaction.clicking=true;

                if( mouse.x < el.outerWidth()/3 ){
                    interaction.orizorvert = 1;
                    interaction.origin = 100;
                    interaction.ang = 'Neg';
                    /* left */
                }else if(mouse.x > parseInt(el.outerWidth()*2/3)){
                    interaction.orizorvert = 1;
                    interaction.ang = 'Pos';
                    /* right */
                }else{
                    if(mouse.y < el.outerHeight()/3){
                        interaction.orizorvert = 2;
                        interaction.origin = 100;
                        interaction.ang = 'Pos';
                        /* top */
                    }else if(mouse.y > parseInt(el.outerHeight()*2/3)){
                        interaction.orizorvert = 2;
                        interaction.ang = 'Neg';
                        /* bottom */
                    }
                }

                if( interaction.orizorvert > 0 && $.browser.webkit){
                    var anim = 'press' + interaction.ang + (interaction.orizorvert==1 ? 'Y':'X');
                    el
                        .removeClass(interaction.class)
                        .addClass(anim)
                } else if( interaction.orizorvert==0 || !$.browser.webkit ){
                    var anim = 'press';
                    el
                        .removeClass(interaction.class)
                        .addClass(anim)
                }

                interaction.class = anim;
                el.data('interaction',interaction)
            }).bind('mouseup._i', function(e){
                var a = el.data('interaction');

                if( a.clicking==true ){
                    if( a.orizorvert > 0 && $.browser.webkit){
                        var anim = 'pressed' + a.ang + (a.orizorvert==1 ? 'Y':'X');
                        el
                            .removeClass(a.class)
                            .addClass(anim)
                    }else if( a.orizorvert==0 || !$.browser.webkit){
                        var anim = 'pressed';
                        el
                          .removeClass(a.class)
                          .addClass(anim)
                    }
                    el.data('interaction',{
                        clicking:   false,
                        origin:     0,
                        ang:        '',
                        orizorvert: 0,
                        class:      anim
                    })
                }

                //Turn Page effect
                //$('.' + $.fn.metro.defaults.el.page).css({ '-webkit-transform-origin' : _page.scrollLeft+'px 0' }).addClass( 'turn' );

            }).bind('mouseout._i', function(){
                if( el.data('interaction').clicking ){
                   el.mouseup()
                }
            })
        }
    }
      
    //Presentation Effects
    //-----------------------------------------------------------------------------------------------------
    var _p = $.metro.presentation = {
        //Backface Presentation Effect
        backface: function($el){
            var triggerName = {
                trigger: 'backface',
                triggered: 'backfaced'
            }
            var presentation = $el.data('presentation');
            var flipdir;
            if($el.find('.back').hasClass('flip-x')){
                flipdir = 'flip-x';
            } else if($el.find('.back').hasClass('flip-y')){
                flipdir = 'flip-y';
            }

            $el.bind('backface._p', function(){
                $el.children('.card').addClass(flipdir);
                presentation.stat = 'triggered';
                $el.data('presentation', presentation);
            }).bind('backfaced._p', function(){
                $el.children('.card').removeClass(flipdir);
                presentation.stat = 'initial';
                $el.data('presentation', presentation);
            })

            this._trigger(presentation, $el, triggerName) 

        },
        //Extend Presentation Effect
        extend: function($el){
            var triggerName = {
                trigger: 'extend',
                triggered: 'extended'
            }
            var presentation = $el.data('presentation');
            var dir = presentation.dir;
            var er = $el.find('.extender');
            var ee = $el.find('.extendee');
            var size;
            if(dir === 'top' || dir=== 'bottom'){
                size = ee.outerHeight();
            } else if (dir === 'left'|| dir === 'right'){
                size = ee.outerWidth();
            }


            $el.bind('extend._p', function(){
                er.css( 'margin-' + dir , -size+'px' );//wtf???
                presentation.stat = 'triggered';
                $el.data('presentation', presentation);
            }).bind('extended._p', function(){
                er.css( 'margin-' + dir, '0px' );
                presentation.stat = 'initial';
                $el.data('presentation', presentation);
            })

            this._trigger(presentation, $el, triggerName)


        },
        //Shattered Presentation Effect
        shatter: function($el){
            var presentation = $el.data('presentation');
            var fragments = $el.children('.backface');
            var fragments_trigger = presentation.trigger === 'free'?'auto':'controlled';

            fragments.data('presentation', {
                mode: 'backface',
                manual: false,
                stat: 'initial',
                trigger: fragments_trigger
            });
            //_p.backface(fragments);
            fragments.each(function(){
                _p.backface($(this));
            })

            if(presentation.trigger === 'hover'){
                $el.bind('mouseover._p', function(){
                    fragments.trigger('backface._p');
                    presentation.stat = 'triggered';
                    $el.data('presentation', presentation);
                }).bind('mouseout._p', function(){
                    fragments.trigger('backfaced._p');
                    presentation.stat = 'initial';
                    $el.data('presentation', presentation);
                })
            } else if( presentation.trigger === 'free'){
                //nothing you can do here
            } else if( presentation.trigger === 'auto'){
                $.metro.automaton.serve($el);
                $el.bind('dispatch._p', function(){
                    var p = $(this).data('presentation');
                    var stat = p.stat;
                    if(p.manual === true){ return }
                    if(stat === 'initial'){
                        fragments.trigger('backface._p');
                        p.stat = 'triggered';
                        $el.data('presentation', p);
                    } else if( stat === 'triggered' ){
                        fragments.trigger('backfaced._p');
                        p.stat = 'initial';
                        $el.data('presentation', p);
                    }
                })
            }
        },
        //Tag Presentation Effect
        tag: function($el){
            var triggerName = {
                trigger: 'tag',
                triggered: 'tagged'
            }
            var presentation = $el.data('presentation');
            var dir = presentation.dir;
            var sign = $el.find('.sign');
            var size;
            if(dir === 'top' || dir=== 'bottom'){
                size = sign.outerHeight();
            } else if (dir === 'left'|| dir === 'right'){
                size = sign.outerWidth();
            }


            $el.bind('tag._p', function(){
                sign.css( dir , '0px' );
                presentation.stat = 'triggered';
                $el.data('presentation', presentation);
            }).bind('tagged._p', function(){
                sign.css( dir, -size + 'px' );
                presentation.stat = 'initial';
                $el.data('presentation', presentation);
            })

            this._trigger(presentation, $el, triggerName);
            
        },
        _trigger: function(data, $el, name){
            if(data.trigger === 'hover'){
                $el.bind('mouseover._p', function(){
                    $el.trigger(name.trigger + '._p');
                }).bind('mouseout._p', function(){
                    $el.trigger(name.triggered + '._p');
                })
            } else if( data.trigger === 'auto'){
                $.metro.automaton.serve($el);
                $el.bind('dispatch._p', function(){
                    var p = $el.data('presentation');
                    var stat = p.stat;
                    if(p.manual === true){ return }
                    if(stat === 'initial'){
                        $el.trigger(name.trigger + '._p');
                    } else if( stat === 'triggered' ){
                        $el.trigger(name.triggered + '._p');
                    }
                })
            }
        }
    }

    //Automaton
    //-----------------------------------------------------------------------------------------------------
    $.metro.automaton = (function(opt){
        var els = [];
        return {
            opt: opt,
            serve: function(el){
                els.push(el);
            },
            unserve: function(el){
                //no effective way yet
            },
            dispatch: function(parallel){
                var rand = Math.random();
                var l = els.length;
                if(parallel > l){
                    parallel = l;
                }
                if(parallel === 0){ return }
                var nth = Math.floor(rand*l);
                els[nth].trigger('dispatch._p');
            },
            _init: function(opt){
                setInterval("$.metro.automaton.dispatch($.metro.automaton.opt.parallel)", $.metro.automaton.opt.density);
            }
        }
    })({
        density: 1500,
        parallel: 1,
        delay: 2000
    })
    //Automaton need to init at a global scope after it is defined.
    setTimeout("$.metro.automaton._init($.metro.automaton.opt)", $.metro.automaton.opt.delay)

    $.fn.metro.defaults = {
        el:{
            top: 'metro',
            page : 'metro-wrapper',
            h1 : 'metro-h1',
            body : 'metro-body',
            section : 'metro-section',
            content : 'metro-content'
        }
    }
})(jQuery, window)
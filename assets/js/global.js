$(window).load(function () {
    equalheight('footer .info .col-sm-6');
    window.frontResize();
    // $('#coverall').show().delay(200).fadeOut(300);
    $('#overSpinner').fadeOut(300, function () {
        $(window).trigger('spinner_off');

        spinner.stop();
        $('iframe').each(function () {
            if($(this).attr('data-original') != '') $(this).attr('src',$(this).attr('data-original'));
        });

    });
    var detached = false;
    $(window).scroll(function (e) {
        if($('.frontpage-banner').css('display') == 'none') {
            var nm = $('.btn-navbar').parent().find('#nav-main');

            if(nm.hasClass('visible')) {
                nm.slideUp();
                nm.removeClass('visible')
            };
            return;
        }
        var p = $('#header-main').offset().top - window.pageYOffset;

      if(p<0 && !detached) {
          $('#header-main').clone(true).attr('id','detached').css({position: 'fixed', top: 0, width: '100%', 'z-index':99}).insertAfter('#header-main');
        $('#header-main').css({'opacity': 0});
        $('#detached').css({'opacity': .97});   
          detached = true;
      } else if (p>0 && detached) {
          detached = false;
          $('#detached').remove();
        $('#header-main').css({'opacity': 1});
      }
    });
});


// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    var _stackables = [];
    var _stackwrap;
    var _scrollTop = $(window).scrollTop();
    var _windowHeight = $(window).height();
    var _y = $('#header-main').height();
    $(_stackwrap).height(_windowHeight - _y);
    for(var i = 0; i < _stackables.length; i++) {
        var stack = _stackables[i];
        var $item = $(stack.item);
        var itemheight = $item.outerHeight();
        var _top = 0;
        var y = _y;
        if(stack.locked) {
            _top = stack.holder.offset().top;
            if(_top - _scrollTop > y - Math.max(0,stack.holder.outerHeight() - (_windowHeight-_y))) {
                stack.holder.replaceWith($item);
                $item.removeAttr('style');
                stack.holder = null;
                stack.locked = false;
            }
        } else {
            _top = $item.offset().top;
            itemheight = $item.removeAttr('style').outerHeight();
            if(_top - _scrollTop < y - Math.max(0,itemheight - (_windowHeight-_y))) {
                stack.locked = true;
                stack.holder = $('<div class="stackholder" id="stack_id_'+i+'"/>').insertAfter($item);
                stack.holder.height(itemheight);
                $item.height(Math.max(_windowHeight - _y,itemheight));
                $item.appendTo(_stackwrap);
                //console.log(_scrollTop,_top - _scrollTop );
            }

        }

    }

    $('body').find('.hide-first').each(function(){
        if(isScrolledIntoView($(this)))
        {
            $(this).animate({opacity:1},300);
        }
    });
    
    // $('section').find('img').each(function(){
    //     if(isScrolledIntoView($(this)))
    //     {
    //         $(this).animate({opacity:1},300);
    //     }
    // });

});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    window.frontResize = function () {
        var bannerHeight = $(window).height() - $('#header-main').outerHeight();
    }


    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });

    //Accordion
    $('.accordion').on('click', '.caption',function(){

        $(this).parents('.accordion').find('.item').each(function(){

            if(!$(this).hasClass('closed'))
            {
                $(this).find('.more').slideUp(200);
                $(this).addClass('closed');
            }
        });


        if($(this).parent().hasClass('closed')){
            // alert('ditutup');

            $(this).siblings('.more').slideDown(200);
            $(this).parent().removeClass('closed');
            //$(this).parents('.accordion').find('.item').removeClass('closed');
        }
        else{
            // alert('dibuka');

            $(this).siblings('.more').slideUp(200);
            $(this).parent().addClass('closed');
            //$(this).parents('.accordion').find('.item').addClass('closed');
        }
    });

    //Methodologies
    $("#methodologies").owlCarousel({

        navigation : true, // Show next and prev buttons
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true,
        navigationText: ["&larr;","&rarr;"],
        paginationNumbers: true
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

});





$(document).ready(function(){
    sizing();
    // load_instagram();
    
});

$(window).resize(function(){
    sizing();
});







function sizing(){
    var wHeight = $(window).height();
    var wWidth = $(window).width();

    var heightHalf = parseFloat(wWidth / 2);
    var heightQuarter = parseFloat(wWidth / 4);

    if ( wWidth>=768 ){
        $('.height-half').css({
            height: heightHalf
        });
        $('.height-quarter').css({
            height: heightQuarter
        });
        $('.intro').css({
            height: parseFloat(wHeight-92)
        });

        // console.log('header: '+ $('#header-main').outerHeight());
    }
    else{
        $('.intro').css({
            height: '200px'
        });
        $('.height-half').css({
            height: 'auto'
        });
        $('.height-quarter').css({
            height: 'auto'
        });
    }
}

function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + ($(elem).height()/2);

    return ((elemBottom <= (docViewBottom)) && (elemTop >= docViewTop));
}

function load_instagram(){
    $.get(base_url+'home/ig_data',function(resp){
        $.each(resp.data,function(idx,val){

            $('#instagram').find('.instagram').eq(idx).animate({
                opacity: 0
            },500,function(){

                var img = val.images.low_resolution.url;

                if(idx == 2)
                {
                    img = val.images.standard_resolution.url;
                }

                $('#instagram').find('.instagram').eq(idx).css('background-image','url('+img+')');
                $('#instagram').find('.instagram').eq(idx).animate({opacity: 1},500);
            });

            
        });

        var max_id = resp.pagination.next_max_id;

        setInterval(function(){

            rotate_ig_img(max_id);

        },1000);

    },'json');
}

var imgs = [];
function rotate_ig_img(max_id)
{
    $.get(base_url+'home/ig_rand/'+max_id,function(resp){

        var rand_holder = Math.floor((Math.random() * 5) + 1) - 1;
        var rand_img = Math.floor((Math.random() * resp.data.length) + 1);

        var img = resp.data[rand_img].images.low_resolution.url;

        if($.inArray(img, imgs) == -1)
        {
            imgs.push(img);

            $('#instagram').find('.instagram').eq(rand_holder).animate({
                opacity: 0
            },500,function(){

                if(rand_holder == 2)
                {
                    img = resp.data[rand_img].images.standard_resolution.url;
                }

                $('#instagram').find('.instagram').eq(rand_holder).css('background-image','url('+img+')');
                $('#instagram').find('.instagram').eq(rand_holder).animate({opacity: 1},500);
            });    
        }

    
    },'json');
}

function equalheight(container){
    var currentTallest = 0,
        currentRowStart = 0,
        rowDivs = new Array(),
        $el,
        topPosition = 0;
        $(container).each(function() {

        $el = $(this);
        $($el).height('auto')
        topPostion = $el.position().top;

    if (currentRowStart != topPostion) {
        for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
            rowDivs[currentDiv].height(currentTallest);
        }
        rowDivs.length = 0; // empty the array
        currentRowStart = topPostion;
        currentTallest = $el.height();
        rowDivs.push($el);
        }else {
            rowDivs.push($el);
            currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
        }for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
            rowDivs[currentDiv].height(currentTallest);
        }
    });

    $('footer .shopify-expert').fadeIn();
}
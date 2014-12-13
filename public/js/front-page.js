// $( document ).ready(function(){
// var items = (Math.floor(Math.random() * ($('#testimonials li').length)));
// $('#div_testimonials').show();
// $('#testimonials li').hide().eq(items).show();

// function next(){
//   $('#testimonials li:visible').delay(7000).fadeOut('slow',function(){
//     $(this).appendTo('#testimonials ul');
//     $('#testimonials li:first').fadeIn('slow',next);
//   });
//  }
// next();
//});
$( document ).ready(function(){
  var newsticker = $('#newsticker').newsTicker({
    row_height: 71,
    max_rows: 3,
    duration: 6000,
    //prevButton: $('#nt-example1-prev'),
    //nextButton: $('#nt-example1-next')
 });
 $('#div_testimonials').show();
});

$("a[href='#top']").click(function (e) {
	e.stopPropagation();
    $("html, body").animate({
        scrollTop: 0
    }, "slow", function () {
    	$('#profession_selector.dropdown-toggle').dropdown('toggle');
        //$('#profession_selector.dropdown-toggle').dropdown('dropdown');
    });
    return false;
});

$("a[href='#filecost']").click(function (e) {
    e.stopPropagation();
    
    var targetOffset = $('#filecost').offset().top - 50;
     
    $("html, body").animate({
        scrollTop: targetOffset
    }, "slow", function () {
        //$('#profession_selector.dropdown-toggle').dropdown('toggle');
        //$('#profession_selector.dropdown-toggle').dropdown('dropdown');
    });
    return false;
});

$("img.lazy").lazyload({
    effect : "fadeIn"
});
 
$( document ).ready(function(){
var items = (Math.floor(Math.random() * ($('#testimonials li').length)));
$('#div_testimonials').show();
$('#testimonials li').hide().eq(items).show();

function next(){
  $('#testimonials li:visible').delay(7000).fadeOut('slow',function(){
    $(this).appendTo('#testimonials ul');
    $('#testimonials li:first').fadeIn('slow',next);
  });
 }
next();

//alert($('#disqus_last_feeds').html())
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
 
$( document ).ready(function(){
var items = (Math.floor(Math.random() * ($('#testimonials li').length)));
$('#div_testimonials').show();
$('#testimonials li').hide().eq(items).show();

function next(){
  $('#testimonials li:visible').delay(5000).fadeOut('slow',function(){
    $(this).appendTo('#testimonials ul');
    $('#testimonials li:first').fadeIn('slow',next);
  });
 }
next();
});
 
 
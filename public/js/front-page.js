$(function(){
var items = (Math.floor(Math.random() * ($('#testimonials li').length)));
$('#testimonials li').hide().eq(items).show();

function next(){
  $('#testimonials li:visible').delay(5000).fadeOut('slow',function(){
    $(this).appendTo('#testimonials ul');
    $('#testimonials li:first').fadeIn('slow',next);
  });
 }
next();
});

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/he_IL/sdk.js#xfbml=1&appId=182829178418239&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


  
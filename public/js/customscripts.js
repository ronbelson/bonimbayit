
 (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/he_IL/sdk.js#xfbml=1&appId=&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

if ($(this).width() > 768 && $.cookie("fb-back1")==undefined)  {

        $.cookie("fb-back1", "Aurelio", {expires: new Date(2029, 10, 29, 11, 00, 00)});
        setTimeout(function() {
          $('#fb-back').modal('show');
        }, 1000); // milliseconds

    };


     


 
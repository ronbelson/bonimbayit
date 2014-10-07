window.fbAsyncInit = function() {
    FB.init({
      appId      : '631527010302196',
      xfbml      : true,
      version    : 'v2.1'
    });

      if ($(this).width() > 768 && $.cookie("fb-back")==undefined)  {

        $.cookie("fb-back", "Aurelio", {expires: new Date(2029, 10, 29, 11, 00, 00)});
        setTimeout(function() {
          $('#fb-back').modal('show');
        }, 13000); // milliseconds

    };
      
      FB.Event.subscribe('edge.create', function(response) {
         $('#fb-back').modal('hide');
      }); 

      FB.Event.subscribe('edge.remove', function(response) {
         $('#fb-back').modal('hide');
      }); 
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));  

 




     


 
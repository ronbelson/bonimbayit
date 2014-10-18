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


 // ===============================
// Loading scripts anychronously
//
// Usage: getScript('script.js', function() { /* callback */ });
// ===============================
  function getScript(url,success){
    var script = document.createElement('script');
    script.src = url;
    var head = document.getElementsByTagName('head')[0], done=false;
    script.onload = script.onreadystatechange = function(){
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
            done=true;
            success();
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
        }
    };
    head.appendChild(script);
}

//OPP-poll-id-53a2116be4b0fb42190cb76d', function(e) {
  

$("#OPP-div-around-poll").bind("DOMSubtreeModified", function() {
    objectHTMLCollection = (document.getElementsByTagName('OPP-div-around-poll'));
    
     document.write(objectHTMLCollection);
});

 




     


 
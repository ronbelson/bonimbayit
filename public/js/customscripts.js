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
  


$(function() {
  $('#mc-form').ajaxChimp({
    url: 'http://bonimbayit.us7.list-manage.com/subscribe/post?u=ddf6dfea18b9935854b4acda7&id=8b05071120',
    callback: function(response) {
     if(response.msg.indexOf("כמעט סיימתם") > -1) 
      {
        var responsemsg = response.msg.replace(/(<([^>]+)>)/ig,"");
        window.location.href = '/thankyou/1/' + encodeURIComponent(responsemsg) +'/';  
      }
    }

  });
 
});

$(function() {

  $('#filecosts-form').ajaxChimp({
    url: 'http://bonimbayit.us7.list-manage.com/subscribe/post?u=ddf6dfea18b9935854b4acda7&id=8b05071120',
    callback: function(response) {
      if(response.msg.indexOf("כמעט סיימתם") > -1) 
      {
        var responsemsg = response.msg.replace(/(<([^>]+)>)/ig,"");
        window.location.href = '/thankyou/2/' + encodeURIComponent(responsemsg) +'/';  
      }
      
    }

  });
 
});

  

$("#contactformfooter").submit(function() {
  
   $("#c-msg").html('<i class="fa fa-spinner">&nbsp;שולח אנא המתו...</i>');
   var url  = "/contact/"; 
   var ajax_data = $("#contactformfooter").serializeJSON();
   $.ajax({
           type: "POST",
           url: url,
           data: ajax_data, // serializes the form's elements.
           success: function(data)
           {
                
               $('#c-msg').html('ההודעה נשלחה בהצלחה')
           }
         });
 return false; // avoid to execute the actual submit of the form.
});

   




  

  
 




     


 


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
  
 $("#btn_search_submit").click(function() {
  if($('#mc-form #MMERGE1').val()=='כל האזורים' || $('#mc-form #MMERGE2').val()=='כל הקבלנים' )
    {bootbox.alert("<div class=text-center><h5><i class='fa fa-heart fa-2x pdl10'></i>בונה יקר, יש לבחור סוג קבלן ואזור</h5></div>"); return false;}
  //alert($('#mc-form #MMERGE1').val())
  
 });

 $("#mc-submit").click(function() {
  
  if($('#mc-form #name').val()=='' || $('#mc-form #mc-email').val()=='' ){
   $('#mc-form').find('label[for=mc-email]').html('בונה יקר, יש להכניס שם פרטי ומשפחה ודואל לקבלת ההמלצות.').show();
   return false;}
  $('#mc-form #mc-email').val($('#mc-form #mc-email').val().toLowerCase());
  return true
 }); 

$(function() {
  $('#mc-form').ajaxChimp({
    url: 'http://bonimbayit.us7.list-manage.com/subscribe/post?u=ddf6dfea18b9935854b4acda7&id=8b05071120',
    callback: function(response) {
     //console.log($('#mc-form #mc-submit').html())
     $.cookie("name", $('#mc-form #name').val(), {expires: new Date(2029, 10, 29, 11, 00, 00)});
     $.cookie("email", $('#mc-form #mc-email').val(), {expires: new Date(2029, 10, 29, 11, 00, 00)});
    
     $('#mc-form #message').val('מתעניין בקבלן ' + $('#mc-form #MMERGE2').val() + ', באזור ' + $('#mc-form #MMERGE1').val());
     //console.log($("#mc-form").serializeJSON());
     //return false;
     $('#mc-form').find('label[for=mc-email]').html('אנא המתן מעביר נתונים..').show();
     $.ajax({
             type: "POST",
             url: "/search/",
             data: $("#mc-form").serializeJSON(), // serializes the form's elements.
             success: function(data)
             {
                 if(response.msg.indexOf("כמעט סיימתם") > -1) 
                  { 
                    var responsemsg = response.msg.replace(/(<([^>]+)>)/ig,"");
                    window.location.href = '/thankyou/1/' + encodeURIComponent(responsemsg) +'/';  
                  }
                  else
                  {
                    window.location.href = '/thankyou/3/תודה שהתעניינת, אני אחזור אליך עם המלצות לדואל בשעות הקרובות, תודה תומר';  
                  }

             }
           });
     return false; // avoid to execute the actual submit of the form. 

     
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

$('a[id^="a_area"]').click(function(){
    $('#MMERGE1').val($(this).text())
    $('#area_selector').text('באזור '+$(this).text())
   
});

$('a[id^="a_profession"]').click(function(){
    $('#MMERGE2').val($(this).text())
    $('#profession_selector').text('קבלן '+$(this).text())
    
});


$(function() {
  $('#mc-form #mc-email').val($.cookie("email"));
  $('#mc-form #name').val($.cookie("name"));
  if($.cookie("email"))
  {
    $('#mc-form #mc-submit').html('תומר, שלח לי קבלנים מומלצים')
  }
});  

 //crazi egg
 $(function() {
  setTimeout(function(){var a=document.createElement("script");
  var b=document.getElementsByTagName("script")[0];
  a.src=document.location.protocol+"//dnn506yrbagrg.cloudfront.net/pages/scripts/0027/1259.js?"+Math.floor(new Date().getTime()/3600000);
  a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b)}, 1);

 });  


 
//Google Search
(function() {
    var cx = '010087137512713044540:l4yfap-jtb8';
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
        '//www.google.com/cse/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
  })();


$("a[href='#searchsitebygoogle']").click(function (e) {
    e.stopPropagation();
    
    var targetOffset = $('#searchsitebygoogledest').offset().top - 50;
     
    $("html, body").animate({
        scrollTop: targetOffset
    }, "slow", function () {
        //$('#profession_selector.dropdown-toggle').dropdown('toggle');
        //$('#profession_selector.dropdown-toggle').dropdown('dropdown');
    });
    return false;
});


$(document).ready(function () {
  $(".navbar-collapse li a").click(function(event) {
    if(this.className==="dropdown-toggle") return;
    $(".navbar-collapse").collapse('hide');
  });
});
 
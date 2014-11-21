$.ajax({
   type: "GET",
   url: '/admin/contractor_count/2222',

   success: function(data)
   {
        
       $('#contractorCount').html('<i style="padding-left:4px;" class="fa fa-star"/> קבלנים פעילים:' + data.count)
   }
 });

$.ajax({
   type: "GET",
   url: '/admin/contractor_count/0',

   success: function(data)
   {
        
       $('#contractorTotal').html('<i style="padding-left:4px;" class="fa fa-star"/>קבלנים סכ״ה:' + data.count)
   }
 });

$.ajax({
   type: "GET",
   url: '/admin/count/searches',

   success: function(data)
   {
        
       $('#contractorSearch').html('<i style="padding-left:4px;" class="fa fa-star"/>חיפושי קבלנים:' + data[0].count)
   }
 });

$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    })
}

$("#searchuser").enterKey(function () {
    //window.location.href='/admin/home#/user/'+(this.value);
    window.location.href='/admin/home#/user/'+(this.value);
    
})


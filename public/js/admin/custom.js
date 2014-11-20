$.ajax({
   type: "GET",
   url: '/admin/contractor_count/2222',

   success: function(data)
   {
        
       $('#contractorCount').html('<i style="padding-left:4px;" class="fa fa-star"/>מספר קבלנים פעילים:' + data.count)
   }
 });

$.ajax({
   type: "GET",
   url: '/admin/contractor_count/0',

   success: function(data)
   {
        
       $('#contractorTotal').html('<i style="padding-left:4px;" class="fa fa-star"/>מספר קבלנים סכ״ה:' + data.count)
   }
 });

$.ajax({
   type: "GET",
   url: '/admin/count/searches',

   success: function(data)
   {
        
       $('#contractorSearch').html('<i style="padding-left:4px;" class="fa fa-star"/>מספר חיפושי קבלנים:' + data[0].count)
   }
 });



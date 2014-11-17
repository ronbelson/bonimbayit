$.ajax({
   type: "GET",
   url: '/admin/contractor_count/2222',

   success: function(data)
   {
        
       $('#contractorCount').html('<i style="padding-left:4px;" class="fa fa-star"/>מספר קבלנים פעילים:' + data.count)
   }
 });
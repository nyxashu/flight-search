var FlightSearch = {
  init: function(){
    f1 = new Flight("Indigo","1234","BOM","DEL",1000,1402649480000);
    f2 = new Flight("Jet","8966","BOM","PUN",2000,1402649480000);
    f3 = new Flight("Air India","999", "DEL","BLR",3000,1402649480000);
    f4 = new Flight("Spicejet","MH-370","BLR","KOL",4000,1402649480000);
    f5 = new Flight("Go Air","111", "PUN","DEL",5000,1402649480000);
    f6 = new Flight("Indigo","5678","BOM","DEL",1200,1402649480000);
    f7 = new Flight("Indigo","7545","DEL","BOM",1200,1402649480000);
  },
  search:function(travel_type,from,to,ondate,returndate,fromprice,toprice){
    var flights = Enumerable.From(_.where(all_flights, {from: from, to: to}))
                  .Where("$.price >= "+fromprice)
                  .Where("$.price <= "+toprice)
                  .ToArray();
    var return_flights = [];
    if(travel_type == "roundtrip"){
      return_flights = Enumerable.From(_.where(all_flights, {from: to, to: from}))
                  .Where("$.price >= "+fromprice)
                  .Where("$.price <= "+toprice)
                  .ToArray();
    }
    flights = flights.concat(return_flights);
    console.log(flights.length+" flights found");
    FlightSearch.render(flights);
  },
  render:function(flights){
    var container = $("#flights_info");
    container.empty();
    if(flights.length > 0){
      for(var index in flights){
        var flight = flights[index];
        container.append("<tr><td>"+flight.name+"</td><td>"+flight.number+"</td><td>"+flight.from+"</td><td>"+flight.to+"</td><td>"+flight.price+"</td></tr>");
      }
    }else{
      container.append("<tr class='danger'><td colspan=5>No flights for selected criteria</td><td>");
    }
  }
};
$(document).ready(function(){
  $("#slider-range").slider({
    range:true,
    min:1000,
    max:20000,
    values:[1000,20000],
    slide: function(event, ui) {
      $("#amount").text("Rs." + ui.values[0] + " - Rs." + ui.values[1]);
    }
  });
  $("#amount").text("Rs." + $("#slider-range").slider("values", 0) +
    " - Rs." + $("#slider-range").slider("values", 1));
  $("#ondate,#returndate").datetimepicker({
    format:'d-M-Y H:i',
    step:15
  }).click(function() { $(this).focus(); });
  $("#from, #to").select2({
    placeholder: "Select a place"
  });
  $("[name='travel_type']").click(function(){
    var radio_val = $("[name='travel_type']:checked").val();
    switch(radio_val){
      case "oneway":
        $("#returndate").val("");
        $("#returndate").attr("disabled","disabled");
        break;
      case "roundtrip":
        $("#returndate").removeAttr("disabled");
        break;
    }
  });
  $("#returndate").attr("disabled","disabled");
  $("#search-flights").on("click",function(e){
    e.preventDefault();
    var travel_type = $("[name='travel_type']:checked").val();
    var from = $("#from").val();
    var to = $("#to").val();
    var ondate = Date.parse($("#ondate").val(), "d-MMM-yyyy HH:mm");
    var returndate = (travel_type == "roundtrip") ? Date.parse($("#returndate").val(), "d-MMM-yyyy HH:mm") : null;
    var fromprice = $("#slider-range").slider("values", 0);
    var toprice = $("#slider-range").slider("values", 1);
    FlightSearch.search(travel_type, from, to, ondate, returndate, fromprice, toprice);
  });
});

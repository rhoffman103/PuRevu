$(document).ready(function(){

	var postal = "";

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(getPostalCode);
		} else { 
			console.log("Geolocation is not supported by this browser.");
		}
	}

	var getPostalCode = function(position) {
		$.ajax({
			type: "POST",
			url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=true',
			dataType: "json",
			beforeSend: function(){
			// do something before the request such as show a loading image
			},
			error: function(err){
			// handle errors
			},
			success: function(data) {
				var addresses = data.results; // cache results in a local var
				console.log(data.results);
				$.each(addresses, function(i){ // iterate through to find a postal code
					if(this.types[0]=="postal_code"){ // check that the type is a postal code
						postal = this['address_components'][0]['long_name']; // grab postal string
						if(postal.length > 3){ // if the result is more than 3 letter shorthand use it
							// do something with your result and then lets break the iteration
							// console.log(postal);
							return false;
						}
					}
				});
			} // end success
		}); // end ajax
	};

	// $("#z-input").val(sessionStorage.getItem("zip"))

	$("#change-zip").on("click", function() {
		getLocation();
		// $("#display-zip").text(postal)
		$("#z-input").val(postal);
		sessionStorage.setItem("zip", postal);
	});

	$("#z-input").change(function() {
			postal = $("#z-input").val();
			sessionStorage.setItem("zip", postal);
	})

	$("#test-btn").on("click", function() {
		zip = sessionStorage.getItem("zip")
		console.log(zip);
	});

});//End of document.ready function
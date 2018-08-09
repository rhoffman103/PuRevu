$(document).ready(function () {
    // Initialize Materialize JS
    M.AutoInit();

    // Top Three Most Popular Daily Articles
    $(document).on("change", "#topic-select", function () {

        $("#top-three").empty();
        var topic = $("#topic-select").val();
        // Built by LucyBot. www.lucybot.com
        var url = "https://api.nytimes.com/svc/mostpopular/v2/mostviewed/" +
            topic +
            "/1.json";
        url += '?' + $.param({
            'api-key': "3aed9443566e4279ab5a39c67436378f"
        });

        $.ajax({
            url: url,
            method: 'GET',
        }).done(function (result) {
            var results = result.results;
            for (var i = 0; i < 3; i++) {
                var title = $("<h6>");
                var caption = $("<p>");
                var link = $("<a>");
                link.attr("href", results[i].url);
                link.attr("target", "_blank");
                title.append(results[i].title);
                caption.append(results[i].media[0].caption);
                link.append(title);
                $("#top-three").append(link);
                $("#top-three").append(caption);
            }
        }).fail(function (err) {
            throw err;
        });
    });
    // ^^^Top Three Most Popular Daily Articles^^^

    // Random Dad Joke
    $(document).on("click", "#dad-button", function () {
        var queryURL = "https://icanhazdadjoke.com/";
        $.ajax({
            url: queryURL,
            method: "GET",
            headers: { 'Accept': 'text/plain' },
        }).then(function (response) {
            $("#dad-joke").html(response);
        })
    });
    //   ^^^Random Dad Joke^^^

    // Weather
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?zip=03802,us&APPID=e2b14b405a6d72980c674b894caf0295&units=imperial"
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (results) {
        console.log(results);
        var weatherType = $("#weather-type");
        var weatherTemp = $("#temp");
        var windSpeed = $("#wind");
        weatherType.append(results.weather[0].main);
        if (results.weather[1]) {
            // this avoids a complete break if there's no alternate weather

            weatherType.append(" / " + results.weather[1].main);
        }
        weatherTemp.append(results.main.temp + " ºF");
        windSpeed.append(results.wind.speed + " mph");
    });
    // ^^^Weather^^^


});//End of document.ready function
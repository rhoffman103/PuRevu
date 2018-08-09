var business = [
    {
        name: "McDonalds",
        comment: ["Blah, Blah, Blah! I hate batrooms! One Star! :P", "No", "The toilet paper tasted GREAT!"],
        ratings: {
            recommend: 1,
            oppose: 2,
            clean: 0,
            dirty: 3
        }
    },
    {
        name: "Chipotle",
        comment: ["Blah, Blah, Blah! I hate batrooms! One Star! :P", "No", "The toilet paper tasted GREAT!"],
        ratings: {
            recommend: 3,
            oppose: 0,
            clean: 2,
            dirty: 1
        }
    },
    {
        name: "Cumbies",
        comment: ["Blah, Blah, Blah! I hate batrooms! One Star! :P", "No", "The toilet paper tasted GREAT!"],
        ratings: {
            recommend: 0,
            oppose: 3,
            clean: 3,
            dirty: 0
        }
    }
];

// this will be a childAdded function for the database
for (var i = 0; i < business.length; i++) {
    var reviewDiv = $("<div>");
    var header = $("<h3>");
    var ratingThing = $("<p>");
    var recommendPerc = Math.round((business[i].ratings.recommend / (business[i].ratings.recommend + business[i].ratings.oppose)) * 100);
    var cleanPerc = Math.round((business[i].ratings.clean / (business[i].ratings.clean + business[i].ratings.dirty)) * 100);
    ratingThing.html('%' + recommendPerc + " <i class='tiny material-icons'>thumbs_up_down</i> Recommended | %" + cleanPerc + " <i class='tiny material-icons'>grade</i> Cleanliness");
    header.text(business[i].name);
    reviewDiv.append(header);
    reviewDiv.append(ratingThing);
    $("#review-list").append(reviewDiv);

}
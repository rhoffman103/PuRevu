$(document).ready(function(){

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB5w4kD4fczy7qVSDvoZLv8ks7UK3O8-ps",
        authDomain: "poo-review-4f8c8.firebaseapp.com",
        databaseURL: "https://poo-review-4f8c8.firebaseio.com",
        projectId: "poo-review-4f8c8",
        storageBucket: "",
        messagingSenderId: "884187524701"
      };
    firebase.initializeApp(config);

    var database = firebase.database();

    var zip     = "";
    var name    = "";
    var comments = [];
    var ratings = {   
            recommend: 0,
            oppose:    0,
            clean:     0,
            dirty:     0,
            ok:        0,
    }

    var failedSubmitVisible = false;

    // FIXME
    // RETRIEVE ZIP & DISPLAY
    $("#display-zip").val(sessionStorage.getItem("zip"))

    $("li").on("click", function() {
        var $this = $(this);
        var $ratingWord = $this.find("span").text().trim().toLowerCase();
        $this.addClass("purple-text text-darken-2");
        $this.siblings().removeClass("purple-text text-darken-2");

        switch ($ratingWord) {
            case "glorious":
                ratings.recommend = 1;
                ratings.oppose = 0;
                break;
            case "crappy":
                ratings.oppose = 1;
                ratings.recommend = 0;
                break;
            case "clean":
                ratings.clean = 1;
                ratings.dirty = 0;
                ratings.ok = 0;
                break;
            case "grimey":
                ratings.clean = 0;
                ratings.dirty = 1;
                ratings.ok = 0;
                break;
            case "ok":
                ratings.clean = 0;
                ratings.dirty = 0;
                ratings.ok = 1;
                break;
        }
    })

    // SUBMIT REVIEW
    $("#submit-btn").on("click", function() {
        zip = $("#z-input").val();
        name = $("#business").val().toLowerCase().trim();
        var comment = $(".comments").val().trim();
        var recommended = false;
        
        sessionStorage.setItem("currentBusiness", name);

        if (ratings.recommend === 1) {
            recommended = true;
        }
        if (((zip.length == 0) || (name.length == 0)) && (!failedSubmitVisible)) {
            failedSubmitVisible = true;
            $("#failed-submit").append(`<div class="col s12 red lighten-3">
                                            <p class="submit-warning">!!! You must enter a Business and Zip to submit a review.</p>
                                        </div>`);
        }
        else if ((zip.length > 0) && (name.length > 0)){

            //  MAKE A TIMESTAMP WITH MOMENT JS
            var dateAdded = moment().format('lll'); 

            //  COMPARE ALL BUSINESSES TO BUSINESS INPUT
            var businessRef = database.ref("business");
            businessRef.once('value', function(snapshot) {
                // console.log(snapshot.val())
                var businessLocationExists = false;
                snapshot.forEach(function(childSnapshot) {
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    // console.log(childKey);
                    // console.log(childData.name);
                    if ((name === childData.name) && (zip === childData.zip)) {
                        // var str = comments.toString();
                        // console.log(str);
                        businessLocationExists = true;
                        // console.log("Business Match!")
                        // console.log(childData.name + " zip: " + childData.zip)
                        // console.log(childKey);
                        // console.log(childData);
                        // console.log(childData.comments);
                        database.ref(`/business/${childKey}/ratings`).update({
                            recommend: ratings.recommend + childData.ratings.recommend,
                            oppose:    ratings.oppose + childData.ratings.oppose,
                            clean:     ratings.clean + childData.ratings.clean,
                            dirty:     ratings.dirty + childData.ratings.dirty,
                            ok:        ratings.ok + childData.ratings.ok,
                        });
                        if (comment.length > 0) {
                            // var dataComments = childData.comments;
                            database.ref(`/business/${childKey}/comments`).push({
                                comment, dateAdded, recommended
                            });
                            console.log(comment)
                        }
                        // if (comment.length > 0) {
                        //     var dataComments = childData.comments;
                        //     console.log(comments)
                        //     var comment = comments.toString()
                        //     console.log(comment)
                        //     console.log(dataComments)
                        //     database.ref(`/business/${childKey}`).update({
                        //         comments,
                        //         // comments: childData.comments.push(comments.toString())
                        //     });
                        // }
                    }
                });
                if (businessLocationExists === false) {
                    // Generate a reference to a new location and add some data using push()
                    var newPushRef = database.ref("/business").push({
                        zip, name, comments, ratings
                    });
                    // Get the unique key generated by push()
                    var pushId = newPushRef.key;
                    database.ref(`/business/${pushId}/comments`).push({
                        comment, dateAdded, recommended
                    });
                    console.log("pushed new location");
                }
            });

            // CLEARS DIV ON SUBMIT EVENT && ADDS BUTTON TO WRITE ANOTHER

            var anotherReview = "<a href='write-review.html' class='waves-effect waves-light blue darken-2 btn'>Write another review!</a>";

            $("#page-content").empty();
            $(".page-footer").empty();
            $("#page-content").html(anotherReview);

            // $("#z-input").val("");
            // $("#business").val("");
            // $(".comments").val("");
            // $("li").removeClass("purple-text text-darken-2");

        }

    });
    
});//End of document.ready function
$(document).ready(function () {

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

    sessionStorage.setItem("zip", "03801");
    sessionStorage.setItem("currentBusiness", "granite state");

    // CAPITALIZE FIRST LETTER OF EACH WORD
    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    //  RETRIEVE BUSINESSES BY ZIP
    const listBusinesses = function (postal) {
        var businessRef = database.ref("business");
        businessRef.orderByChild("zip").equalTo(postal).once("value", function (snapshot) {
            var obj = snapshot.val();
            Object.keys(obj).forEach(function (element) {
                console.log(obj[element].name);
            })
            // console.log(snapshot.key);
        });
    }

    //  LIST BUSINESSES AND QUICK RATINGS BY ZIP
    const quickRatings = function (postal) {
        console.log("calling quick ratings")
        console.log("zip input: " +postal);
        var businessRef = database.ref("business");
        businessRef.orderByChild("zip").equalTo(postal).once("value", function (snapshot) {
            var obj = snapshot.val();

            // check if there are any entries in this zip code & append info
            if (snapshot.val() !== null) {
                console.log("object keys: " + Object.keys(obj)[0])
                Object.keys(obj).forEach(function (element) {
                    var recommendPerc = Math.round((obj[element].ratings.recommend / (obj[element].ratings.recommend + obj[element].ratings.oppose)) * 100);
                    var cleanPerc = Math.round((obj[element].ratings.clean / (obj[element].ratings.clean + obj[element].ratings.dirty)) * 100);
                    var reviewDiv = $(`<div class="row">
                                    <div class="col s12 m6">
                                        <div class="card">
                                            <div class="card-content">
                                                <span class="card-title">
                                                    <h3 class="business pointer-curser blue-text text-darken-2" data-zip="${obj[element].zip}" data-key="${element}">${toTitleCase(obj[element].name)}</h3>
                                                </span>
                                            </div>
                                            <div class="card-action">
                                                <p>% ${recommendPerc} Recommended | % ${cleanPerc} Cleanliness</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>`)
                                
                    $(".review-list").append(reviewDiv);
                })
            }
            else {
                $(".review-list").append(`<p>Be the first Pu Reviewer in this area!</p>`);
            }
        });
    }
    
    //  RETRIEVE BUSINESSES BY ZIP AND DISPLAY COMMENTS
    const displayComments = function (name, postal) {
        var businessRef = database.ref("business");
        businessRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                if ((name.toLowerCase() === childData.name) && (postal === childData.zip)) {
                    console.log("Business Match!");
                    var commentsRef = database.ref(`/business/${childKey}/comments`);
                    commentsRef.once('value', function (snapshot) {
                        console.log("Comments:")

                        // MAKE COMMENT CARD IN THIS FOREACH LOOP
                        // you can use commentData.recommend commentData.comment commentData.dateAdded
                        snapshot.forEach(function (commentSnapshot) {
                            var commentKey = commentSnapshot.key
                            var commentData = commentSnapshot.val();
                            console.log("comment key: " + commentKey);
                            console.log(`recomend = ${commentData.recommended}\nDate Added: ${commentData.dateAdded}\nComment: ${commentData.comment}`)
                            
                            if (commentData.recommended) {
                                recommendIcon = `<i class="material-icons">thumb_up</i>Recommended`;
                            }
                            else {
                                recommendIcon = `<i class="material-icons">thumb_down</i>Opposed`;
                            }
                            
                            $commentCard = $(`<div class="row">
                                                <div class="col s12 l6">
                                                    <div class="card darken-1">
                                                        <div class="card-content">
                                                            <p class="date-added">${commentData.dateAdded}</p>
                                                            <p class="recommend-icon">${recommendIcon}</p>
                                                            <p class="comment">${commentData.comment}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`);
                            $(".comment-cards").prepend($commentCard);
                        });
                    });
                }
            });
        });
    } // End display comments

    //  DISPLAYS BUSINESS NAME AND VOTES
    const displayTotalVotes = function(ratings, $this) {
        var titleDiv = $(`<div class="separator">
                                <h2 class="business-title">${$this.text().trim()}</h2>
                                <p class="mb-20">Zip Code: ${$this.attr("data-zip")}</p>
                                <p class="totals mb-8">Recomends: ${ratings.recommend}
                                    <span class="span-separater">Opposed: ${ratings.oppose}</span>
                                </p>
                                <p class="totals mb-20">Cleanliness: ${ratings.clean}
                                    <span class="span-separater">Grimey: ${ratings.dirty}</span>
                                </p>
                            </div>`)

            $(".title").append(titleDiv);
    }

    //  Search Event for businesses
    const enterSearch = function() {
        console.log("zip search")
        sessionStorage.setItem("zip", $(".zip-input").val());
        $(".title").empty();
        $(".comment-cards").empty();
        $(".review-list").empty();
        quickRatings($(".zip-input").val());
    }

    //  Initialize sidebar
    $('.sidenav').sidenav();

    //  Display default for page opening
    quickRatings(sessionStorage.getItem("zip"));
    
    // CLICK EVENTS
    // Opens clicked business and displays votes & comments
    $("body").on("click", ".business", function() {
        // console.log($(this).attr("data-zip"));
        var $this = $(this);
        var ratingsRef = database.ref(`/business/${$this.attr("data-key")}/ratings`)
        $(".review-list").empty();

        ratingsRef.once("value", function(snap) {
            ratings = snap.val();
            console.log(ratings);
            displayTotalVotes(ratings, $this);
            displayComments($this.text().trim(), $this.attr("data-zip"))
        })
    });

    // Searches for businesses by zip
    $("button").on("click", function() {
        enterSearch();
    })

    $(document).on("keypress", "#z-input", function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            enterSearch();
        }
    })

});//End of document.ready function
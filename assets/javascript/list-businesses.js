//  RETRIEVE BUSINESSES BY ZIP
var businessRef = database.ref("business");
businessRef.orderByChild("zip").equalTo(sessionStorage.getItem("key")).once("value", function(snapshot) {
    // console.log(snapshot.val());
    var obj = snapshot.val();
    Object.keys(obj).forEach(function(element) {
        console.log(obj[element].name);
        if (name === obj[element].name) {
            console.log("Business Match!")
        }
    })
    
    // console.log(snapshot.key);
});
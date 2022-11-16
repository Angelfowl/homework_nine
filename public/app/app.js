var userExists = false;
var userFullName = "";

function changeRoute(){
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#", "");
    console.log(hashTag + " " + pageID);

    if (pageID != ""){
    $.get(`pages/${pageID}.html`, function(data){
        // console.log("data " + data);
        $("#app").html(data);
    });

}else {
    $.get(`pages/home.html`, function(data){
        // console.log("data " + data);
        $("#app").html(data);
    });
}
}

function initListeners(){
    $(window).on("hashchange", changeRoute);
    changeRoute();
};

function initFirebase(){
    firebase.auth().onAuthStateChanged((user) => {
        if(user){
            console.log("auth changed logged in");
            if(user.displayName){
                $(".name").html(user.displayName);
            }
            $(".signOut").prop("hidden", false);
            userExists = true;
        }else{
            console.log("auth changed logged out");
            $(".name").html(" ");
            $(".signOut").attr("hidden", true);
            userExists = false;
            userFullName = "";
        }
    })
};

function signOut() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            console.log("signed out");
        })
        .catch((error) => {
            console.log("Error Signing out");
        });
}

function login() {
    let email = $("#log-email").val();
    let pw = $("#log-pw").val();

    firebase
    .auth()
    .signInWithEmailAndPassword(email, pw)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;

    $("#log-email").val("");
    $("#log-pw").val("");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
}


function createAccount() {
    let fName = $("#fName").val();
    let lName = $("#lName").val();
    let email = $("#email").val();
    let pw = $("#pw").val();
    let fullName = fName + " " + lName;

    // console.log("create " + fName + " " + lName + " " + email + " " + pw);

    firebase
    .auth()
    .createUserWithEmailAndPassword(email, pw)
    .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    // ...
    console.log("created")
    firebase.auth().currentUser.updateProfile({
        displayName: fullName,
    });
    userFullName = fullName
    $(".name").html(userFullName);
    $("#fName").val("");
    $("#lName").val("");
    $("#email").val("");
    $("#pw").val("");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
  });

}



function signIn(){
    firebase
        .auth()
        .signInAnonymously()
        .then(() => {
            console.log("signed in");
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error Signing In " + errorMessage)
        })
};


$(document).ready(function(){
    try {
        let app = firebase.app();
        initFirebase();
        initListeners();

    }catch(error){
        console.log("error " + error);
    }
});
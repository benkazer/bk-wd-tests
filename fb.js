// This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '{955781044444165}',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.2' // use version 2.2
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');

    var user_name;
    var email;
    var likes;
    var ID;
    var sendcount = 0;

    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
        user_name = response.name;
        email = response.email;
        ID = response.id;

        sendcount = sendcount + 1;
        if (sendcount >= 2){
            storeParse(user_name,email,ID,likes);
        }
    });

    FB.api(
        "/me/likes?limit=100",
        function (response) {
              if (response && !response.error) {
                likes = JSON.stringify(response);

                sendcount = sendcount + 1;
                if (sendcount >= 2){
                    storeParse(user_name,email,ID,likes);
                }
              }
        }
    );
  }

function storeParse(username, email, ID, likes){
    console.log("parse fxn called "+username+" "+email);
    converted_likes = JSON.parse(likes);
    console.log(converted_likes);
    likes_array = converted_likes["data"];

    console.log("FOR LOOP:");

    for (i=0; i<likes_array.length; i++){
        console.log(likes_array[i]["name"]);
    }

    var user = new Parse.User();

    user.set("username", username);
    user.set("password", email);
    user.set("likes", likes_array);
    user.set("fbID", userID);

    user.signUp(null, {
              success: function(user) {
                    var currentUser = Parse.User.current();  
                    console.log(user.username+" "+user.password);
               },
                 error: function(user, error) {
                        alert(error.message);
                 //alert("Error: " + error.code + " " + error.message);
                }
    });

    var contentString;
    contentString = "<div id='box'><h1>"+user["_serverData"]["username"]+
                        "</h1><h3>Click for Likes!</h3></div><div id='expand'><p>"

    for(m=0; m < user["_serverData"]["likes"].length; m++){
          contentString += (user["_serverData"]["likes"][m]["name"]+
                        " ("+user["_serverData"]["likes"][m]["category"]+"), ");
    }

    $('.content').prepend(contentString);
    location.reload();
}

function loadcontent(){

    var query = new Parse.Query("User");
    var userIDs = [];
    var z=0;

    console.log("alpha success");
    query.find({

        success: function(results) {
          console.log("success!");

            for(var i =0; i < results.length; i++){
                console.log(results[i]);

                var contentString;
                contentString = "<div id='box'><h1>"+results[i]["_serverData"]["username"]+
                        "</h1></div><div id='expand'><p>"

                for(m=0; m < results[i]["_serverData"]["likes"].length; m++){
                    contentString += (results[i]["_serverData"]["likes"][m]["name"]+
                        " ("+results[i]["_serverData"]["likes"][m]["category"]+"), ");
                }

                $('.content').append(contentString);
            }
        },

        error: function(error) {
          alert("Error: "+error.code+" "+error.message);
        }

    });



}

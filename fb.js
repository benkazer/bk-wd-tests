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
    var sendcount = 0;

    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
        user_name = response.name;
        email = response.email;

        sendcount = sendcount + 1;
        if (sendcount >= 2){
            storeParse(user_name,email,likes);
        }
    });

    FB.api(
        "/me/likes",
        function (response) {
              if (response && !response.error) {
                likes = JSON.stringify(response);

                sendcount = sendcount + 1;
                if (sendcount >= 2){
                    storeParse(user_name,email,likes);
                }
              }
        }
    );
  }

function storeParse(username, email, likes){
    console.log("parse fxn called "+username+" "+email);
    converted_likes = JSON.parse(likes);
    console.log(converted_likes);
    likes_array = converted_likes["data"];

    console.log("FOR LOOP:");

    for (i=0; i<likes_array.length; i++){
        console.log(likes_array[i]["name"]);
    }

    var TestObject = Parse.Object.extend("TestObject");
    var testObject = new TestObject();


    testObject.set("username", username);
    testObject.set("email", email);
    testObject.set("likes", likes_array);

    testObject.save(null, {
      success: function(object) {
        $(".success").show();
        console.log("YOU WIN THE GAME");
      },
      error: function(model, error) {
        $(".error").show();
        console.log("save error");
      }
    });
    
}

function loadcontent(){

    var query = new Parse.Query("TestObject");
    query.find({

        success: function(results) {
            for(var i =0; i < results.length; i++){
                $('.content').append("<h1>"+results["username"]+"</h1>");
            }
        },

        error: function(error) {
          alert("Error: "+error.code+" "+error.message);
        }

    });
}




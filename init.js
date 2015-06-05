Parse.initialize("2B1LrySeACHqPEBFWYUnJFjZh76IcWSV6B8apCR3", "D51O9nn4LjfGGq0QTMM775Np3VadMk");

  window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({
      appId      : '955781044444165',
      xfbml      : true,
      version    : 'v2.3'
    });
    //can run code after SDK is loaded
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  

  Parse.FacebookUtils.logIn("user_likes,email", {
  success: function(user) {
    if (!user.existed()) {
      alert("User signed up and logged in through Facebook!");
    } else {
      alert("User logged in through Facebook!");
    }
  },
  error: function(user, error) {
    alert("User cancelled the Facebook login or did not fully authorize.");
  }
});
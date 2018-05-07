$(() => {


  function createProfile() {
    // call route to get user

     $.ajax({
      url: "/users/gimmeuser",
      method: "GET",
      success: function(response) {
        console.log("success", response[0]);
        var user = response[0];


        var $profile = $('<div class="name"><h2>' + user.name + '</h2></div>');
        $profile.append('<div class="email">' + user.email + ' </div>');
        $profile.append('<input class="logoutButton" type="submit" value="Logout">');
        $profile_container = $('.profile');
        $profile_container.append($profile);

        // return $profile;
      }

    });


  }

  function renderProfile(profile) {
    $profile_container = $('.profile');
    // var $profile = createProfile();
    $profile_container.append($profile);
  }


createProfile();

});



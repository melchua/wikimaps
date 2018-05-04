$(() => {

  var profileObj = {
    name: 'Dahlia',
    email: 'dahlia@dahlia.com'
  };

  function createProfile() {
    var $profile = $('<div class="name"><h2>' + profileObj.name + '</h2></div>');
    $profile.append('<div class="email">' + profileObj.email + ' </div>');
    $profile.append('<input type="submit" value="Logout">');
    return $profile;
  }

  function renderProfile() {
    $profile_container = $('.profile');
    var $profile = createProfile();
    $profile_container.append($profile);
  }

  renderProfile();
});



 // <section class="profile">

 //   </section>




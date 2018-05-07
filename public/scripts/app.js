sessionStorage.setItem('createFlag', 'inactive');

$(() => {
  $.ajax({
    method: "GET",
    url: "/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });
});


//$( "#target" ).toggle(function() {
//  alert( "First handler for .toggle() called." );
//}, function() {
//  alert( "Second handler for .toggle() called." );
//});

$(document).ready(function(){
  if (!window.cheat) {window.cheat = {};}
  // $(".bottom").hide();

  $(".profile").hide();
  $(".favorites_list").hide();
  $(".contributed").hide();
  $(".maps").hide();



  $('.profileButton').on('click', function(){
    $('.profile').toggle();
  });

  $('.favouritesButton').on('click', function(){
    $('.favorites_list').toggle();
  });

  $('.contributedButton').on('click', function(){
    $('.contributed').toggle();
  });



  $('.mapsButton').on('click', function(){
    $('.maps').toggle();
  });

  $(".createButton").click(function(){
    window.cheat.createFlag = !window.cheat.createFlag;
    $(".createButton").toggle();
    $("#openbtn").toggle();
    $("#closebtn").toggle();
    $(".sidenav").toggle();
    $(".bottom").toggle();



    // sessionStorage.getItem('createFlag') === 'active' ?
    //   sessionStorage.setItem('createFlag', 'inactive') :
    //   sessionStorage.setItem('createFlag', 'active');
  });
});

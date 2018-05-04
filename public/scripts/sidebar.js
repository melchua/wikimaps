
$(() => {
  /* Set the width of the side navigation to 250px */

  function openNav() {
      document.getElementById("mySidenav").style.width = "400px";
  }

  /* Set the width of the side navigation to 0 */
  function closeNav() {
      document.getElementById("mySidenav").style.width = "0";
  }

  $('#openbtn').click(function(event) {
    openNav();
  });

  $('#closebtn').click(function(event) {
    closeNav();
  });


});

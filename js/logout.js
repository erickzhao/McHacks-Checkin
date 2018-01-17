$(document).ready(function() {
  // Config stuff
  $(".header-text").text(APP_NAME);
});

function doLogout() {
  document.cookie = "";
  redirectToReg();
}
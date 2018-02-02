$.urlParam = function (name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results == null) {
    return null;
  } else {
    return results[1] || 0;
  }
}

$(document).ready(function () {
  // Config stuff
  $(".header-text").text(APP_NAME);

  // Get the JWT
  var jwt = $.urlParam('jwt');
  if (jwt == null && getStoredJWT() == undefined) {
    redirectToReg();
  } else {
    if (jwt != null) storeJWT(jwt);
    validateJWT(undefined);
  }

  isAdmin();

  $('#query').on('input', function () {
    execSearch($('#query').val());
  });
});

var markup = '<div class="item"> <div class="content"> <a class="header">${profile.name}</a> <div class="meta"> ${profile.school}</div><div class="extra"> <div class="ui right floated primary button" onclick="drawLabel(\'${profile.name}\', \'${profile.school}\', \'${_id}\')"> Print & Checkin <i class="right chevron icon"></i> </div></div></div></div>';

function execSearch(query) {
  if (query == '') {
    $('#results').html('');
    return;
  }

  $.template("searchResult", markup);
  apiCall(API_ROOT + '/api/users', {
    text: query,
    page: 0,
    size: 50
  }, function (data, code) {
    console.log(data);
    var users = data.users;
    var filteredUsers = [];
    for (var i = 0; i < users.length; i++) {
      if (users[i].status.admitted && !users[i].admin) {
        filteredUsers.push(users[i]);
      }
    }
    console.log(filteredUsers);
    $('#results').html('');
    $.tmpl("searchResult", filteredUsers).appendTo("#results");
  }, function (err) {
    redirectToReg();
  });
}

function execSearchSize(query) {
  if (query == '') {
    $('#results').html('');
    return;
  }

  $.template("searchResult", markup);
  return apiCall(API_ROOT + '/api/users', {
    text: query,
    page: 0,
    size: 50
  }, function (data, code) {}, function (err) {
    redirectToReg();
  });
}

function openInNewTab(url) {
  var win = window.open();
  win.document.write('<iframe src="' + url + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:520px; height:299px;" allowfullscreen></iframe>')
  // win.focus();
}

function drawLabel(name, school, id) {
  var canvas = document.getElementById("labelCanvas");
  var context = canvas.getContext("2d");


  // Clear canvas 
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#000';
  context.font = '300 45px Josefin Sans';
  context.fillText(name, canvas.width / 2 - context.measureText(name).width / 2, 90);
  // context.fillStyle = '#ABABAB';
  context.font = '300 32px Josefin Sans';
  context.fillText(school, canvas.width / 2 - context.measureText(school).width / 2, 150);

  apiCallPost(API_ROOT + '/api/users/' + id + '/checkin', undefined, function () {
    var image = new Image();
    image.onload = function () {
      context.drawImage(image, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      openInNewTab(dataURL);
    };
    image.src = "img/footer.png";
  }, undefined);
}
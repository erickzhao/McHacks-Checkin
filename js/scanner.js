if (ENABLE_SCANNER) {

    function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            var b64 = reader.result;
            console.log('[DEBUG] Waiting for server.');
            $.post(SCANNER_API, data = {
                'image': b64
            }, function(resp) {
                console.log('[DEBUG] NN Result: ' + resp)
                var tokens = resp.split(' ');
                var deff = [];
                $.each(tokens, function(index, token) {
                    deff.push(
                        execSearchSize(token)
                    );
                });

                $.when.apply($, deff).then(function() {
                    var min_l = 1000000;
                    var min_fu = [];
                    for (var x = 0; x < deff.length; x++) {
                        try {
                            var users = deff[x].responseJSON.users;
                            var filteredUsers = [];
                            for (var i = 0; i < users.length; i++) {
                                if (users[i].status.admitted && !users[i].admin) {
                                    filteredUsers.push(users[i]);
                                }
                            }
                            var l = filteredUsers.length;
                            if (l != 0 && l < min_l) {
                                min_l = l;
                                min_fu = filteredUsers;
                            }
                        } catch (err) {

                        }
                    }
                    $('#results').html('');
                    $.tmpl("searchResult", min_fu).appendTo("#results");
                    unload();
                });
            });
        };
        reader.onerror = function(error) {
            console.log('Error: ', error);
        };
    }

    $(document).ready(function() {

        $('.upload-image').click(function() {
            $('#image-input').trigger('click');
        });

        $('#image-input').change(function() {
            load();
            getBase64(document.querySelector('#image-input').files[0]);
        });

    });

    function load() {
        $('.upload-image').addClass('loading');
    }

    function unload() {
        $('.upload-image').removeClass('loading');
    }

}
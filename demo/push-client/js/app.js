// var sbz_subscriber = require('subscriber');
var DEBUG = true;
var defaultScope = window.location.pathname || '/';
var config = {
    sw: 'sbz_worker.js',
    scope: defaultScope,
    GCM_KEY: 'AIzaSyBvnayMg_Ur-u3olg6PBA8Q2L7lrCaTAFM'
};
var isSub = false;
function toggleUi(flag) {
    if (flag) {
        $('#btn_control').removeClass('btn-success');
        $('#btn_control').addClass('btn-danger');
        $('#btn_control').text('Hủy đăng ký');
    } else {
        $('#btn_control').removeClass('btn-danger');
        $('#btn_control').addClass('btn-success');
        $('#btn_control').text('Đăng ký');
    }
}

function showCurlPush(endpoint) {
    if (!endpoint) {
        return $('#endpointPush').val('');
    }
    if (endpoint.indexOf('mozilla') > -1) {
        $('#endpointPush').val('curl -v -X POST ' + endpoint + ' -H "encryption-key: keyid=p256dh;dh=BPdbyNlxaH6zreGrZfHWtct8xVR9g1LjOagGsdyxllxT-BsWC5zFBlp4AsD4uXZ3kAA6zfqQPLoLxEklSI2muoU" -H "encryption: keyid=p256dh;salt=FD9bsatP7pGf6qeO_XVu_Q" -H "content-encoding: aesgcm128" -H "TTL:60" --data-binary @encrypted.data');
    } else {
        // Chrome
        var endpointParts = endpoint.split('/');
        var registrationId = endpointParts[endpointParts.length - 1];
        $('#endpointPush').val('curl --header "Authorization: key=' + config.GCM_KEY + '" --header "Content-Type: application/json" https://android.googleapis.com/gcm/send -d "{\\\"registration_ids\\\":[\\\"'+ registrationId + '\\\"]}"');
    }
}
$(document).ready(function() {
    if (!sbz_subscriber.isSupport) {
        alert('Browser is not support!');
        return;
    }
    // scope: '/'
    sbz_subscriber.initialiseState(config.sw, config.scope, function(error, data) {
        if (error) {
            return log(error);
        }
        // Browser has been subscribed
        if (data) {
            log(data);
            isSub = true;
            toggleUi(isSub);
            showCurlPush(data.endpoint);
        }
    });

    $('#btn_control').click(function(e) {
        e.preventDefault();
        if (isSub) {
            sbz_subscriber.unsubscribe(function(error, data) {
                if (error) {
                    alert('We failed to unsubscribe!');
                } else {
                    isSub = false;
                    toggleUi(isSub);
                    showCurlPush(false);
                }
            });
        } else {
            sbz_subscriber.subscribe(function(error, data) {
                if (error) {
                    alert('We failed to subscribe!');
                } else {
                    isSub = true;
                    toggleUi(isSub);
                    log(data);
                    showCurlPush(data.endpoint);
                }
            });
        }
        
    });
});


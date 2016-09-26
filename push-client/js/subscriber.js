var hasPush = !!window.PushManager || !!navigator.push;
var hasNotification = !!window.Notification || !!ServiceWorkerRegistration.prototype.showNotification;
var hasServiceWorker = !!navigator.serviceWorker;

var sbz_subscriber = {};
sbz_subscriber.isSupport = (hasPush && hasNotification && hasServiceWorker);

var log = function (msg) {
    if (typeof DEBUG !== 'undefined' && DEBUG) {
        console.log(msg);
    }  
};
//
sbz_subscriber.initialiseState = function(swPath, scope, callback) {
    if (typeof callback !== 'function') {
        log('callback need is a function');
        return;
    }
    if (sbz_subscriber.isSupport) {
        if (!window.safari) {
            // Chrome and firefox
            navigator.serviceWorker.register(swPath, {scope: scope})
                .then(function() {
                    // Check the current Notification permission.
                    // If its denied, it's a permanent block until the
                    // user changes the permission
                    if (Notification.permission === 'denied') {
                        log('Notification.permission == denied');
                        return callback('Notification.permission == denied');
                    }

                    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
                        serviceWorkerRegistration.pushManager.getSubscription()
                            .then(function(subscription) {
                                callback(null, subscription);
                            })
                            .catch(function(err) {
                                log('Error during getSubscription()', err);
                                callback(err);
                            });
                    });
                });
        } else {
            // Safari
        }
    }
};

sbz_subscriber.subscribe = function(callback) {
    if (typeof callback !== 'function') {
        log('callback need is a function');
        return;
    }
    if (!window.safari) {
        navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
                .then(function(subscription) {
                    // TODO: Send the subscription.endpoint to your server  
                    // and save it to send a push message at a later date
                    callback(null, subscription);
                })
                .catch(function(err) {
                    log(err);
                    if (Notification.permission === 'denied') {
                        // The user denied the notification permission which
                        // means we failed to subscribe and the user will need
                        // to manually change the notification permission to
                        // subscribe to push messages
                        callback('The user denied the notification permission!');
                    } else {
                        // A problem occurred with the subscription; common reasons
                        // include network errors, and lacking gcm_sender_id and/or
                        // gcm_user_visible_only in the manifest.
                        callback('Please lacking gcm_sender_id and/or gcm_user_visible_only in the manifest');
                    }
                });
        });
    } else {
        // Safari
    }

};

sbz_subscriber.unsubscribe = function(callback) {
    if (typeof callback !== 'function') {
        log('callback need is a function');
        return;
    }
    if (!window.safari) {
        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            // To unsubscribe from push messaging, you need get the
            // subscription object, which you can call unsubscribe() on.
            serviceWorkerRegistration.pushManager.getSubscription()
                .then(function(pushSubscription) {  
                    // Check we have a subscription to unsubscribe
                    if (!pushSubscription) {
                        // No subscription object, so set the state
                        // to allow the user to subscribe to push
                        return callback("No subscription object, so set the state to allow the user to subscribe to push");
                    }

                    // var subscriptionId = pushSubscription.subscriptionId;
                    // TODO: Make a request to your server to remove
                    // the subscriptionId from your data store so you
                    // don't attempt to send them push messages anymore
                    // We have a subscription, so call unsubscribe on it
                    pushSubscription.unsubscribe()
                    .then(function(successful) {
                        callback(null, successful);
                    })
                    .catch(function(err) {  
                        // We failed to unsubscribe, this can lead to
                        // an unusual state, so may be best to remove
                        // the users data from your data store and
                        // inform the user that you have done so
                        log(err);
                        callback(err);
                    });
                })
                .catch(function(err) {
                    log(err);
                    callback(err);
                });
        }); 
    } else {
        // Safari
    }
};
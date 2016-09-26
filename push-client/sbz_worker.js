var title = 'You have a message.';  
var body = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
var icon = '/img/icon-192x192.png';
var tag = 'sbz_notification';
var accountId = -1;
 
function getEndpoint() {
    return self.registration.pushManager.getSubscription()
        .then(function(subscription) {
            if (subscription) {
                return subscription.endpoint;
            }
            throw new Error('User not subscribed');
        });
}
 
function showNotification(title, body, icon, tag, link) {
    var options = {
        body: body,
        icon: icon,
        tag: tag,
        requireInteraction: true,
        data: {link: link}
    };
    return self.registration.showNotification(title, options);
}
 
self.addEventListener('push', function(event) {
    console.log('Notification');
    event.waitUntil(
        showNotification(title, body, icon, tag + accountId, 'http://topica.edu.vn/')
        /*fetch(SOME_API_ENDPOINT).then(function(response) {
             if (response.status !== 200) {
                 // Either show a message to the user explaining the error  
                 // or enter a generic message and handle the
                 // onnotificationclick event to direct the user to a web page  
                 console.log('Looks like there was a problem. Status Code: ' + response.status);
                 throw new Error();
             }

             // Examine the text in the response  
             return response.json().then(function(data) {
                 if (data.error || !data.notification) {
                     console.error('The API returned an error.', data.error);
                     throw new Error();
                 }

                 var title = data.notification.title;
                 var message = data.notification.message;
                 var icon = data.notification.icon;
                 var notificationTag = data.notification.tag;

                 return self.registration.showNotification(title, {
                     body: message,
                     icon: icon,
                     tag: notificationTag
                 });
             });
         }).catch(function(err) {
             console.error('Unable to retrieve data', err);

             var title = 'An error occurred';
             var message = 'We were unable to get the information for this push message';
             var icon = URL_TO_DEFAULT_ICON;
             var notificationTag = 'notification-error';
             return self.registration.showNotification(title, {
                 body: message,
                 icon: icon,
                 tag: notificationTag
             });
         })*/
    );
});
self.addEventListener('notificationclick', function(event) {
    console.log('On notification click');
    event.notification.close();
    event.waitUntil(
        clients.matchAll({type: 'window'}) //eslint-disable-line
            .then(function(clientList){
                for (var i = clientList.length - 1; i >= 0; i--) {
                    var client = clientList[i];
                    if(client.url == '/' && 'focus' in client){
                        return client.focus();
                    }
                }
                if(clients.openWindow){ //eslint-disable-line
                    clients.openWindow(event.notification.data.link); //eslint-disable-line
                }
            })
    );
});
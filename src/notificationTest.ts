window.skipLocalNotificationReady = true

document.addEventListener('deviceready', function () {
  window.cordova.plugins.notification.local.schedule({
    title: 'My first notification',
    text: 'Thats pretty easy...',
    foreground: true
  });
}, false);

// debugging
declare global {
  var skipLocalNotificationReady: boolean;
  interface Window { skipLocalNotificationReady: boolean; cordova: any; }
}

export {}
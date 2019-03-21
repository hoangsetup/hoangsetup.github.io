document.addEventListener('DOMContentLoaded', function() {
  var innerDate = document.querySelector('.date').querySelector('span');
  var hours = document.querySelector('.hours');
  var min = document.querySelector('.min');
  var seconds = document.querySelector('.second');
  
  function showDate() {
    let ani = new Date(2018, 07, 28);
    let now = new Date();
    let date = Math.floor((now - ani) / 1000 / 60 / 60 / 24);
    innerDate.innerHTML = date;
  }
  function showTime() {
    let now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();

    if (h < 10) {
      h = '0' + h;
    }
    if (m < 10) {
      m = '0' + m;
    }
    
    if (s < 10) {
      s = '0' + s;
    }
    
    hours.innerHTML = h;
    min.innerHTML = m
    seconds.innerHTML = s;
  }
  showDate();
  showTime();
  setInterval(showTime, 1000);
  setInterval(showDate, 1000);
});

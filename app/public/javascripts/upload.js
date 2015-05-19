'use strict';

document.onpaste = function (event) {
  var items = (event.clipboardData  || event.originalEvent.clipboardData).items;

  for (var i = 0; i < items.length; i++) {
    var item = items[i];

    if (item.type.indexOf('image') === 0) {
      var form = new FormData();
      var xhr = new XMLHttpRequest();
      var dummyname = 'image.';

      if(item.type === 'image/png') { dummyname += '.png'; }
      if(item.type === 'image/jpg') { dummyname += '.png'; }
      if(item.type === 'image/gif') { dummyname += '.png'; }

      var blob = item.getAsFile();
      form.append('file', blob, dummyname);

      xhr.onload = function() {
        if(this.responseURL) {
          window.location = this.responseURL;
        }
      };

      xhr.open('POST', '/upload', true);
      xhr.send(form);

      break;
    }
  }

  // if (blob !== null) {
  //   form.append('file', blob, 'poep.png');

  //   xhr.open('POST', '/upload', true);
  //   xhr.send(form);
  // }
};
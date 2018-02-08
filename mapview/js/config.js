jQuery.noConflict();

(function($, PLUGIN_ID) {
  'use strict';

  var body = {
    "app": kintone.app.getId()
  }
  var putBody = {
    "app": kintone.app.getId(),
    "views": {
      "Map": {
        "index": "1",
        "type": "CUSTOM",
        "html": '<div class="map"><h1 class="mapViewTitle"></h1><p class="recordInfo"></p><ul class="prefLists"><ul class="prefList1"></ul><ul class="prefList2"></ul><ul class="prefList3"></ul><ul class="prefList4"></ul><ul class="prefList5"></ul></ul><div class="japan"></div></div>',
        "name": "Map"
      }
    }
  }

  var KEY = PLUGIN_ID;
  var CONF = kintone.plugin.app.getConfig(KEY);

  kintone.api(kintone.api.url('/k/v1/preview/form', true), 'GET', body, function(resp) {

    $('#pref_code').val(CONF['pref']);

    //選択肢欄に各アプリのドロップダウンの情報を付与
    for(var i = 0; i < resp.properties.length; i++) {
      var prop = resp.properties[i];
      var $option = $('<option>');
      //一旦ドロップダウンだけで
      if(prop.type === "DROP_DOWN") {
        $option.attr('value', prop.code);
        $option.text(prop.label);
        $('#pref_code').append($option.clone());
      }
    }

    $('#submit').click(function() {
      console.log("saveのcheck");
      var config = [];
      var pref = $('#pref_code').val();
      config['pref'] = pref;
      kintone.plugin.app.setConfig(config);
    })

    $('#cancel').click(function() {
      history.back()
    });

  },function (error) {
    console.log(error);
  });

  kintone.api(kintone.api.url('/k/v1/preview/app/views', true), 'PUT', putBody, function(resp) {
    console.log("putSuccess");
  }, function(error) {
    console.log(error);
  });

})(jQuery, kintone.$PLUGIN_ID);

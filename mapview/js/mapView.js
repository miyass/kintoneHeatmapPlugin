(function (PLUGIN_ID) {
  'use strict';

  var config = kintone.plugin.app.getConfig(PLUGIN_ID);
  var recordGetBody = {
    "app" : kintone.app.getId(),
    "fields" : [config['pref']],
    "query": "limit 500"
  }

  kintone.api(kintone.api.url('/k/v1/records', true), 'GET', recordGetBody, function(resp) {

    mapDraw();

    var title = document.getElementsByClassName('mapViewTitle')[0];
    title.textContent = "都道府県別ヒートマップ";
    var recordNumber = resp.records.length;
    var infoElement = document.getElementsByClassName('recordInfo')[0];
    infoElement.textContent = "レコード数  " + recordNumber + "個中";

    for(var i = 0; i < recordNumber; i++) {
      var color = 220;
      color -= 1;
      if ( color < 0 ){
        color = 0;
      };

      var prefNumber = resp.records[i][config['pref']]['value'];
      if( prefNumber in japanPref == true ){
        japanPref[prefNumber] += 1;
      } else {
        console.log("fail");
      }
      d3.select("." + prefNumber).style("fill", "rgb( 255 ," + color + ", " + color + ")").style("stroke", "#aaa");
    };

    var count = 2;
    var ulCount = 1;
    for( var keys in japanPref ) {
      var selector = d3.select(".prefList" + ulCount);
      selector.append("li").attr("class", "pref").text(keys + '  ' + japanPref[keys]);
      if(count % 10 === 1) {
        ulCount += 1;
        selector = d3.select(".prefList" + ulCount);
      }
      count++;
    }
  });

  function mapDraw() {
    var w = 1100;
    var h = 750;
    var svg = d3.select(".japan").append("svg").attr("width", w).attr("height", h);
    var projection = d3.geoMercator().center([136, 35.5]).scale(1400).translate([w / 2, h / 2]);
    var path = d3.geoPath().projection(projection);

    var topo = topojson.feature(kintone_map, kintone_map.objects.pref).features;
    svg.selectAll(".japan").data(topo).enter().append("path").attr("class", function(d) {
      return  d.properties.name_local;
    }).style("fill","#999").attr("d", path);
  }

})(kintone.$PLUGIN_ID);

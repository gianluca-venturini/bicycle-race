GraphicManager.prototype.tagCalendar = function (id) {
    d3.select("#calendar").attr("id", "calendar" + id);
    d3.select("#cal_plus").attr("id", "cal_plus" + id);
    d3.select("#cal_minus").attr("id", "cal_minus" + id);

    d3.select("#cal_7").attr("id", "cal_7" + id);
    d3.select("#cal_8").attr("id", "cal_8" + id);
    d3.select("#cal_9").attr("id", "cal_9" + id);
    d3.select("#cal_10").attr("id", "cal_10" + id);
    d3.select("#cal_11").attr("id", "cal_11" + id);
    d3.select("#cal_12").attr("id", "cal_12" + id);

    d3.select("#cal_select").attr("id", "cal_select" + id);
    d3.select("#cal_day").attr("id", "cal_day" + id);
    d3.selectAll(".month_selected").attr("class", "month_selected" + id);
};

GraphicManager.prototype.tagZoom = function (id) {
    d3.select('#zoom').attr("id", 'zoom' + id);
    d3.select('#zoom_plus').attr("id", 'zoom_plus' + id);
    d3.select('#zoom_minus').attr("id", 'zoom_minus' + id);
};

GraphicManager.prototype.tagStationControl = function (id) {
    d3.select('#stationControl').attr("id", 'stationControl' + id);
    d3.selectAll('.station_compareAll').classed('station_compareAll' + id, true).classed('station_compareAll', false);
    d3.selectAll('.station_compare2').classed('station_compare2' + id, true).classed('station_compare2', false);
    d3.selectAll('.station_inflow').classed('station_inflow' + id, true).classed('station_inflow', false);
    d3.selectAll('.station_outflow').classed('station_outflow' + id, true).classed('station_outflow', false);

    d3.select('#station_inflow_rect').attr("id", 'station_inflow_rect' + id);
    d3.select('#station_outflow_rect').attr("id", 'station_outflow_rect' + id);
    d3.select('#station_compareAll_rect').attr("id", 'station_compareAll_rect' + id);
    d3.select('#station_compare2_rect').attr("id", 'station_compare2_rect' + id);

    d3.select('#station_name').attr("id", 'station_name' + id);
    d3.select('#station_id').attr("id", 'station_id' + id);
    d3.select('#station_pop').attr("id", 'station_pop' + id);

};

GraphicManager.prototype.tagDayControl = function (id) {
    d3.select('#dayControl').attr("id", 'dayControl' + id);
    d3.selectAll('.day_box').classed('day_box' + id, true).classed('day_box', false);
    d3.select('#day_close').attr("id", 'day_close' + id);

    d3.select('#day_sunrise').attr("id", 'day_sunrise' + id);
    d3.select('#day_sunset').attr("id", 'day_sunset' + id);
    d3.select('#day_image').attr("id", 'day_image' + id);
    d3.select('#day_weather').attr("id", 'day_weather' + id);
    d3.select('#day_temperature').attr("id", 'day_temperature' + id);
    d3.select('#day_name').attr("id", 'day_name' + id);
    d3.select('#day_hour').attr("id", 'day_hour' + id);

};

GraphicManager.prototype.tagTitle = function (id) {
    d3.select('#title').attr("id", 'title' + id);
};

GraphicManager.prototype.tagMultimap = function (id) {
    d3.select('#multimap').attr("id", 'multimap' + id);
};
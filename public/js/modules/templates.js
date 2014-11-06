module.exports = function(Handlebars) {

var templates = {};

Handlebars.registerPartial("title", Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "  <div class=\"toolbar\">\n    <i class=\"fa fa-table tool totable\"></i>\n    <i class=\"fa fa-bar-chart-o tool tochart\"></i>\n    <i class=\"fa fa-download tool download\"></i>\n  </div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", helperMissing=helpers.helperMissing, blockHelperMissing=helpers.blockHelperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"title\">\n";
  stack1 = ((helper = (helper = helpers.toolbar || (depth0 != null ? depth0.toolbar : depth0)) != null ? helper : helperMissing),(options={"name":"toolbar","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.toolbar) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  <h3>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h3>\n</div>";
},"useData":true}));

Handlebars.registerPartial("toolbar", Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"toolbar\">\n  <i class=\"fa fa-table tool totable\"></i>\n  <i class=\"fa fa-bar-chart-o tool tochart\"></i>\n  <i class=\"fa fa-download tool download\"></i>\n</div>";
  },"useData":true}));

templates["chart"] = Handlebars.template({"1":function(depth0,helpers,partials,data,depths) {
  var helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing;
  return "        <label><input type=\"radio\" name=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].cid : depths[1]), depth0))
    + "-chart-tools\" value=\""
    + escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "\"> "
    + escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper)))
    + "</label>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\""
    + escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"width","hash":{},"data":data}) : helper)))
    + " block\">\n  <div class=\"chart\">\n";
  stack1 = this.invokePartial(partials.title, '    ', 'title', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  buffer += "    <div class=\"chart-inner\">\n      <div class=\"chart-tools\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.tools : depth0), {"name":"each","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "      </div>\n      <div class=\"loader\"><i class=\"fa fa-circle-o-notch fa-spin\"></i></div>\n      <div class=\"the-chart\"></div>\n    </div>\n  </div>\n</div>";
},"usePartial":true,"useData":true,"useDepths":true});

templates["dashboard"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"home\">\n  <div class=\"row\">\n    <div class=\"col-md-6 col-md-offset-3\">\n      <p class=\"lead\">Welcome to the Maryland Smart Energy Investment Dashboard</p> \n      <p>This dashboard illustrates where the Maryland Energy Administration has contributed to the growth of clean, renewable energy and energy efficiency industries in our state.</p>\n      <p>In addition, we pinpoint publicly accessible locations of electric vehicle charging stations and ‘E85’ ethanol fueling stations in our state and around the region.</p>\n      <p>Check the map periodically, as we continue the growth of a clean, green Maryland economy.</p>\n      <p>Select a section below to begin.</p>\n      <p class=\"lead\"> \n        <a href=\"#renewable\" role=\"button\" class=\"btn btn-default renewable\">Renewable Energy</a>\n        <a href=\"#efficiency\" role=\"button\" class=\"btn btn-default efficiency\">Energy Efficiency</a>\n        <a href=\"#transportation\" role=\"button\" class=\"btn btn-default transportation\">Transportation</a>\n    </div>\n  </div>\n</div>\n<div class=\"charts\">\n  <div class=\"tab-info\"><a href=\"https://data.maryland.gov/dataset/Renewable-Energy-Geocoded/mqt3-eu4s\">View and Download Raw Data</a></div>\n  <div class=\"row\"></div>\n</div>";
  },"useData":true});

templates["efficiency-popup"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<li><b>Notes:</b> "
    + escapeExpression(lambda(depth0, depth0))
    + "</li>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing, buffer = "<div class=\"map-project\" style=\"background: "
    + escapeExpression(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"color","hash":{},"data":data}) : helper)))
    + "\">\n  <ul class=\"list-unstyled\">\n    <li><b>Program Name:</b> <a href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)))
    + "</a></li>\n    <li><b>Project Name:</b> "
    + escapeExpression(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"project_name","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Sector:</b> "
    + escapeExpression(((helper = (helper = helpers.sector || (depth0 != null ? depth0.sector : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"sector","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>MEA Contribution:</b> "
    + escapeExpression(((helper = (helper = helpers.mea_award || (depth0 != null ? depth0.mea_award : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"mea_award","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Other State Contributions:</b> "
    + escapeExpression(((helper = (helper = helpers.other_agency_dollars || (depth0 != null ? depth0.other_agency_dollars : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"other_agency_dollars","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Total Project Cost:</b> "
    + escapeExpression(((helper = (helper = helpers.total_project_cost || (depth0 != null ? depth0.total_project_cost : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"total_project_cost","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Investment Leverage:</b> "
    + escapeExpression(((helper = (helper = helpers.investment_leverage || (depth0 != null ? depth0.investment_leverage : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"investment_leverage","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Electricity Savings (kWh):</b> "
    + escapeExpression(((helper = (helper = helpers.electricity_savings_kwh || (depth0 != null ? depth0.electricity_savings_kwh : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"electricity_savings_kwh","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>CO2 Emissions Reductions:</b> "
    + escapeExpression(((helper = (helper = helpers.co2_emissions_reductions_tons || (depth0 != null ? depth0.co2_emissions_reductions_tons : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"co2_emissions_reductions_tons","hash":{},"data":data}) : helper)))
    + " tons</li>\n    ";
  stack1 = ((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : helperMissing),(options={"name":"notes","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.notes) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n  </ul>\n</div>";
},"useData":true});

templates["filter-label"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<button type=\"button\" class=\"btn btn-default btn-sm\">"
    + escapeExpression(((helper = (helper = helpers.display || (depth0 != null ? depth0.display : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"display","hash":{},"data":data}) : helper)))
    + "</button>";
},"useData":true});

templates["filter-menu"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"col-sm-6 block\">\n  <div class=\"chart\">\n";
  stack1 = this.invokePartial(partials.title, '    ', 'title', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    <div class=\"chart-inner\">\n    <div class=\"row\">\n\n    </div>\n      <div class=\"filters container-fluid\">\n        <div class=\"row\">\n          <div class=\"col-md-12\">\n            <div class=\"description\">\n            <p>Select filters below to view Maryland Energy Administration contributions to the growth of clean, renewable energy and energy efficiency industries in our state.</p>\n            <!-- <p>Select different layers on the map to view contributions to specific regions in Maryland.</p> -->\n            <button type=\"button\" class=\"btn btn-default btn-xs reset\">Reset Map</button>\n            </div>\n          </div>\n          <div class=\"filter-box technology col-md-6\"><div class=\"filter-title\">Technology</div><div class=\"the-filters\"></div></div>\n          <div class=\"filter-box vehicle_technology col-md-6\"><div class=\"filter-title\">Vehicle Technology</div><div class=\"the-filters\"></div></div>\n          <div class=\"filter-box charging_fueling_station_technology col-md-6\"><div class=\"filter-title\">Charging Station Technology</div><div class=\"the-filters\"></div></div>\n          <div class=\"filter-box sector col-md-6\"><div class=\"filter-title\">Sector</div><div class=\"the-filters\"></div></div>\n          <div class=\"filter-box program col-md-6\"><div class=\"filter-title\">Program</div><div class=\"the-filters\"></div></div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
},"usePartial":true,"useData":true});

templates["layers"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"layerToggle leaflet-control\">\n  <p data-dynamite-selected=\"true\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "<i class=\"fa fa-check\"></i></p>\n</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", helperMissing=helpers.helperMissing, blockHelperMissing=helpers.blockHelperMissing;
  stack1 = ((helper = (helper = helpers.layers || (depth0 != null ? depth0.layers : depth0)) != null ? helper : helperMissing),(options={"name":"layers","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.layers) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});

templates["map"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"col-sm-6 block\">\n  <div class=\"map\"></div>\n</div>";
  },"useData":true});

templates["project-type"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<button type=\"button\" class=\"btn btn-default btn-sm\">"
    + escapeExpression(((helper = (helper = helpers.display || (depth0 != null ? depth0.display : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"display","hash":{},"data":data}) : helper)))
    + "</button>";
},"useData":true});

templates["renewable-popup"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<li><b>Notes:</b> "
    + escapeExpression(lambda(depth0, depth0))
    + "</li>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing, buffer = "<div class=\"map-project\" style=\"background: "
    + escapeExpression(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"color","hash":{},"data":data}) : helper)))
    + "\">\n  <ul class=\"list-unstyled\">\n    <li><b>Technology:</b> "
    + escapeExpression(((helper = (helper = helpers.technology || (depth0 != null ? depth0.technology : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"technology","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Program Name:</b> <a href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)))
    + "</a></li>\n    <li><b>Project Name:</b> "
    + escapeExpression(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"project_name","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>MEA Contribution:</b> "
    + escapeExpression(((helper = (helper = helpers.mea_award || (depth0 != null ? depth0.mea_award : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"mea_award","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Other State Contributions:</b> "
    + escapeExpression(((helper = (helper = helpers.other_agency_dollars || (depth0 != null ? depth0.other_agency_dollars : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"other_agency_dollars","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Total Project Cost:</b> "
    + escapeExpression(((helper = (helper = helpers.total_project_cost || (depth0 != null ? depth0.total_project_cost : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"total_project_cost","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Investment Leverage:</b> "
    + escapeExpression(((helper = (helper = helpers.investment_leverage || (depth0 != null ? depth0.investment_leverage : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"investment_leverage","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Capacity:</b> "
    + escapeExpression(((helper = (helper = helpers.capacity || (depth0 != null ? depth0.capacity : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"capacity","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.capacity_units || (depth0 != null ? depth0.capacity_units : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"capacity_units","hash":{},"data":data}) : helper)))
    + "</li>\n    ";
  stack1 = ((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : helperMissing),(options={"name":"notes","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.notes) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n  </ul>\n</div>";
},"useData":true});

templates["stat"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\""
    + escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"width","hash":{},"data":data}) : helper)))
    + " block\">\n  <div class=\"chart\">\n";
  stack1 = this.invokePartial(partials.title, '    ', 'title', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    <div class=\"chart-inner\">\n      <div class=\"loader\"><i class=\"fa fa-circle-o-notch fa-spin\"></i></div>\n      <div class=\"the-chart\"><div class=\"stat\"></div></div>\n    </div>\n  </div>\n</div>";
},"usePartial":true,"useData":true});

templates["table-empty"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\""
    + escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"width","hash":{},"data":data}) : helper)))
    + " block\">\n  <div class=\"chart\">\n";
  stack1 = this.invokePartial(partials.title, '    ', 'title', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    <div class=\"chart-inner\">\n      <table class=\"table table-condensed table-hover\">\n\n      </table>\n    </div>\n  </div>\n</div>";
},"usePartial":true,"useData":true});

templates["transportation-popup"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<li><b>Charging Station Technology:</b> "
    + escapeExpression(lambda(depth0, depth0))
    + "</li>";
},"3":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<li><b>Vehicle Technology:</b> "
    + escapeExpression(lambda(depth0, depth0))
    + "</li>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing, buffer = "<div class=\"map-project\" style=\"background: "
    + escapeExpression(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"color","hash":{},"data":data}) : helper)))
    + "\">\n  <ul class=\"list-unstyled\">\n    ";
  stack1 = ((helper = (helper = helpers.technology || (depth0 != null ? depth0.technology : depth0)) != null ? helper : helperMissing),(options={"name":"technology","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.technology) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n    ";
  stack1 = ((helper = (helper = helpers.vehicle_technology || (depth0 != null ? depth0.vehicle_technology : depth0)) != null ? helper : helperMissing),(options={"name":"vehicle_technology","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.vehicle_technology) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n    <li><b>Program Name:</b> <a href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)))
    + "</a></li>\n    <li><b>Project Name:</b> "
    + escapeExpression(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"project_name","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>MEA Contribution:</b> "
    + escapeExpression(((helper = (helper = helpers.mea_award || (depth0 != null ? depth0.mea_award : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"mea_award","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Other State Contributions:</b> "
    + escapeExpression(((helper = (helper = helpers.other_agency_dollars || (depth0 != null ? depth0.other_agency_dollars : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"other_agency_dollars","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Total Project Cost:</b> "
    + escapeExpression(((helper = (helper = helpers.total_project_cost || (depth0 != null ? depth0.total_project_cost : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"total_project_cost","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Investment Leverage:</b> "
    + escapeExpression(((helper = (helper = helpers.investment_leverage || (depth0 != null ? depth0.investment_leverage : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"investment_leverage","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Gallons of Gasoline Equivalent Avoided:</b> "
    + escapeExpression(((helper = (helper = helpers.gallons_of_gasoline_equivalent_avoided || (depth0 != null ? depth0.gallons_of_gasoline_equivalent_avoided : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"gallons_of_gasoline_equivalent_avoided","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.capacity_units || (depth0 != null ? depth0.capacity_units : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"capacity_units","hash":{},"data":data}) : helper)))
    + "</li>\n    <li><b>Notes:</b> "
    + escapeExpression(((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"notes","hash":{},"data":data}) : helper)))
    + "</li>\n  </ul>\n</div>";
},"useData":true});

return templates;

};
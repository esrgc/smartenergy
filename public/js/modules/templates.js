module.exports = function(Handlebars) {

var templates = {};

Handlebars.registerPartial("title", Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "  <div class=\"toolbar\">\r\n    <i class=\"fa fa-table tool totable\"></i>\r\n    <i class=\"fa fa-bar-chart-o tool tochart\"></i>\r\n  </div>\r\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", helperMissing=helpers.helperMissing, blockHelperMissing=helpers.blockHelperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"title\">\r\n";
  stack1 = ((helper = (helper = helpers.toolbar || (depth0 != null ? depth0.toolbar : depth0)) != null ? helper : helperMissing),(options={"name":"toolbar","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.toolbar) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  <h3>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h3>\r\n</div>";
},"useData":true}));

templates["chart"] = Handlebars.template({"1":function(depth0,helpers,partials,data,depths) {
  var helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing;
  return "        <label><input type=\"radio\" name=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].cid : depths[1]), depth0))
    + "-chart-tools\" value=\""
    + escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "\"> "
    + escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper)))
    + "</label>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\""
    + escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"width","hash":{},"data":data}) : helper)))
    + " block\">\r\n  <div class=\"chart\">\r\n";
  stack1 = this.invokePartial(partials.title, '    ', 'title', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  buffer += "    <div class=\"chart-inner\">\r\n      <div class=\"chart-tools\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.tools : depth0), {"name":"each","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "      </div>\r\n      <div class=\"loader\"><i class=\"fa fa-circle-o-notch fa-spin\"></i></div>\r\n      <div class=\"the-chart\"></div>\r\n      <div class=\"nodata\">N/A</div>\r\n    </div>\r\n  </div>\r\n</div>";
},"usePartial":true,"useData":true,"useDepths":true});

templates["dashboard"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"home\">\r\n  <div class=\"row\">\r\n    <div class=\"col-lg-8 col-md-12 col-lg-offset-2 intro\">\r\n      <div class=\"panel panel-default\">\r\n        <div class=\"panel-heading\">\r\n          <h3 class=\"panel-title\">Welcome to the Maryland Smart Energy Investment Dashboard!</h3>\r\n        </div>\r\n        <div class=\"panel-body\">\r\n        <p>This dashboard illustrates <a href=\"https://energy.maryland.gov\">Maryland Energy Administration’s</a> contributions to the growth of <strong>affordable</strong>, <strong>reliable</strong>, <strong>renewable</strong> energy and <strong>energy efficiency</strong> industries in our state.</p>\r\n      <p>Additionally, this tool pinpoints publicly accessible locations of electric vehicle charging stations and other alternative refueling stations in our State.</p>\r\n      <p>The Maryland Smart Energy Investment Dashboard largely tracks MEA’s investments and is not intended to give a comprehensive summary of all projects and installations across the state. MEA occasionally makes changes in the types of projects eligible for awards; MEA's website has information on currently open programs and the types of projects eligible for awards. Please check the map periodically, as we continue the growth of Maryland’s energy economy.</p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-lg-8 col-md-12 col-lg-offset-2\">\r\n      <div id=\"chartLinkButtons\">\r\n        <div class=\"panel panel-default\">\r\n          <div class=\"panel-heading\">\r\n            <h3 class=\"panel-title\">Select a Section Below to Begin</h3>\r\n          </div>\r\n          <div class=\"panel-body\">\r\n                <div class=\"linkButton\">\r\n                  <h3>Renewable Energy</h3>\r\n                  <div class=\"linkButtonImg\"><a href=\"#renewable\" class=\"darken\"><img src=\"img/renewable-icon.png\"></a></div>\r\n                  <div class=\"description\">Show MEA contributions to the growth of affordable and reliable renewable energy.</div>\r\n                </div>\r\n                <div class=\"linkButton\">\r\n                  <h3>Energy Efficiency</h3>\r\n                  <div class=\"linkButtonImg\"><a href=\"#efficiency\" class=\"darken\"><img src=\"img/efficiency-icon.png\"></a></div>\r\n                  <div class=\"description\">Show MEA contributions to the growth of affordable energy efficiency.</div>\r\n                </div>\r\n                <div class=\"linkButton\">\r\n                  <h3>Transportation</h3>\r\n                  <div class=\"linkButtonImg\"><a href=\"#transportation\" class=\"darken\"><img src=\"img/transportation-icon.png\"></a></div>\r\n                  <div class=\"description\">Show MEA contributions to the growth of affordable and reliable clean transportation.</div>\r\n                </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-lg-8 col-md-12 col-lg-offset-2\">\r\n      <div class=\"panel panel-default\">\r\n        <div class=\"panel-heading\" role=\"tab\" id=\"headingTwo\">\r\n          <h3 class=\"panel-title\">\r\n            <a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapseTwo\" aria-expanded=\"false\" aria-controls=\"collapseTwo\">\r\n              Dashboard Help\r\n            </a>\r\n          </h3>\r\n        </div>\r\n        <div id=\"collapseTwo\" class=\"panel-collapse collapse in\" role=\"tabpanel\" aria-labelledby=\"headingTwo\">\r\n          <div class=\"panel-body\">\r\n            <p>Data on this dashboard can be viewed and downloaded from Maryland’s <a href=\"https://data.maryland.gov\">Open Data Portal</a>.</p>\r\n            <p>View a video User Guide on <a href=\"https://www.youtube.com/watch?v=UjX0k85u9gQ\">YouTube</a>.</p>\r\n            <p>Use the map filter list in the lower left-hand corner of the map to specify the type of geography to compare and to specify whether individual projects should be displayed on the map. Similar geographies can be compared by selecting one or more from the map. Deselect a region by single clicking it on the map or clear all selections using the Reset Map button.</p>\r\n            <p>Individual projects are displayed by default as numbered points on the map. These points are clustered at different zoom levels so as you zoom in on the map, the points disaggregate until a single point is visible or the points break out into their respective technologies. Click an individual project point to view a popup list of statistics relevant to that specific project.</p>\r\n            <p>Use the \"Project Filters\" buttons to further refine the charts.</p>\r\n            <p>The data display can be manipulated by selecting the chart or table icon in the upper right-hand side of each graph.</p>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div class=\"logos\">\r\n        <a href=\"https://energy.maryland.gov\"><img src=\"img/mea_small.png\" alt=\"\"></a>\r\n        <a href=\"https://doit.maryland.gov/Pages/default.aspx\"><img src=\"img/doit_small.png\" alt=\"\"></a>\r\n        <a href=\"https://www.esrgc.org\"><img src=\"img/esrgc_logo.png\" alt=\"\"></a>\r\n        <a href=\"https://www.salisbury.edu\"><img src=\"img/SU logo.png\" alt=\"\"></a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n<div class=\"charts\">\r\n  <div class=\"tab-info\"><a href=\"https://data.maryland.gov/dataset/Renewable-Energy-Geocoded/mqt3-eu4s\">View and Download Raw Data</a></div>\r\n  <div class=\"row\"></div>\r\n</div>";
  },"useData":true});

templates["efficiency-popup"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<a href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)))
    + "</a>";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)));
  },"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Project Name:</b> "
    + escapeExpression(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"project_name","hash":{},"data":data}) : helper)))
    + "</li>";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Total Project Cost:</b> "
    + escapeExpression(((helper = (helper = helpers.total_project_cost || (depth0 != null ? depth0.total_project_cost : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"total_project_cost","hash":{},"data":data}) : helper)))
    + "</li>";
},"9":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Investment Leverage:</b> "
    + escapeExpression(((helper = (helper = helpers.investment_leverage || (depth0 != null ? depth0.investment_leverage : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"investment_leverage","hash":{},"data":data}) : helper)))
    + "</li>";
},"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Notes:</b> "
    + escapeExpression(((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"notes","hash":{},"data":data}) : helper)))
    + "</li>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"map-project\" style=\"background: "
    + escapeExpression(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"color","hash":{},"data":data}) : helper)))
    + "\">\r\n  <ul class=\"list-unstyled\">\r\n    <li><b>Program Name:</b> \r\n      ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.link : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    </li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.project_name : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    <li><b>Sector:</b> "
    + escapeExpression(((helper = (helper = helpers.sector || (depth0 != null ? depth0.sector : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"sector","hash":{},"data":data}) : helper)))
    + "</li>\r\n    <li><b>MEA Contribution:</b> "
    + escapeExpression(((helper = (helper = helpers.mea_award || (depth0 != null ? depth0.mea_award : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"mea_award","hash":{},"data":data}) : helper)))
    + "</li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.total_project_cost : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.investment_leverage : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    <li><b>Electricity Savings:</b> "
    + escapeExpression(((helper = (helper = helpers.electricity_savings_kwh || (depth0 != null ? depth0.electricity_savings_kwh : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"electricity_savings_kwh","hash":{},"data":data}) : helper)))
    + " kWh</li>\r\n    <li><b>CO2 Emissions Reductions:</b> "
    + escapeExpression(((helper = (helper = helpers.co2_emissions_reductions_tons || (depth0 != null ? depth0.co2_emissions_reductions_tons : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"co2_emissions_reductions_tons","hash":{},"data":data}) : helper)))
    + " tons</li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.notes : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n  </ul>\r\n</div>";
},"useData":true});

templates["filter-label"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<button type=\"button\" class=\"btn btn-default btn-sm\">"
    + escapeExpression(((helper = (helper = helpers.display || (depth0 != null ? depth0.display : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"display","hash":{},"data":data}) : helper)))
    + "</button>";
},"useData":true});

templates["filter-menu"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"col-sm-6 block\">\r\n  <div class=\"chart\">\r\n";
  stack1 = this.invokePartial(partials.title, '    ', 'title', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    <div class=\"chart-inner\">\r\n    <div class=\"row\">\r\n\r\n    </div>\r\n      <div class=\"filters container-fluid\">\r\n        <div class=\"row\">\r\n          <div class=\"col-md-12\">\r\n            <div class=\"description\">\r\n              <p></p>\r\n              <button type=\"button\" class=\"btn btn-default btn-xs reset\">Reset Map</button>\r\n            </div>\r\n          </div>\r\n          <div class=\"filter-box technology col-md-6\">\r\n            <div class=\"filter-title\">Technology</div>\r\n            <div class=\"the-filters\"></div>\r\n          </div>\r\n          <div class=\"filter-box vehicle_technology col-md-6\">\r\n            <div class=\"filter-title\"><div class=\"projects-icon vehicle_technology\"></div> Vehicle Technology</div>\r\n            <div class=\"the-filters\"></div>\r\n          </div>\r\n          <div class=\"filter-box charging_fueling_station_technology col-md-6\">\r\n            <div class=\"filter-title\"><div class=\"projects-icon charging_fueling_station_technology\"></div> Charging/Fueling Station Technology</div>\r\n            <div class=\"the-filters\"></div>\r\n          </div>\r\n          <div class=\"filter-box sector col-md-6\">\r\n            <div class=\"filter-title\">Sector</div>\r\n            <div class=\"the-filters\"></div>\r\n          </div>\r\n          <div class=\"filter-box program col-md-6\">\r\n            <div class=\"filter-title\">Program</div>\r\n            <div class=\"the-filters\"></div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>";
},"usePartial":true,"useData":true});

templates["layers"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"layerToggle leaflet-control\">\r\n  <p data-dynamite-selected=\"true\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "<i class=\"fa fa-check\"></i></p>\r\n</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", helperMissing=helpers.helperMissing, blockHelperMissing=helpers.blockHelperMissing;
  stack1 = ((helper = (helper = helpers.layers || (depth0 != null ? depth0.layers : depth0)) != null ? helper : helperMissing),(options={"name":"layers","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.layers) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});

templates["map"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"col-sm-6 block\">\r\n  <div class=\"map\"></div>\r\n</div>";
  },"useData":true});

templates["project-type"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<button type=\"button\" class=\"btn btn-default btn-sm\">"
    + escapeExpression(((helper = (helper = helpers.display || (depth0 != null ? depth0.display : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"display","hash":{},"data":data}) : helper)))
    + "</button>";
},"useData":true});

templates["renewable-popup"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<a href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)))
    + "</a>";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)));
  },"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Project Name:</b> "
    + escapeExpression(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"project_name","hash":{},"data":data}) : helper)))
    + "</li>";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Total Project Cost:</b> "
    + escapeExpression(((helper = (helper = helpers.total_project_cost || (depth0 != null ? depth0.total_project_cost : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"total_project_cost","hash":{},"data":data}) : helper)))
    + "</li>";
},"9":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Investment Leverage:</b> "
    + escapeExpression(((helper = (helper = helpers.investment_leverage || (depth0 != null ? depth0.investment_leverage : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"investment_leverage","hash":{},"data":data}) : helper)))
    + "</li>";
},"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Notes:</b> "
    + escapeExpression(((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"notes","hash":{},"data":data}) : helper)))
    + "</li>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"map-project\" style=\"background: "
    + escapeExpression(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"color","hash":{},"data":data}) : helper)))
    + "\">\r\n  <ul class=\"list-unstyled\">\r\n    <li><b>Technology:</b> "
    + escapeExpression(((helper = (helper = helpers.technology || (depth0 != null ? depth0.technology : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"technology","hash":{},"data":data}) : helper)))
    + "</li>\r\n    <li><b>Program Name:</b> \r\n      ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.link : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    </li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.project_name : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    <li><b>MEA Contribution:</b> "
    + escapeExpression(((helper = (helper = helpers.mea_award || (depth0 != null ? depth0.mea_award : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"mea_award","hash":{},"data":data}) : helper)))
    + "</li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.total_project_cost : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.investment_leverage : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    <li><b>Capacity:</b> "
    + escapeExpression(((helper = (helper = helpers.capacity || (depth0 != null ? depth0.capacity : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"capacity","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.capacity_units || (depth0 != null ? depth0.capacity_units : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"capacity_units","hash":{},"data":data}) : helper)))
    + "</li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.notes : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n  </ul>\r\n</div>";
},"useData":true});

templates["stat"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\""
    + escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"width","hash":{},"data":data}) : helper)))
    + " block\">\r\n  <div class=\"chart\">\r\n";
  stack1 = this.invokePartial(partials.title, '    ', 'title', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    <div class=\"chart-inner\">\r\n      <div class=\"loader\"><i class=\"fa fa-circle-o-notch fa-spin\"></i></div>\r\n      <div class=\"the-chart\">\r\n        <div class=\"stat\"></div>\r\n        <div class=\"note\"><span class=\"efficiency-note\">* Investment Leverage for energy efficiency is low due to financing programs, for which investment leverage is not calculated.<br></span>* Residential and Agricultural projects are plotted at the center of their zip codes to ensure recipient privacy.</div>\r\n      </div>\r\n      <div class=\"nodata\">This combination of filters has no applicable projects.</div>\r\n    </div>\r\n  </div>\r\n</div>";
},"usePartial":true,"useData":true});

templates["table-empty"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\""
    + escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"width","hash":{},"data":data}) : helper)))
    + " block\">\r\n  <div class=\"chart\">\r\n";
  stack1 = this.invokePartial(partials.title, '    ', 'title', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    <div class=\"chart-inner\">\r\n      <table class=\"table table-condensed table-hover\">\r\n\r\n      </table>\r\n    </div>\r\n  </div>\r\n</div>";
},"usePartial":true,"useData":true});

templates["transportation-popup"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Charging Station Technology:</b> "
    + escapeExpression(((helper = (helper = helpers.charging_fueling_station_technology || (depth0 != null ? depth0.charging_fueling_station_technology : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"charging_fueling_station_technology","hash":{},"data":data}) : helper)))
    + "</li>";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Vehicle Technology:</b> "
    + escapeExpression(((helper = (helper = helpers.vehicle_technology || (depth0 != null ? depth0.vehicle_technology : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"vehicle_technology","hash":{},"data":data}) : helper)))
    + "</li>";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<a href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)))
    + "</a>";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)));
  },"9":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Project Name:</b> "
    + escapeExpression(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"project_name","hash":{},"data":data}) : helper)))
    + "</li>";
},"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Total Project Cost:</b> "
    + escapeExpression(((helper = (helper = helpers.total_project_cost || (depth0 != null ? depth0.total_project_cost : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"total_project_cost","hash":{},"data":data}) : helper)))
    + "</li>";
},"13":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Investment Leverage:</b> "
    + escapeExpression(((helper = (helper = helpers.investment_leverage || (depth0 != null ? depth0.investment_leverage : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"investment_leverage","hash":{},"data":data}) : helper)))
    + "</li>";
},"15":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Gallons of Gasoline Equivalent Avoided:</b> "
    + escapeExpression(((helper = (helper = helpers.gallons_of_gasoline_equivalent_avoided || (depth0 != null ? depth0.gallons_of_gasoline_equivalent_avoided : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"gallons_of_gasoline_equivalent_avoided","hash":{},"data":data}) : helper)))
    + "</li>";
},"17":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Notes:</b> "
    + escapeExpression(((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"notes","hash":{},"data":data}) : helper)))
    + "</li>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"map-project\" style=\"background: "
    + escapeExpression(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"color","hash":{},"data":data}) : helper)))
    + "\">\r\n  <ul class=\"list-unstyled\">\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.charging_fueling_station_technology : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.vehicle_technology : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    <li><b>Program Name:</b> \r\n      ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.link : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.program(7, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    </li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.project_name : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    <li><b>MEA Contribution:</b> "
    + escapeExpression(((helper = (helper = helpers.mea_award || (depth0 != null ? depth0.mea_award : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"mea_award","hash":{},"data":data}) : helper)))
    + "</li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.total_project_cost : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.investment_leverage : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.gallons_of_gasoline_equivalent_avoided : depth0), {"name":"if","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.notes : depth0), {"name":"if","hash":{},"fn":this.program(17, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n  </ul>\r\n</div>";
},"useData":true});

return templates;

};
define([
    'jquery',
    'underscore',
    'module',
    'views/Base',
    'views/monitoringconsole/splunk_health_check/utils',
    'uri/route',
    'splunk.util',
    'contrib/text!views/monitoringconsole/splunk_health_check/Results.html',
    'splunkjs/mvc/resultslinkview',
    'views/monitoringconsole/splunk_health_check/pcss/icon-style.pcss',
    'views/monitoringconsole/splunk_health_check/Results.pcss'
], function(
    $,
    _,
    module,
    BaseView,
    utils,
    route,
    splunkUtils,
    Template,
    ResultsLinkView,
    iconStyleCSS,
    css
) {
    return BaseView.extend({
        moduleId: module.id,
        template: Template,
        className: 'check-result',
        initialize: function() {
            BaseView.prototype.initialize.apply(this, arguments);
            this.children.resultsLinkView = new ResultsLinkView({
                manager: this.model.task.getSearchManagerId(),
                el: $('<div class="pull-right"/>')

            });
        },
        createDrilldown: function(app, drilldown, id) {
            var regexp = new RegExp('\\$([A-Za-z_]*)\\$', 'g');
            var match = regexp.exec(drilldown);
            drilldown = match ? drilldown.replace(match[0], id) : drilldown;
            var root = app.get('root');
            var locale = app.get('locale');
            var appName = app.get('app');
            if (drilldown.startsWith('/app/')) {
                return route.encodeRoot(root, locale) + drilldown;
            }
            return route.search(root, locale, appName, {
                data: {
                    q: drilldown
                }
            });
        },

        render: function() {
            var rawData = this.model.task.getResult().raw;
            // since the result is row-based (Array), we need to figure out the index of the severity level in order to
            // sort the rows by severity level
            var sevLvlIdx = utils.getSeverityLevelIndexFromRaw(rawData);
            var fields = rawData.fields;
            // most severe level first
            var rows = _.sortBy(rawData.rows, function(row) {
                return -row[sevLvlIdx];
            });
            var instanceCount = splunkUtils.sprintf(_('Results (%s)').t(), rows.length);
                
            // Determine the index of the field to swap in.
            var idIndex = '';
            var drilldown = this.model.task.getDrilldown() || '';
            if (drilldown) {
                var regexp = new RegExp('\\$([A-Za-z_]*)\\$', 'g');
                var match = regexp.exec(drilldown);
                // Default to status if there is no drilldown placeholder specified.
                idIndex = match ? utils.getIndexFromRaw(match[1], rawData) : utils.getIndexFromRaw('status', rawData);
            }

            this.$el.html(this.compiledTemplate({
                fields: fields,
                rows: rows,
                sevLvlIdx: sevLvlIdx,
                instanceCount: instanceCount,
                SEVERITY_LEVEL_ICON_CLASS_NAME: utils.SEVERITY_LEVEL_ICON_CLASS_NAME,
                renderMVField: utils.renderMVField,
                showExpand: this.options.showExpand,
                taskId: this.model.task.getID(),
                idIndex: idIndex,
                drilldown: drilldown,
                app: this.model.application,
                createDrilldown: this.createDrilldown
            }));

            this.$('.tooltip-link').tooltip();
            this.$('.check-result-header').append(this.children.resultsLinkView.render().$el);

            return this;
        }
    });
});

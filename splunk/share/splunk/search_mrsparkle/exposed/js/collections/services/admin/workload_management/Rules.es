/**
 *
 * Rules Collection for Workload Management
 */

import _ from 'underscore';
import Model from 'models/services/admin/workload_management/Rule';
import SplunkDsBaseCollection from 'collections/SplunkDsBase';

export default SplunkDsBaseCollection.extend({
    url: 'workloads/rules',
    model: Model,

    initialize(...args) {
        this.model = this.model || {};
        SplunkDsBaseCollection.prototype.initialize.apply(this, args);
    },

    fetch(options = {}) {
        const extendedOptions = Object.assign(options, {});
        extendedOptions.data = Object.assign(options.data || {}, {
            count: -1,
        });

        return SplunkDsBaseCollection.prototype.fetch.call(this, options);
    },

    prepareRules() {
        if (this.length <= 0) {
            return [];
        }
        // sort by order # asc
        return this.sortBy((model) => {
            const condition = parseInt(model.entry.content.get('order'), 10);
            return condition;
        });
    },

    updateRule(ruleModel, data) {
        const model = _.isEmpty(ruleModel) ? new Model() : ruleModel;
        model.entry.content.clear();
        model.entry.content.set(data);

        return model.save();
    },

    deleteRule(model) {
        return model.destroy();
    },
});

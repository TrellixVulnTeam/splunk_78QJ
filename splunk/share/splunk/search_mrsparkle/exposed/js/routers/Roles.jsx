import React from 'react';
import $ from 'jquery';
import { render } from 'react-dom';
import BaseRouter from 'routers/Base';
import querystring from 'querystring';
import { createRESTURL } from '@splunk/splunk-utils/url';
import { defaultFetchInit, handleResponse, handleError } from '@splunk/splunk-utils/fetch';
import { _ } from '@splunk/ui-utils/i18n';
import { getReactUITheme, ThemeProvider } from 'util/theme_utils';
import RolesManager from 'views/roles/Roles';
import { ROLES_COLLECTION_PATH, CAPABILITIES_COLLECTION_PATH } from 'views/roles/Utils';

class RolesRouter extends BaseRouter {
    initialize(...args) {
        BaseRouter.prototype.initialize.call(this, ...args);
        this.enableAppBar = false;
        this.fetchAppLocals = true;
        this.setPageTitle(_('Roles'));
    }

    /**
     * Call Delete role REST endpoint
     * @param url - REST endpoint url
     * @returns Promise
     */
    callDeleteRole = url => (
            fetch(url, {
                ...defaultFetchInit,
                method: 'DELETE',
            })
            .then(handleResponse(200))
            .catch(handleError(_('Unable to delete role.'))));

    /**
     * Call Create role REST endpoint
     * @param data - POST body JSON
     * @returns Promise
     */
    callCreateRole = data => (
        fetch(createRESTURL(ROLES_COLLECTION_PATH), {
            ...defaultFetchInit,
            method: 'POST',
            body: querystring.encode(data),
        })
        .then(handleResponse(201))
        .catch(handleError(_('Unable to create role.'))));

    /**
     * Call Edit role REST endpoint
     * @param {String} name - name of the role to edit.
     * @param {object} data - POST body JSON
     * @returns Promise
     */
    callEditRole = (name, data) => (
        fetch(createRESTURL(`${ROLES_COLLECTION_PATH}/${encodeURIComponent(name)}`), {
            ...defaultFetchInit,
            method: 'POST',
            body: querystring.encode(data),
        })
        .then(handleResponse(200))
        .catch(handleError(_('Unable to edit role.'))));

    /**
     * Fetch the static list of capabilities.
     * @param {String} url - REST endpoint url.
     * @returns Promise
     */
    fetchAllCapabilities = url => (
        fetch(url, {
            ...defaultFetchInit,
            method: 'GET',
        })
        .then(handleResponse(200))
        .catch(handleError(_('Unable to fetch capabilities.'))));

    /**
     * Fetch all the roles
     * @param {String} url - REST endpoint url.
     * @returns Promise
     */
    fetchAllRoles = url => (
        fetch(url, {
            ...defaultFetchInit,
            method: 'GET',
        })
        .then(handleResponse(200))
        .catch(handleError(_('Unable to fetch roles.'))));

    page(...args) {
        BaseRouter.prototype.page.call(this, ...args);
        $.when(this.deferreds.pageViewRendered, this.deferreds.appLocals).done(() => {
            $('.preload').replaceWith(this.pageView.el);
            const props = {
                objectsCollectionPath: ROLES_COLLECTION_PATH,
                capabilitiesListPath: CAPABILITIES_COLLECTION_PATH,
                apps: this.collection.appLocalsUnfiltered.models,
                callDeleteRole: this.callDeleteRole,
                callCreateRole: this.callCreateRole,
                callEditRole: this.callEditRole,
                fetchAllCapabilities: this.fetchAllCapabilities,
                fetchAllRoles: this.fetchAllRoles,
            };
            render(
                <ThemeProvider theme={getReactUITheme()}>
                    <RolesManager {...props} />
                </ThemeProvider>,
                $('.main-section-body')[0]);
        });
    }
}

export default RolesRouter;

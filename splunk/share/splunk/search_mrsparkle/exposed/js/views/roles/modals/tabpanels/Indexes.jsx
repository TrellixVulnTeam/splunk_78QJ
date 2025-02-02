import React from 'react';
import PropTypes from 'prop-types';
import Table from '@splunk/react-ui/Table';
import P from '@splunk/react-ui/Paragraph';
import Text from '@splunk/react-ui/Text';
import Switch from '@splunk/react-ui/Switch';
import Menu from '@splunk/react-ui/Menu';
import Tooltip from '@splunk/react-ui/Tooltip';
import { _ } from '@splunk/ui-utils/i18n';

const Indexes = props => (
    <div>
        <P data-test-name="index-table-help-text">
            {_('Enable both the "Included" and "Default" checkboxes for an index to make that index ' +
            'searchable by default for this role.')}
        </P>
        <Table
            data-test-name="default-index-table"
            stripeRows
        >
            <Table.Head>
                <Table.HeadCell data-test-name="index-table-name">
                    {_('Index Name')}
                    <Text
                        inline
                        style={{ marginLeft: '10px' }}
                        placeholder="filter"
                        name="name"
                        onChange={(e, data) => props.handleIndexFiltering(data)}
                        canClear
                    />
                </Table.HeadCell>
                <Table.HeadCell data-test-name="index-table-included">
                    {_('Included')}
                    <Tooltip
                        style={{ marginLeft: '5px' }}
                        content={_('Restrict searches by this role to the specified index(es). ' +
                         'Search results for this role only show events from these index(es).')}
                    />
                </Table.HeadCell>
                <Table.HeadCell data-test-name="index-table-default">
                    {_('Default')}
                    <Tooltip
                        style={{ marginLeft: '5px' }}
                        content={_('Set the default index(es) that searches use when no index is' +
                         ' specified. Users with this role can search other indexes with the ' +
                          '"index=" keyword (for example, "index=my_index").')}
                    />
                </Table.HeadCell>
                <Table.HeadDropdownCell data-test-name="indexes-table-menu">
                    <Menu>
                        <Menu.Item
                            selectable
                            data-test-name="indexes-table-menu-item"
                            selected={props.menuSelected === 'selected'}
                            onClick={() => props.handleIndexFiltering({ name: 'selected' })}
                        >
                            {_('Show selected')}
                        </Menu.Item>
                        <Menu.Item
                            selectable
                            data-test-name="indexes-table-menu-item"
                            selected={props.menuSelected === 'unselected'}
                            onClick={() => props.handleIndexFiltering({ name: 'unselected' })}
                        >
                            {_('Show unselected')}
                        </Menu.Item>
                        <Menu.Item
                            selectable
                            data-test-name="indexes-table-menu-item"
                            selected={props.menuSelected === 'inherited'}
                            onClick={() => props.handleIndexFiltering({ name: 'inherited' })}
                        >
                            {_('Show inherited')}
                        </Menu.Item>
                        <Menu.Item
                            selectable
                            data-test-name="indexes-table-menu-item"
                            selected={props.menuSelected === 'uninherited'}
                            onClick={() => props.handleIndexFiltering({ name: 'uninherited' })}
                        >
                            {_('Show native')}
                        </Menu.Item>
                        <Menu.Item
                            selectable
                            data-test-name="indexes-table-menu-item"
                            selected={props.menuSelected === 'all'}
                            onClick={() => props.handleIndexFiltering({ name: 'all' })}
                        >
                            {_('Show all')}
                        </Menu.Item>
                    </Menu>
                </Table.HeadDropdownCell>
            </Table.Head>
            <Table.Body data-test-name="index-table-body">
                {props.indexes.map(row => (
                    row.filtered &&
                    <Table.Row
                        key={row.name}
                        data={row}
                        data-test-name="index-table-row"
                    >
                        <Table.Cell
                            key={row.name}
                            data-test-name="index-table-name-cell"
                        >
                            {row.label ? row.label : row.name}
                        </Table.Cell>
                        <Table.Cell data-test-name="index-table-allowed-cell">
                            <Tooltip
                                data-test-name="allowed-index-tooltip"
                                content={row.imported_srchAllowed ? _('This index is inherited') : ''}
                            >
                                <Switch
                                    key={`${row.name}-default`}
                                    disabled={row.imported_srchAllowed}
                                    value={{ name: row.name, type: 'srchAllowed' }}
                                    selected={row.srchAllowed || row.imported_srchAllowed}
                                    appearance="checkbox"
                                    onClick={props.handleIndexesToggle}
                                />
                            </Tooltip>
                        </Table.Cell>
                        <Table.Cell data-test-name="index-table-default-cell">
                            <Tooltip
                                data-test-name="default-index-tooltip"
                                content={row.imported_srchDefault ? _('This index is inherited') : ''}
                            >
                                <Switch
                                    key={`${row.name}-included`}
                                    disabled={row.imported_srchDefault}
                                    selected={row.srchDefault || row.imported_srchDefault}
                                    value={{ name: row.name, type: 'srchDefault' }}
                                    appearance="checkbox"
                                    onClick={props.handleIndexesToggle}
                                />
                            </Tooltip>
                        </Table.Cell>
                        <Table.Cell />
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    </div>
);

Indexes.propTypes = {
    indexes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    handleIndexesToggle: PropTypes.func.isRequired,
    handleIndexFiltering: PropTypes.func.isRequired,
    menuSelected: PropTypes.string.isRequired,
};

export default Indexes;
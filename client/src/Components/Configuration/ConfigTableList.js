import React from 'react';
import { Link } from 'react-router-dom';
import encryption from '../Cryptojs/Encryption';

const ConfigTableList = (props) => {
    let sNo = props.startIndex + 1;
    return (
        <table className="table table-centered w-100 dt-responsive nowrap table-striped table-bordered" id="products-datatable">
            <thead className="table-light">
                <tr>
                    <th>S.No</th>
                    <th>Key</th>
                    <th>Value</th>
                    <th style={{width: 85}}>Action</th>
                </tr>
            </thead>
            <tbody>
            {Object.keys(props.configData).length > 0 ? (Object.entries(props.configData).map(([key, value]) => {
                return (
                    <tr key={key}>
                        <td>{sNo++}</td>
                        <td>{value[0]}</td>
                        <td>{value[1]}</td>
                        <td className="table-action">
                            <Link onClick={props.handleEditViewClick} config-data={encryption(JSON.stringify(value))} className="action-icon"> <i className="mdi mdi-square-edit-outline" config-data={encryption(JSON.stringify(value))}></i></Link>
                        </td>
                    </tr>
                );
            })) : (
                <tr key="0"><td className="text-center" colSpan="4">No records founds...</td></tr>
            )}
            </tbody>
        </table>
    )
}

export default ConfigTableList
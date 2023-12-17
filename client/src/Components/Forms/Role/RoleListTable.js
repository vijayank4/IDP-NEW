import React from 'react'
import { Link } from 'react-router-dom';
import encryption from '../../Cryptojs/Encryption';

const RoleListTable = (props) => {
  return (
    <table className="table table-centered w-100 dt-responsive nowrap table-striped table-bordered" id="products-datatable">
        <thead className="table-light">
            <tr>
                <th>S.No</th>
                <th>Role Name</th>
                <th>Display Name</th>
                <th>Description</th>
                <th>Free Role</th>
                <th style={{width: 85}}>Action</th>
            </tr>
        </thead>
        <tbody>
        {props.roleData.length > 0 ? (props.roleData.map((item, index) => {
            return (
                <tr key={index}>
                    <td>{item.run_id}</td>
                    <td>{item.role_name}</td>
                    <td>{item.display_name}</td>
                    <td>{item.role_description}</td>
                    <td>{item.free_role === 1 ? 'Yes' : 'No'}</td>
                    <td className="table-action">
                        <Link onClick={props.handleEditViewClick} roledata={encryption(JSON.stringify(item))} className="action-icon"> <i className="mdi mdi-square-edit-outline" roledata={encryption(JSON.stringify(item))}></i></Link>
                    </td>
                </tr>
            );
        })) : (
            <tr key="0"><td className="text-center" colSpan="6">No records founds...</td></tr>
        )}
        </tbody>
    </table>
  )
}

export default RoleListTable
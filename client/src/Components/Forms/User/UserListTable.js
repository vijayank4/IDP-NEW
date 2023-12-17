import React from 'react'
import { Link } from 'react-router-dom';
import encryption from '../../Cryptojs/Encryption';

const UserListTable = (props) => {
  return (
    <table className="table table-centered w-100 dt-responsive nowrap table-striped table-bordered" id="products-datatable">
        <thead className="table-light">
            <tr>
                <th>S.No</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>User Id</th>
                <th>Location</th>
                <th>Role</th>
                <th style={{width: 85}}>Action</th>
            </tr>
        </thead>
        <tbody>
        {props.userData.length > 0 ? (props.userData.map((item, index) => {
            return (
                <tr key={index}>
                    <td>{item.run_id}</td>
                    <td>{item.first_name}</td>
                    <td>{item.last_name}</td>
                    <td>{item.user_id}</td>
                    <td>{item.location_name}</td>
                    <td>{item.role_name}</td>
                    <td className="table-action">
                        <Link onClick={props.handleEditViewClick} userdata={encryption(JSON.stringify(item))} className="action-icon"> <i className="mdi mdi-square-edit-outline" userdata={encryption(JSON.stringify(item))}></i></Link>
                        <Link onClick={props.handleDeleteClick} userid={item.login_id} className="action-icon"> <i className="mdi mdi-delete" userid={item.login_id}></i></Link>
                    </td>
                </tr>
            );
        })) : (
            <tr key="0"><td className="text-center" colSpan="7">No records founds...</td></tr>
        )}
        </tbody>
    </table>
  )
}

export default UserListTable
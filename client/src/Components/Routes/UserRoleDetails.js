import { useEffect, useState } from 'react';
import axios from 'axios';
import encryption from '../Cryptojs/Encryption';
import decryption from '../Cryptojs/Decryption';
import GetCookies from '../Session/GetCookies';
import { useDispatch } from 'react-redux';
import { addMenuObject } from '../Redux/MenuObject';
import { addRouterObject } from '../Redux/RouterObject';
import { addUserObject } from '../Redux/UserObject';
import toastr from 'toastr';

const UserRoleDetails = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try 
      {
          const response = await axios.get(global.config.PUBLIC_URL+'/api/get_config');
          const jsonData = JSON.parse(decryption(response.data));
          global.updateConfig(jsonData.data.config);
          if(GetCookies('access_user') !== undefined)
          {
            setLoading(true);
            const userdata = JSON.parse(decryption(GetCookies('access_user')));
            const postData = JSON.stringify({ role_id:userdata['role_id'], project_id:userdata['project_id'], login_id:userdata['login_id']});
            const encryptedData = encryption(postData);
            const apiUrl = global.config.PUBLIC_URL+'/api/get_user_role_details';
            axios.post(apiUrl, {encryptedData})
              .then(response => {
                setLoading(false);
                const data = JSON.parse(decryption(response.data));
                dispatch(addMenuObject(data.result.menu_list));
                dispatch(addRouterObject(data.result.router_list));
                dispatch(addUserObject(data.result.user_list));
              })
              .catch(error => {
                setLoading(false);
                  toastr.error(error.message+'!', 'Error', {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true,
                    showMethod: 'slideDown',
                    hideMethod: 'slideUp',
                });
              });
          }
          else
          {
            setTimeout(() => {
              setLoading(false);
            }, 200); 
          }
      } catch (error) {
          toastr.error(error.message+'!', 'Error', {
              timeOut: 3000,
              progressBar: true,
              closeButton: true,
              showMethod: 'slideDown',
              hideMethod: 'slideUp',
          });
      }
    };
    fetchData();
  }, [dispatch]);
  return loading;
}

export default UserRoleDetails;
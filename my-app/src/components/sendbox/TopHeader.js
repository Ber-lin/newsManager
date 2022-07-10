/*
 * @Author: your name
 * @Date: 2022-02-28 08:27:58
 * @LastEditTime: 2022-03-06 19:58:47
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \HTMLd:\Desktop\news-system\my-app\src\components\sendbox\TopHeader.js
 */
import React, { useEffect } from 'react'
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,

} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {connect} from 'react-redux'
const { Header } = Layout;
function TopHeader(props) {
   
    const navigate = useNavigate()
    
    const changeCollapsed = () => {
        props.changeCollapsed()
    }
    const {role:{roleName},username}=JSON.parse(localStorage.getItem('token'))
    useEffect(() => {

        // axios.get('/rights')
    }, [])
    const menu = (
        <Menu>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    {roleName}
                </a>
            </Menu.Item>
            <Menu.Item onClick={() => {
                // localStorage.removeItem('token')
                navigate('/login')
             }} danger>退出</Menu.Item>
        </Menu>
    );
    return (
        <Header className="site-layout-background" style={{ padding: ' 0 16px' }}>
            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }
            <div style={{ float: 'right' }}>
                <span>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
const mapStateToProps=({CollapsedReducer:{isCollapsed}})=>{
    
    return {
        isCollapsed
    }
}
const mapDispatchToProps={
    changeCollapsed(){
        return {
            type:"change_collapsed"
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(TopHeader)
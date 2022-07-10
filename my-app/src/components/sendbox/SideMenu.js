/*
 * @Author: your name
 * @Date: 2022-02-28 08:27:43
 * @LastEditTime: 2022-03-06 15:47:08
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \HTMLd:\Desktop\news-system\my-app\src\components\sendbox\SideMenu.js
 */
import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import {
    UserOutlined,
    
} from '@ant-design/icons';
import axios from 'axios'
import { useLocation, useNavigate } from "react-router-dom";
import {connect} from 'react-redux'
const { Sider } = Layout;
const { SubMenu } = Menu

const iconList = {
    "/home": <UserOutlined />,
    "/user-manage": <UserOutlined />,
    "/user-manage/list": <UserOutlined />,
    "/right-manage": <UserOutlined />,
    "/right-manage/role/list": <UserOutlined />,
    "/right-manage/right/list": <UserOutlined />

}
function SideMenu(props) {
    const location=useLocation()
    const [menu, setMenu] = useState([])
    useEffect(() => {//查出所有侧边栏部分 例如：一级用户管理 --二级添加用户、删除用户...
        axios.get('/rights?_embed=children').then(res => {
            setMenu(res.data)
        })
    }, [])
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))

    const checkPagePermisson = (item) => {
        return item.pagepermisson === 1&&rights.includes(item.key)//检查能否展示当前项，还有当前角色权限中是否包含这一项
    }
    const renderMenu = (menuList) => {

        return menuList.map(item => {//item.children?.length>0代表先要判断是否有children属性，有再去判断长度
            if (item.children?.length > 0 && checkPagePermisson(item)) {   //这里的checkPahePermission()对应json中的pagepermission字段，返回布尔值，判断是否要渲染
                
                return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                    {
                        renderMenu(item.children)
                    }
                </SubMenu>
            }
            // console.log(item.key)
            return checkPagePermisson(item) && <Menu.Item key={iconList[item.key]} icon={item.icon} onClick={() => {
                navigate(item.key)
            }}>{item.title}</Menu.Item>//如果checkPahePermission()返回的是假，那么两种菜单都不渲染，就达到了权限管理的目的
        })
    }
    const navigate = useNavigate()
    // console.log(location.pathname)
    const selectKeys=[location.pathname]
    // console.log(selectKeys)
    const openKeys = ["/"+location.pathname.split("/")[1]]
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="logo" style={{ color: 'white', fontSize: '20px', textAlign: 'center' }}>全球新闻发布系统</div>
                <div style={{flex:1,overflow:'auto'}}>
                    {/* 这个defaultSelectedKeys中的路径就是每次刷新完默认高亮的 */}
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={selectKeys} defaultOpenKeys={openKeys}>
                        {
                            renderMenu(menu)
                        }
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}
const mapStateToProps=({CollapsedReducer:{isCollapsed}})=>{
    
    return {
        isCollapsed
    }
}

export default connect(mapStateToProps)(SideMenu)

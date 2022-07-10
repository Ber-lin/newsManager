import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from '../views/login/Login'
import Home from '../views/sendbox/home/Home'
import NewsAdd from '../views/sendbox/news-manage/NewsAdd'
import NewsCategory from '../views/sendbox/news-manage/NewsCategory'
import NewsUpdate from '../views/sendbox/news-manage/NewsUpdate'
import NewsDraft from '../views/sendbox/news-manage/NewsDraft'
import NewsSendBox from '../views/sendbox/NewsSendBox'
import NoPermission from '../views/sendbox/no-permission/NoPermission'
import Published from '../views/sendbox/publish-manage/Published'
import Sunset from '../views/sendbox/publish-manage/Sunset'
import Unpublished from '../views/sendbox/publish-manage/Unpublished'
import RightList from '../views/sendbox/right-manage/RightList'
import RoleList from '../views/sendbox/right-manage/RoleList'
import UserList from '../views/sendbox/user-manage/UserList'
import Audit from '../views/sendbox/audit-manage/Audit'
import AuditList from '../views/sendbox/audit-manage/AuditList'
import axios from 'axios'
import NewsPreview from '../views/sendbox/news-manage/NewsPreview'
import { Spin } from 'antd'
import News from '../views/news/News'
import Detail from '../views/news/Detail'

const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/category": <NewsCategory />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />
}
export default function IndexRouter() {
    const [BackRouteList, setBackRouteList] = useState([])
    let right = {
        role: {
            "id": 1,
            "roleName": "超级管理员",
            "roleType": 1,
            "rights": [
                "/user-manage/add",
                "/user-manage/delete",
                "/user-manage/update",
                "/user-manage/list",
                "/right-manage",
                "/right-manage/role/list",
                "/right-manage/right/list",
                "/right-manage/role/update",
                "/right-manage/role/delete",
                "/right-manage/right/update",
                "/right-manage/right/delete",
                "/news-manage",
                "/news-manage/list",
                "/news-manage/add",
                "/news-manage/update/:id",
                "/news-manage/preview/:id",
                "/news-manage/draft",
                "/news-manage/category",
                "/audit-manage",
                "/audit-manage/audit",
                "/audit-manage/list",
                "/publish-manage",
                "/publish-manage/unpublished",
                "/publish-manage/published",
                "/publish-manage/sunset",
                "/user-manage",
                "/home"
            ]
        }
    }
    const { role: { rights } } = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : right
    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
        ]).then(res => {
            // console.log(res)
            setBackRouteList([...res[0].data, ...res[1].data])
            // console.log(BackRouteList)

        })
    }, [])
    const checkRoute = (item) => {//判断是否关闭或删除部分权限，有的路由字段变成了routepermisson
        return (item.pagepermisson || item.routepermisson) && LocalRouterMap[item.key]
    }
    const checkUserPermisson = (item) => {//判断当前登录角色是否有权限
        return rights.includes(item.key)
    }
    return (
        <BrowserRouter>
            {/* <Spin size='large'> */}
            <Routes>

                <Route path='/login' element={<Login />} />
                <Route path='/' exact element={localStorage.getItem('token') ? <NewsSendBox /> : <Navigate to='/login' /> /*这里如果有登录就正常显示，没有就重定向登录*/} >

                    {
                        BackRouteList.map(item => {
                            if (checkRoute(item) && checkUserPermisson(item)) {
                                return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} />
                            } else {
                                return null
                            }

                        })
                    }

                    <Route path='*' element={<NoPermission />} />
                </Route>
                <Route path='/news' element={<News></News>}></Route>
                <Route path='/detail/:id' element={<Detail />}></Route>

            </Routes>
            {/* </Spin> */}
        </BrowserRouter>
    )
}

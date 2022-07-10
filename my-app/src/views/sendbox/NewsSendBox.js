import React, { useEffect } from 'react'
import SideMenu from '../../components/sendbox/SideMenu'
import TopHeader from '../../components/sendbox/TopHeader'
import './NewsSendBox.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Layout, Spin } from 'antd';
import {connect} from 'react-redux'
import { useLocation, Outlet} from 'react-router-dom';
const {  Content } = Layout;
 function NewsSendBox(props) {
   const location=useLocation()
  NProgress.start()//进度条显示开始
 
  useEffect(()=>{
    NProgress.done()
    
  },[location.pathname])//每次切换路由对象，都会触发
  useEffect(()=>{
    NProgress.done()
  })
 
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Spin size='large' spinning={props.isLoading}>
        <Content
        className="site-layout-background"
        style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          overflow:'auto'
        }}>
          
        <Outlet></Outlet>
        </Content>
        </Spin>
      </Layout>
      
      {/* <Button type="primary">Button</Button> */}


      
    </Layout>
  )
}
const mapStateToProps=({LoadingReducer:{isLoading}})=>({
   isLoading
})
export default connect(mapStateToProps)(NewsSendBox)
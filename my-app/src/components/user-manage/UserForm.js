import React, { forwardRef, Fragment, useEffect, useState } from 'react'
import {Form, Select, Input} from 'antd'
const {Option}=Select
 const UserForm=forwardRef((props,ref)=> {
    var {regionList,roleList}=props
    const [isDisabled,setIsDisabled]=useState(false)
    useEffect(()=>{
        setIsDisabled(props.isUpdateDisabled)
    },[props.isUpdateDisabled])
    const {roleId,region}=JSON.parse(localStorage.getItem('token'))
    const checkRegionDisabled=(item)=>{//设置不同角色添加或修改用户的地区权限
        // console.log(item)
        if(props.isUpdate){//是更新操作
            if(roleId===1){//超级管理员不禁用可以使用所有的区域
                return false
            }else{//非超全部禁用
                return true
            }
        }else{//添加阶段
            if(roleId===1){
                return false
            }else{//非超 创建只能使用同地区
                return item.value!==region
            }
        }
    }
    const checkRoleDisabled=(item)=>{//设置不同角色添加或修改用户的角色权限
        if(props.isUpdate){//是更新操作
            if(roleId===1){//超级管理员不禁用可以使用所有的角色
                return false
            }else{//非超全部禁用
                return true
            }
        }else{//添加阶段
            if(roleId===1){
                return false
            }else{//非超 创建只能给编辑，id!==3，前两个管理员都是true，代表禁用，只有编辑是false
                return item.id!==3
            }
        }
    }
    return (
        <Fragment>
            <Form
                ref={ref}
                layout="vertical"
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: '请输入密码!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="region"
                    label="区域"
                    rules={isDisabled?[]:[{ required: true, message: '请输入区域!' }]}
                >
                    <Select disabled={isDisabled}>
                        {
                            regionList.map(item => {
                                return <Option value={item.value}
                                disabled={checkRegionDisabled(item)}>{item.title}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name="roleId"
                    label="角色"
                    rules={[{ required: true, message: '请选择角色!' }]}
                >
                    <Select onChange={value=>{
                        if(value===1){//禁用区域选择，并且清空当前选择
                            setIsDisabled(true)
                            ref.current.setFieldsValue({
                                region:''
                            })
                        }else{
                            setIsDisabled(false)
                        }
                        
                    }}>
                        {
                            roleList.map(item => {
                                return <Option key={item.id} value={item.id}
                                disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Form>
        </Fragment>
    )
})
export default UserForm
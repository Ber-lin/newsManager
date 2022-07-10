import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Button, Table, Modal, Switch } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'
const { confirm } = Modal
export default function UserList() {
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const [current, setCurrent] = useState(null)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)//控制更新表单中的地区是否禁用
  const [dataSource, setDataSource] = useState([])
  const [isAddVisible, setIsAddVisible] = useState(false)//小表单是否可见
  const [roleList, setRoleList] = useState([])//暂存表单中的角色信息集
  const [regionList, setRegionList] = useState([])//暂存表单中的区域信息集
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)//控制整个更新表单的显示和隐藏
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get('/users?_expand=role').then(res => {
      //第一项的children虽然没有内容，但还是给了空数组，所以手动操作一下
      const list = res.data

      setDataSource(roleId === 1 ? list : [
        ...list.filter(item => item.username === username),//能看到自己
        ...list.filter(item => item.region === region && item.roleId === 3)
      ])
    })
  }, [roleId, region, username])
  useEffect(() => {
    axios.get('/regions').then(res => {
      //第一项的children虽然没有内容，但还是给了空数组，所以手动操作一下
      const list = res.data

      setRegionList(list)
    })
  }, [])
  useEffect(() => {
    axios.get('/roles').then(res => {
      //第一项的children虽然没有内容，但还是给了空数组，所以手动操作一下
      const list = res.data

      setRoleList(list)
    })
  }, [])
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: '全球',
          value: '全球'
        }
      ],
      onFilter: (value, item) => {
        if (value === '全球') {
          return item.region === ''
        }
        return item.region === value
      },
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {//这里由于前面axios请求拼接了role“表”，可以访问role对象中的roleName
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',

    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {//这个地方依据roleState控制开关的状态
        return <Switch checked={roleState}
          disabled={item.default}
          onChange={() => handleChange(item)}></Switch>    //item也是代表整个对象，default为true代表禁用
      }
    },
    {
      title: '操作',
      render: (item) => {//如果没写dataIndex，render接受的参数代表整个对象
        // console.log(item)
        return <Fragment>
          <Button danger shape='circle'
            icon={<DeleteOutlined />}
            onClick={() => confirmTab(item)}
            disabled={item.default}></Button>

          <Button shape='circle' type='primary'
            icon={<EditOutlined />}
            disabled={item.default}
            onClick={() => handleUpdate(item)} ></Button>

        </Fragment>

      }
    }
  ];
  const confirmTab = (item) => {//点击删除按钮的确认框
    confirm({
      title: '确定删除吗？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }
  const handleChange = (item) => {//处理开关
    item.roleState = !item.roleState
    setDataSource([...dataSource])//提交状态
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  const handleUpdate = (item) => {//这个函数只负责表单的显示隐藏控制
    setTimeout(() => {//加个延时器，让代码同步触发
      setIsUpdateVisible(true)
      if (item.roleId === 1) {
        //禁用
        setIsUpdateDisabled(true)
      } else {
        // 取消禁用
        setIsUpdateDisabled(false)

      }
      updateForm.current.setFieldsValue(item)//把表单原有的内容填充上
    }, 0)
    setCurrent(item)
  }
  const addFormOk = () => {
    addForm.current.validateFields().then(res => {
      setIsAddVisible(false)
      addForm.current.resetFields()
      // 为了删除和更新使用的id能正常生成，我们先提交后端，自动生成之后再设置到state
      axios.post('/users', {
        ...res,//表单内容
        "roleState": true,
        "default": false,
      }).then(value => {//value代表整合之后的对象
        // console.log(value.data)
        // console.log(roleList.filter(item => item.id === res.roleId)[0])
        setDataSource([...dataSource, {
          ...value.data,//给他加上role属性，然后加入dataSource
          role: roleList.filter(item => item.id === res.roleId)[0]
        }])
      })
    }).catch(err => {
      console.log(err)
    })
  }
  const updateFormOk = () => {
    updateForm.current.validateFields().then(value => {//value是你更新框输入的内容，validateFields是触发表单验证的函数

      setDataSource(dataSource.map(item => {
        // console.log(item.id === current.id)
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: roleList.filter(data => data.id === value.roleId)[0]

          }
        }
        return item
      }))
      axios.patch(`/users/${current.id}`, value)
    })
  }
  return (//Modal以下是antd的弹出层中的新建表单，冗长的表单部分封装了一个组件
    <Fragment>
      <Button type='primary' onClick={() => {

        setIsAddVisible(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={item => item.id} />

      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsAddVisible(false)
        }}
        onOk={addFormOk}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>
      <Modal
        visible={isUpdateVisible}
        title="更新用户信息"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateVisible(false)//关闭更新框
          setIsUpdateDisabled(!isUpdateDisabled)//强行改变一下状态，更新模态框内状态
        }}
        onOk={() => {
          updateFormOk()
          setIsUpdateVisible(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
      >
        <UserForm regionList={regionList}
          roleList={roleList}
          ref={updateForm}
          isUpdateDisabled={isUpdateDisabled}
          isUpdate={true}></UserForm>
      </Modal>
    </Fragment>
  )
}

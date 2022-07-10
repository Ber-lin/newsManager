import { Button, Table, Modal, Tree } from 'antd'
import axios from 'axios'
import React, { useState, useEffect, Fragment } from 'react'
import { DeleteOutlined, ExclamationCircleOutlined, UnorderedListOutlined } from '@ant-design/icons'
const { confirm } = Modal
export default function RoleList() {
  const [dataSource, setDataSource] = useState([])//获取全部
  const [isModalVisible, setIsModalVisible] = useState(false)//布尔值控制呼出框是否可见
  const [rightList, setRightList] = useState([])//拿到所有权限相关的数据存入
  const [currentRight, setCurrentRight] = useState([])//暂存当前角色的权限列表
  const [currentId, setCurrentId] = useState(0)//暂存勾选项的id

  useEffect(() => {
    axios.get('/roles').then(res => {
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      setRightList(res.data)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {//如果没写dataIndex，render接受的参数代表整个对象
        // console.log(item)
        return <Fragment>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmTab(item)}></Button>

          <Button shape='circle' type='primary' icon={<UnorderedListOutlined />}
            onClick={() => {
              setIsModalVisible(true)
              setCurrentRight(item.rights)//把当前选中item代表的角色的权限设置上
              setCurrentId(item.id)//保存当前选中这个角色的id
            }} >
          </Button>

        </Fragment>

      }
    }
  ]
  const confirmTab = (item) => {//点击删除按钮的确认框
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
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
    axios.delete(`/roles/${item.id}`)
  }
  const handleOk = () => {//点击ok的目的是更新最新权限集
    setIsModalVisible(false)
    //同步dataSource（dataSource里边的每个角色都有right属性）
    setDataSource(dataSource.map(item=>{    
      if(item.id===currentId){
        return {
          ...item,
          rights:currentRight
        }
      }
      return item //如果不是呗修改的那个就还是使用之前的
    }))
    axios.patch(`/roles/${currentId}`,{
      rights:currentRight
    })
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const onCheck=(checkedKeys)=>{//
    // console.log(checkedKeys)
    setCurrentRight(checkedKeys.checked)
  }
  return (
    <div>
      <Table dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}></Table>
      <Modal title="权限分配" visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys={currentRight}
          treeData={rightList}
          checkStrictly//默认为false，设置true之后会取消父子级之间的关联，可以保证如果子级没有某一项权限，即使全选了父级，也不会选中那一项
          onCheck={onCheck}//这个监听配合上面的checkedKeys构成了完整的受控组件，页面变化反应到这个监听的方法中，只能通过这个监听及其方法修改状态从而修改视图
        />
      </Modal>
    </div>
  )
}

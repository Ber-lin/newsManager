import React, { Fragment, useEffect, useState } from 'react'
import { Button, Table, Tag, Modal, Popover ,Switch} from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal
export default function RightList() {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      //第一项的children虽然没有内容，但还是给了空数组，所以手动操作一下
      const list = res.data
      list.map((item) => {
        if (item.children?.length === 0) {
          item.children = ''
        }
      })
      setDataSource(list)
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
      title: '权限名称',
      dataIndex: 'title',

    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="magenta">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {//如果没写dataIndex，render接受的参数代表整个对象
        // console.log(item)
        return <Fragment>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmTab(item)}></Button>
          <Popover content={<Switch checked={item.pagepermisson} onChange={()=>{switchMethod(item)}} />} title='配置项' 
          trigger={item.pagepermisson===undefined?'':'click'}>
            <Button shape='circle' type='primary' icon={<EditOutlined />}  disabled={item.pagepermisson===undefined}></Button>
          </Popover>
        </Fragment>
      }
    }
  ]
  const confirmTab = (item) => {//点击删除按钮的确认框
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const switchMethod=(item)=>{//开关操作
    item.pagepermisson=item.pagepermisson===1?0:1
    //  console.log(item)
    setDataSource([...dataSource])
    // 
    if(item.grade===1){//一级权限去rights中修改
      axios.patch(`/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }else{//二级权限去children中找
      axios.patch(`/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
  }
  const deleteMethod = (item) => {
    if (item.grade === 1) {
      setDataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/rights/${item.id}`)
    } else {
      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id) //item是要删除的那一项
      setDataSource([...dataSource])
      axios.delete(`/children/${item.id}`)
    }

  }
  return (
    <Fragment>
      <Table dataSource={dataSource} rowKey={item=>item.id} columns={columns} pagination={{ pageSize: 5 }} />;
    </Fragment>
  )
}

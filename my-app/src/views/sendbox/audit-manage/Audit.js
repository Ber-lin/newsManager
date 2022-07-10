import { Button, Table } from 'antd'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Audit() {
  const [dataSource,setDataSource]=useState([])
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(()=>{
    axios.get(`/news?auditState=1&_expand=category`).then(res=>{
      const list = res.data

      setDataSource(roleId === 1 ? list : [
        ...list.filter(item => item.author === username),//能看到自己
        ...list.filter(item => item.region === region && item.roleId === 3)//同一区域的编辑
      ])
    })
  },[roleId, region, username])
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',

    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
    }
    },
    {
      title: '操作',
      render: (item) => {//如果没写dataIndex，render接受的参数代表整个对象
        return <Fragment>
          <Button type='primary' onClick={()=>handlePass(item)}>通过</Button>
          <Button danger onClick={()=>handleRefuse(item)}>驳回</Button>
        </Fragment>

      }
    }
  ];
  const handlePass=(item)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      auditState:2,
      publishState:1
    }).then(()=>{
      // navigate('/audit-manage/list')
    })
  }
  const handleRefuse=(item)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      auditState:3
    }).then(()=>{
      // navigate('/audit-manage/list')
    })
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={item => item.id} />
    </div>
  )
}

import { Button, notification, Table, Tag } from 'antd'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuditList() {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  const navigate = useNavigate()
  useEffect(() => {//作者是username的，审核状态不是0的（0是草稿箱），发布状态<=1的（2是已发布，3是已下线）
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [])
  const auditList = ['草稿箱', '审核中', '已通过', '未通过']
  const auditColor = ['black', 'orange', 'green', 'red']

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
      title: '审核状态',
      render: (item) => {
        return <Tag color={auditColor[item.auditState]}>{auditList[item.auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {//如果没写dataIndex，render接受的参数代表整个对象
        return <Fragment>
          {
            item.auditState === 1 && <Button danger onClick={() => handleRervert(item)}>撤销</Button>
          }
          {
            item.auditState === 2 && <Button onClick={() => handlePublish(item)}>发布</Button>
          }
          {
            item.auditState === 3 && <Button type='primary' onClick={() => handleUpdate(item)}>更新</Button>
          }
        </Fragment>

      }
    }
  ];
  const handleRervert = (item) => {//处理撤销到草稿箱的函数
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(() => {
      // navigate('/news-manage/draft')
      notification.info({
        message: `通知`,
        description:
          `您可以到草稿箱中查看您的新闻`,
        placement: 'bottomRight',
      })
    })
  }
  const handleUpdate = (item) => {
    navigate(`/news-manage/update/${item.id}`)
    notification.info({
      message: `通知`,
      description:
        `您可以在此修改您的新闻`,
      placement: 'bottomRight',
    })
  }
  const handlePublish = (item) => {
    axios.patch(`/news/${item.id}`, {
      "publishState": 2,
      "publishTime":Date.now()
    }).then(() => {
      navigate('publish-manage/published')
      notification.info({
        message: `通知`,
        description:
          `您可以在【发布管理/已发布】查看您的新闻`,
        placement: 'bottomRight',
      })
    })
  }
  return (
    <div>
      <Table dataSource={dataSource} rowKey={item => item.id} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}

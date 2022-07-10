/*
 * @Author: your name
 * @Date: 2022-03-02 20:14:27
 * @LastEditTime: 2022-03-06 18:44:57
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \HTMLd:\Desktop\news-system\my-app\src\views\sendbox\news-manage\NewsDraft.js
 */
import React, { Fragment, useEffect, useState } from 'react'
import { Button, Table, Modal, notification } from 'antd'
import axios from 'axios'
import { DeleteOutlined, ToTopOutlined,EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
const { confirm } = Modal
export default function NewsDraft() {
  const navigate=useNavigate()
  const [dataSource, setDataSource] = useState([])
  const {username} = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      //第一项的children虽然没有内容，但还是给了空数组，所以手动操作一下
      const list = res.data
      setDataSource(list)
    })
  }, [username])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render:(title,item)=>{
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
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {//如果没写dataIndex，render接受的参数代表整个对象
        // console.log(item)
        return <Fragment>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmTab(item)}></Button>
          <Button shape='circle' icon={<EditOutlined />}
          onClick={()=>{
            navigate(`/news-manage/update/${item.id}`)
          }} ></Button>
          <Button shape='circle' type='primary' icon={<ToTopOutlined />}
          onClick={()=>handleCheck(item.id)} ></Button>
        </Fragment>

      }
    }
  ];
  const handleCheck=(id)=>{
    axios.patch(`/news/${id}`,{
      auditState:1
    }).then(res => {//0跳草稿箱，1跳审核列表
      navigate('/audit-manage/list')

      notification.info({
        message: `通知`,
        description:
          `您可以到审核列表中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  const confirmTab = (item) => {//点击删除按钮的确认框
    confirm({
      title: '你确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
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
      axios.delete(`/news/${item.id}`)
  }
  return (
    <Fragment>
      <Table dataSource={dataSource} rowKey={item=>item.id} columns={columns} pagination={{ pageSize: 5 }} />;
    </Fragment>
  )
}

import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { Button, Table, Modal, Input } from 'antd'
import axios from 'axios'
import NewsForm from '../../../components/news-manage/NewsForm'
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons'
import Form from 'antd/lib/form/Form'
const { confirm } = Modal
export default function NewsCategory() {
  const updateForm = useRef(null)
  const addForm = useRef(null)
  const [current, setCurrent] = useState(null)
  // const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [isAddVisible, setIsAddVisible] = useState(false)//小表单是否可见
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)//控制整个更新表单的显示和隐藏
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get('/categories').then(res => {
      const list = res.data
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
      title: '栏目名称',
      dataIndex: 'title',
    },
    {
      title: "操作",
      render: (item) => {

        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmTab(item)} />
          <Button shape='circle' type='primary'
            icon={<EditOutlined />}
            disabled={item.default}
            onClick={() => handleUpdate(item)} ></Button>
        </div>
      }
    }
  ];
  const addFormOk = () => {
    addForm.current.validateFields().then(res => {
      setIsAddVisible(false)
      console.log(res)
      axios.post('categories',{
        title:res.category,
        value:res.category
      }).then(value=>{
        console.log(value.data)
        setDataSource(...dataSource,value.data)
      })
      
    }).catch(err => {
      console.log(err)
    })
  }
  const handleUpdate = (item) => {//这个函数只负责表单的显示隐藏控制
    //加个延时器，让代码同步触发
    console.log(item)
    setTimeout(() => {
      setIsUpdateVisible(true)
      // updateForm.current.setFieldsValue(item.title)//把表单原有的内容填充上
      updateForm.current.setFieldsValue(item.value)
    }, 0)


    // console.log(updateForm)


    setCurrent(item)
  }
  const confirmTab = (item) => {//点击删除按钮的确认框
    confirm({
      title: '你确定要删除吗?',
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
    axios.delete(`/categories/${item.id}`)
  }
  const updateFormOk = () => {
    updateForm.current.validateFields().then(value => {//value是你更新框输入的内容，validateFields是触发表单验证的函数

      setDataSource(dataSource.map(item => {
        // console.log(item.id ,current.id)
        if (item.id === current.id) {
          return {
            ...item,
            title: value.category,
          }
        }
        return item
      }))
      axios.patch(`/categories/${current.id}`, {
        title: value.category,
        value: value.category
      })
    })
  }


  return (
    <Fragment>
      <Button type='primary' onClick={() => {

        setIsAddVisible(true)
      }}>添加分类</Button>
      <Modal
        visible={isAddVisible}
        title="添加分类"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsAddVisible(false)
        }}
        onOk={addFormOk}
      >
        <NewsForm dataSource={dataSource}  ref={addForm}></NewsForm>
      </Modal>
      <Table dataSource={dataSource}
        rowKey={item => item.id}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        visible={isUpdateVisible}
        title="更新新闻分类"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateVisible(false)//关闭更新框
          // setIsUpdateDisabled(!isUpdateDisabled)//强行改变一下状态，更新模态框内状态
        }}
        onOk={() => {
          updateFormOk()
          setIsUpdateVisible(false)
          // setIsUpdateDisabled(!isUpdateDisabled)
        }}
      >
        <NewsForm
          dataSource={dataSource}
          ref={updateForm}
          // isUpdateDisabled={isUpdateDisabled}
          isUpdate={true}></NewsForm>
      </Modal>
    </Fragment>
  )
}

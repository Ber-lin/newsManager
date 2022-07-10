import style from './News.module.css'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor'
import { useNavigate, useParams } from 'react-router-dom';
const { Step } = Steps;
const { Option } = Select
export default function NewsUpdate() {
  const navigate = useNavigate()
  const NewsForm = useRef(null)
  const params = useParams()
  var [current, setCurrent] = useState(0)//当前是第几步
  const [categories, setCategories] = useState([])//保存新闻分类
  const [formInfor, setFormInfor] = useState({})//保存第一步表单内容
  const [content, setContent] = useState('')//保存第二步富文本编辑器的内容
  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategories(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
      // setNewsInfor(res.data)
      let { title, categoryId, content } = res.data
      console.log(categoryId)
      NewsForm.current.setFieldsValue({//设置到输入框中
        title,
        categoryId
      })
      setContent(content)
    })
  }, [params.id])
  const handlePre = () => {
    if (current === 0) {

    } else {

    }
    setCurrent(--current)
  }
  const handleNext = () => {
    if (current === 0) {//NewsForm.current拿到表单元素，validateFields方法校验
      NewsForm.current.validateFields().then(res => {
        setFormInfor(res)
        setCurrent(++current)
      }).catch(err => {
        console.log(err)
      })
    } else {//非表单步骤
      if (content === '' || content.trim() === '<p></p>') {//trim方法去掉首尾空格
        message.error('新闻内容不能为空')
      } else {
        setCurrent(++current)
      }


    }

  }
  // const User = JSON.parse(localStorage.getItem('token'))
  const handleSave = (auditState) => {
    axios.patch(`/news/${params.id}`, {
      ...formInfor,
      "content": content,
      "auditState": auditState,//审核状态,0--草稿箱，1--审核列表
    }).then(res => {//0跳草稿箱，1跳审核列表
      navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="更新新闻"
        onBack={() => window.history.back()}
      // subTitle="This is a subtitle"
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
      <div style={{ marginTop: '50px' }}>
        <div className={current === 0 ? '' : style.hidden}>
          <Form
            ref={NewsForm}
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Select>
                {
                  categories.map(item => {//这里渲染出所有的分类
                    return <Option value={item.id} key={item.id}>{item.title}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : style.hidden}>
          <NewsEditor
            getContent={(value) => {
              setContent(value)
            }}
            content={content}></NewsEditor>
        </div>
        <div className={current === 2 ? '' : style.hidden}></div>
      </div>

      <div style={{ marginTop: '50px' }}>
        {
          current > 0 && <Button onClick={handlePre}>上一步</Button>

        }
        {
          current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
        }
        {
          current === 2 && <span>
            <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
            <Button danger onClick={() => handleSave(1)}>提交审核</Button>
          </span>
        }
      </div>
    </div>
  )
}

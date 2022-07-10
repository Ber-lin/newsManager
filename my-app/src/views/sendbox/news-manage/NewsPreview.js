import React, { Fragment, useEffect, useState } from 'react'
import { PageHeader, Button, Descriptions } from 'antd';
import { useParams } from "react-router-dom";
import moment from 'moment'
import axios from 'axios';
export default function NewsPreview(props) {
  const params = useParams();
  const [newsInfor, setNewsInfor] = useState(null)
  useEffect(() => {
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
      setNewsInfor(res.data)
    })
  }, [params.id])
  const auditList = ['未审核', '审核中', '已通过', '未通过']
  const publishList = ['未发布', '待发布', '已上线', '已下线']
  const auditColor=['black','orange','green','red']

  return (
    <div>
      {
        newsInfor && <Fragment>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={newsInfor.title}
            subTitle={newsInfor.category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">{newsInfor.author}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{moment(newsInfor.createTime).format('YYYY-MM/DD HH:mm:ss')}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{newsInfor.publishTime ? moment(newsInfor.createTime).format('YYYY-MM/DD HH:mm:ss') : '--'}</Descriptions.Item>
              <Descriptions.Item label="区域">{newsInfor.region}</Descriptions.Item>
              <Descriptions.Item label="审核状态" ><span style={{ color: auditColor[newsInfor.auditState] }}>{auditList[newsInfor.auditState]}</span></Descriptions.Item>
              <Descriptions.Item label="发布状态" ><span style={{ color: auditColor[newsInfor.publishState] }}>{publishList[newsInfor.publishState]}</span></Descriptions.Item>
              <Descriptions.Item label="访问数量">{newsInfor.view}</Descriptions.Item>
              <Descriptions.Item label="点赞数量">{newsInfor.star}</Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>

            </Descriptions>
          </PageHeader>
          <div dangerouslySetInnerHTML={{
            __html:newsInfor.content//这是俩下划线==
          }} style={{
            border:'1px solid gray',
            padding:'0 24px',
            margin:'0 24px'
          }}>
          </div>
        </Fragment>
      }

    </div>
  )
}

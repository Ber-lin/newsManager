import React, { Fragment, useEffect, useState } from 'react'
import { PageHeader, Button, Descriptions } from 'antd';
import { useParams } from "react-router-dom";
import { HeartTwoTone, } from '@ant-design/icons';
import moment from 'moment'
import axios from 'axios';
export default function Detail(props) {
    const params = useParams();
    const [newsInfor, setNewsInfor] = useState(null)
    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
            setNewsInfor({
                ...res.data,
                view: res.data.view + 1
            })
            
            return res.data//把现有的数字发出去
        }).then(res=>{//这里拿到上文return的数字，+1存数据库
            axios.patch(`/news/${params.id}?_expand=category&_expand=role`,{
                view: res.view + 1
            })
        })
    }, [params.id])
    
    const handleStar=()=>{
        setNewsInfor({
            ...newsInfor,
            star: newsInfor.star + 1
        })
        axios.patch(`/news/${params.id}?_expand=category&_expand=role`,{
            star: newsInfor.star + 1
        })
    }
    return (
        <div>
            {
                newsInfor && <Fragment>
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title={newsInfor.title}
                        subTitle={
                            <div>
                                {newsInfor.category.title}
                                <HeartTwoTone twoToneColor="#eb2f96" onClick={()=>handleStar()}/>
                            </div>}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfor.author}</Descriptions.Item>

                            <Descriptions.Item label="发布时间">{newsInfor.publishTime ? moment(newsInfor.createTime).format('YYYY-MM/DD HH:mm:ss') : '--'}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfor.region}</Descriptions.Item>

                            <Descriptions.Item label="访问数量">{newsInfor.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfor.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>

                        </Descriptions>
                    </PageHeader>
                    <div dangerouslySetInnerHTML={{
                        __html: newsInfor.content//这是俩下划线==
                    }} style={{
                        border: '1px solid gray',
                        padding: '0 24px',
                        margin: '0 24px'
                    }}>
                    </div>
                </Fragment>
            }

        </div>
    )
}

import { Card, Col, List, PageHeader, Row } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import _ from 'lodash'
export default function News() {
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
            setDataSource(Object.entries(_.groupBy(res.data, item => item.category.title)))
        })
    }, [])
    return (
        <div style={{
            width: "95%",
            margin: '0 auto'
        }}>
            <PageHeader
                className="site-page-header"
                title="全球大新闻"
                subTitle="查看新闻"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {
                        dataSource.map(item => {
                            return <Col span={8} key={item[0]}>
                                <Card title={item[0]} hoverable={true} bordered={true}>
                                    <List
                                        size="small"
                                        pagination={{
                                            pageSize: 3
                                        }}
                                        dataSource={item[1]}
                                        renderItem={data => <List.Item><a href={`/detail/${data.id}`}>{data.title}</a></List.Item>}
                                    />
                                </Card>
                            </Col>
                        })
                    }

                </Row>
            </div>
        </div>
    )
}

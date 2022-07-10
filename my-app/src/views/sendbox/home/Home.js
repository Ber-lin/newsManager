import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Card, Col, List, Row, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, PieChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card;
export default function Home() {
  const [dataSource, setDataSource] = useState([])
  const [starSource, setStarSource] = useState([])
  const [allList, setAllList] = useState([])
  const [visible, setVisible] = useState(false)
  const [pieChart, setPieChart] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()

  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
      setDataSource(res.data)
      // console.log(res.data)
    })
    axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
      setStarSource(res.data)
      // console.log(res.data)
    })
    axios.get('/news?publishState=2&_expand=category').then(res => {
      renderBarView(_.groupBy(res.data, item => item.category.title))//拿回来的数据都是杂乱无章的，我们需要对其按照分类进行重构，整个大对象中按照分类，划分为一个个数组
      setAllList(res.data)
    })
    const renderBarView = (obj) => {
      var myChart = echarts.init(barRef.current);

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '新闻分类图示'
        },
        tooltip: {},
        legend: {
          data: ['数量']
        },
        xAxis: {
          data: Object.keys(obj),
          axisLabel: {
            rotate: '45',//旋转一下显示
            interval: 0//强制显示
          }
        },
        yAxis: {
          minInterval: 1
        },
        series: [{
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)//重构后数据的每个分类下数组长度就是文章数量
        }]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.onresize = () => {//柱状图页面大小适配
        myChart.resize()
      }
    }

    // 组件销毁要取消页面监听
    return () => {
      window.onresize = null
    }
  }, [])
  const renderPieView = (obj) => {
    // 处理数据，拿到本人写的新闻
    var currentList=allList.filter(item=>item.author===username)
    var groupObj=_.groupBy(currentList, item => item.category.title)
    

    var list=[]
    for(let i in groupObj){
      list.push({
        value:groupObj[i].length,//每个分类的篇数
        name:i//分类名
      })
    }
    console.log(list)
    var myChart 
    if(!pieChart){//防止重复定义
      myChart= echarts.init(pieRef.current);
      setPieChart(myChart)
    }else{
      myChart=pieChart
    }
    var option;

    option = {
      title: {
        text: '当前用户新闻分类图示',
        // subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    option && myChart.setOption(option);
  }
  return (
    <div style={{ height: '100%' }}>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="用户最常浏览" bordered={true}>
              <List
                size="small"
                // bordered
                dataSource={dataSource}
                renderItem={item => <List.Item><a href={`/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="点赞最多" bordered={true}>
              <List
                size="small"
                // bordered
                dataSource={starSource}
                renderItem={item => <List.Item><a href={`/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <PieChartOutlined key="setting" onClick={() => {
                  setTimeout(() => {
                    setVisible(true)
                    renderPieView()
                  }, 0)
                }} />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={username}
                description={
                  <div>
                    <b>{region === '' ? '全球' : region}</b>
                    <span style={{ paddingLeft: '40px' }}>{roleName}</span>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>
        <Drawer title="个人新闻分类" width='500px' placement="right" closable={true} onClose={() => { setVisible(false) }} visible={visible}>
          
          <div ref={pieRef}
            style={{ height: '400px', marginTop: '30px', width: '100%' }}>

          </div>
        </Drawer>
        <div ref={barRef}
          style={{ height: '400px', marginTop: '30px', width: '100%' }}>

        </div>
      </div>
    </div>
  )
}

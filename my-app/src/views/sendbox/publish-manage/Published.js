import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
import {Button} from 'antd'

export default function Published() {
    // 2=== 已发布的
    const {dataSource,handleSunset} = usePublish(2)

    return (//这里传入button属性为一个函数，去公共组件中执行
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={()=>handleSunset(id)}>
                下线
            </Button>}>

            </NewsPublish>
        </div>
    )
}

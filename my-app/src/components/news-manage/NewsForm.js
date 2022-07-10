/*
 * @Author: your name
 * @Date: 2022-03-04 14:48:55
 * @LastEditTime: 2022-03-06 18:42:52
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \HTMLd:\Desktop\news-system\my-app\src\components\news-manage\NewsForm.js
 */
import React, { forwardRef, Fragment, useEffect, useState } from 'react'
import {Form, Input} from 'antd'

 const NewsForm=forwardRef((props,ref)=> {
    var {datSource}=props
    return (
        <Fragment>
            <Form
                ref={ref}
                layout="vertical"
            >
                <Form.Item
                    name="category"
                    label="新闻分类"
                    rules={[{ required: true, message: '请输入分类!' }]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Fragment>
    )
})
export default NewsForm
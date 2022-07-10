/*
 * @Author: your name
 * @Date: 2022-03-03 11:52:34
 * @LastEditTime: 2022-03-06 17:33:43
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \HTMLd:\Desktop\news-system\my-app\src\components\news-manage\NewsEditor.js
 */
import { convertToRaw, ContentState, EditorState } from 'draft-js';
import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
export default function NewsEditor(props) {
  const [editorState, setEditorState] = useState('')
  useEffect(()=>{
    // 将父组件传递的content，也就是html解构转换为draft格式
    const html = props.content
    if(html===undefined)return//useEffect第一次装载的时候触发了下面的代码，而此时html还未发过来，是undefined，需要过滤一下
    const contentBlock = htmlToDraft(html)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState)//给组件设置好状态，他就会显示在文本框中，这就是受控组件的好处
    }
  },[props.content])
  return ( 
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(editorState) => setEditorState(editorState)}
        onBlur={() => {
          props.getContent(
            draftToHtml(convertToRaw(editorState.getCurrentContent()))
          )
        }}
      />
    </div>
  )
}

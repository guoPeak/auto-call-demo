import React, { useState, useRef, useEffect } from 'react';
import { Select, Checkbox, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';


const ExtraSetting: React.FC = ({ onChange, isIntercept, recall, repeatCount }) => {

  const [curInterecpt, setCurInterecpt] = useState(isIntercept)
  const [curRecall, setCurRecall] = useState(recall)
  const [curRepeatCount, setCurRepeatCount] = useState(repeatCount)

  const handleChecked = (e, key) => {

    console.log('handleChecked   =>',e, key);

    const val = e.target.checked ? 1 : 0
    let innerCount = curRepeatCount
    if (key == 'isIntercept') {
      setCurInterecpt(val)
    } else {
      setCurRecall(val)
      if (!val) {
        setCurRepeatCount(0)
        innerCount = 0
      } else {
        setCurRepeatCount(1)
        innerCount = 1
      }
    }

    const data = {
      isIntercept: curInterecpt,
      recall: curRecall,
      repeatCount: innerCount,
      [key]: val
    }

    console.log('handleChecked  =>', data);
    
    onChange(data)
  }

  const handleChange = (val) => {
    console.log('handleChange  =>', val);
    setCurRepeatCount(val)
    onChange({
      isIntercept: curInterecpt,
      recall: curRecall,
      repeatCount: val
    })
  }

  return (<div style={{marginTop: '5px'}}>
      <div style={{marginBottom: '10px'}}>
          <Checkbox onChange={(val) => handleChecked(val, 'isIntercept')} checked={!!curInterecpt}>允许用户打断</Checkbox>
      </div>
      <div>
        <Checkbox onChange={(val) => handleChecked(val, 'recall')} checked={!!curRecall}>节点重复</Checkbox>
        <Tooltip title="开启节点重复后，当客户回答没有命中回答分支和知识库的时候，会先重复当前节点的话术录音（多话术则播放下一段），重复次数超过设置的次数值后按原有逻辑处理。">
            <QuestionCircleOutlined style={{marginRight: '16px'}} />
        </Tooltip>
        <Select
          style={{width: '100px'}}
          disabled={!curRecall}
          value={curRepeatCount}
          onChange={(val) => handleChange(val)}
          options={[
            {
              value: 1,
              label: '1次',
            },
            {
              value: 2,
              label: '2次',
            },
            {
              value: 3,
              label: '3次',
            },
          ]}
        />
      </div>

    </div>)
}

export default ExtraSetting;
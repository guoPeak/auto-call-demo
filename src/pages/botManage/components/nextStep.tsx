import React, { useState, useRef, useEffect } from 'react';
import { Select, Checkbox, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';


const NextStep: React.FC = ({ onChange, allTalk, data }) => {

  const [currentNextType, setNextType] = useState('next')
  const [nextTalk, setNextTalk] = useState()


  useEffect(() => {
    const { nextAction, nextTaskId } = data
    setNextType(nextAction)
    if (nextAction === 'assign') {
      setNextTalk(nextTaskId || allTalk[0].id)
    }
  }, [data])

  const handleSelect = (val) => {
    setNextType(val)
    if (val !== 'assign') {
      onChange({
        type: val,
        value: null
      })
    }
  }

  const handleNextSelect = (val) => {
    onChange({
      type: 'assign',
      value: val
    })
  }



  return (<>
      <Select defaultValue={currentNextType} onChange={handleSelect}>
          <Select.Option value="hangup">挂机</Select.Option>
          <Select.Option value="next">下一步主动流程</Select.Option>
          <Select.Option value="assign">指定主动流程</Select.Option>
      </Select>
      {currentNextType === 'assign' && <Select onChange={handleNextSelect} value={nextTalk} style={{marginTop: 16}} options={allTalk.map(item => ({label: item.name, value: item.id}))}/>}
  </>)
}

export default NextStep;
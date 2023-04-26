import React, { useState, useRef, useEffect } from 'react';
import { Button, Drawer, Form, Input, Switch, Tag, Space, Select, Checkbox, Row } from 'antd';

const BranchInput: React.FC = ({ onChange, branches }: any) => {
  const [checkAll, setCheckAll] = useState<boolean>(false);
  // const [curBranchs, setBranchs] = useState<any[]>([])

  const innerChange = (e) => {
    setCheckAll(e);
    const newBranchs = branches?.map((item) => ({ ...item, checked: true }));
    onChange(newBranchs);
  };

  // useEffect(() => {
  //     setBranchs(branches)
  // }, [])

  const onCheck = (e: any, curBranch: any) => {
    console.log('onCheck', e, curBranch, branches);
    const newBranchs = branches?.map((item) => {
      if (item.id === curBranch.id) {
        return {
          ...item,
          checked: e.target.checked,
        };
      } else {
        return { ...item };
      }
    });
    onChange(newBranchs);
  };

  //     {!checkAll ? <Checkbox.Group options={branches}>
  //     {/* {branches.map(item => <Checkbox key={item.id} checked>{item.name}</Checkbox>)} */}
  // </Checkbox.Group> : null}
  return (
    <>
      <Switch
        checked={checkAll}
        style={!checkAll ? { marginTop: '6px' } : {}}
        checkedChildren="全部"
        unCheckedChildren="全部"
        onChange={innerChange}
      />

      {!checkAll ? (
        <Space className="branchs-checkBox" wrap size={[16, 10]}>
          {branches?.map((item) => (
            <Checkbox key={item.id} onChange={(e) => onCheck(e, item)} checked={item.checked}>
              {item.name}
            </Checkbox>
          ))}
        </Space>
      ) : null}
    </>
  );
};

export default BranchInput;

import React, { useState, useRef, useEffect } from 'react';
import { Button, Drawer, Form, Input, Switch, Tag, Space, Select, Checkbox, Row } from 'antd';

const BranchInput: React.FC = ({ onChange, branches }: any) => {
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [checkList, setChechList] = useState<any[]>([]);

  const innerChange = (e) => {
    setCheckAll(e);
    const newBranchs = branches?.map((item) => ({ ...item, checked: true }));
    onChange(newBranchs);
  };

  useEffect(() => {
    const list = branches.map((item) => item.checked);
    setChechList(list);
  }, [branches]);

  const onCheck = (e: any, curBranch: any, i) => {
    console.log('onCheck', e, curBranch, branches);
    const val = e.target.checked;
    const newBranchs = branches?.map((item) => {
      if (item.id === curBranch.id) {
        return {
          ...item,
          checked: val,
        };
      } else {
        return { ...item };
      }
    });
    checkList[i] = val;
    console.log('newBranchs======,', newBranchs);
    setChechList(checkList);
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
          {branches?.map((item, i) => (
            <Checkbox key={item.id} onChange={(e) => onCheck(e, item, i)} checked={checkList[i]}>
              {item.name}
            </Checkbox>
          ))}
        </Space>
      ) : null}
    </>
  );
};

export default BranchInput;

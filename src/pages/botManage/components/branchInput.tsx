import React, { useState, useRef, useEffect } from 'react';
import { Button, Drawer, Form, Input, Switch, Tag, Space, message, Checkbox, Modal } from 'antd';
import { EditOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';


const BranchInput: React.FC = ({ onChange, branches }: any) => {
    // const [checkAll, setCheckAll] = useState<boolean>(false);
    const [checkList, setChechList] = useState<any[]>(branches);
    const [currentBranch, setCurrentBranch] = useState<any>()
    const [keywords, setKeywords] = useState<string[]>([])
    const [isModalOpen, setModalOpen] = useState(false)

    const [submitForm] = Form.useForm();


    // const innerChange = (e) => {
    //     setCheckAll(e);
    //     const newBranchs = branchConfig?.map((item) => ({...item, name: item.name, id: item.id, checked: true }));
    //     onChange(newBranchs);
    // };

    // useEffect(() => {
    //     // const list: any[] = []
    //     // branchConfig.forEach((item, i) => {
    //     //     if (branches.find(item2 => item2.name === item.name)) {
    //     //         list[i] = true
    //     //     } else {
    //     //         list[i] = false
    //     //     }
    //     // })
    //     console.log('useEffect   =>', branches);
    //     setChechList(branches);
    // }, [branches]);

    const onCheck = (e: any, i: number) => {
        console.log('onCheck', e, branches, i);
        const val = e.target.checked;

        checkList[i].selected = val ? 1: 0
        
        console.log('onChange(checkList);', checkList);

        setChechList([...checkList])
        // checkList[i] = val;

        // const newBranchs = branchConfig?.map((item, index) => {
        //     return { ...item,  name: item.name, id: item.id, checked: checkList[index] };
        // });
        // checkList[i] = val;
        // console.log('newBranchs======,', newBranchs, checkList);
        // setChechList(checkList);
        onChange(checkList);
    };

    const handleEdit = (e: any, curBranch: any) => {
      console.log(e, curBranch);
      setCurrentBranch(curBranch)
      setModalOpen(true)
      setKeywords(curBranch.keywords && curBranch.keywords.split(',') || [])
      submitForm.setFieldsValue({
        name: curBranch.name,
        property: curBranch.name
      });
    }

    const handleOk = () => {
      checkList.forEach(item => {
        if (currentBranch.id === item.id) {
          item.keywords = keywords.join(',')
        }
      })
      onChange(checkList);
      setModalOpen(false)
    }

    const handleCancel = () => {
      setModalOpen(false)
    }

    const addKeywords = () => {
      let word = ''
      const inputChange = (event: any) => {
        console.log('inputChange ===>', event);
        word = event?.target?.value || ''
      }

      Modal.confirm({
        title: '请填写关键词',
        icon: null,
        content: <Input onChange={inputChange} />,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          return new Promise((reslove, reject)=> {
            if (word) {
              reslove(word)
              const newKeywords = [...keywords]
              newKeywords.push(word)
              setKeywords(newKeywords)
            } else {
              reject()
              message.error('请填写关键词');
            }
          })
        },
      });
    }

    const deleteKeywords = (index: number) => {
      console.log('deleteKeywords  ===>', keywords, index);
      const newKeywords = [...keywords]
      newKeywords.splice(index, 1)
      setKeywords(newKeywords)
    }

    //     {!checkAll ? <Checkbox.Group options={branches}>
    //     {/* {branches.map(item => <Checkbox key={item.id} checked>{item.name}</Checkbox>)} */}
    // </Checkbox.Group> : null}
    return (
        <div style={{marginTop: '-5px'}}>
            {/* <Switch
                checked={checkAll}
                style={!checkAll ? { marginTop: '6px' } : {}}
                checkedChildren="全部"
                unCheckedChildren="全部"
                onChange={innerChange}
            /> */}

            {/* {!checkAll ? ( */}
                <Space className="branchs-checkBox" wrap size={[16, 10]}>
                    {checkList?.map((item, i) => (
                      <div key={item.id} style={{marginRight: '10px'}}>
                        <Checkbox onChange={(e) => onCheck(e, i)} checked={!!item.selected}>
                            {item.name}
                        </Checkbox>
                        <EditOutlined
                          onClick={(e) => handleEdit(e, item)}
                        />
                    </div>
                    ))}
                </Space>
            {/* ) : null} */}

        <Modal
            title={`编辑${currentBranch?.name || ''}分支`}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={submitForm} labelCol={{ span: 4 }}>
              <Form.Item
                label="分支名称" name="name"
                rules={[{ required: true }]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item label="分支属性" name="property" rules={[{ required: true }]}>
                  <Input disabled />
              </Form.Item>
              <Form.Item label="关键词" name="keywords">
                <div>
                  <Tag
                      onClick={addKeywords}
                      style={{ background: '#fff', borderStyle: 'dashed', cursor: 'pointer', verticalAlign: 'middle' }}
                  >
                      <PlusOutlined style={{marginRight: '5px'}} />
                      添加关键词
                  </Tag>
                  {keywords.map((item: string, index: number) => {
                    return <Tag style={{marginBottom: '10px'}} key={index}>{item} <CloseOutlined style={{marginLeft: '6px', cursor: 'pointer'}} onClick={() => deleteKeywords(index)} /></Tag>
                  })}
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </div>
    );
};

export default BranchInput;

import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Input, Form, Row, Col, Select, Table, Space } from 'antd';
import { AudioOutlined, UploadOutlined, DeleteOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { RECORD_METHOD } from '@/config/dict';
import { useRecorder } from "voice-recorder-react";
// import RecorderUI from "./RecorderUI";
import RecorderHooks from "./RecorderHook";
import './index.less'


const Record: React.FC = () => {

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setModalOpen] = useState(false)
  const [hasRecording, setHasRecording] = useState(false);

  const {
    time,
    data,
    stop,
    start,
    pause,
    paused,
    resume,
    reset,
    recording
  } = useRecorder();


  const audioRef = useRef<HTMLAudioElement>(null);

  const startRecord = (record: any) => {
    setModalOpen(true)
  }

  const playVolice = (record: any) => {

  }

  const download = (record: any) => {
    
  }

  const dataSource = [
    {
      id: 1,
      name: '普通节点',
      talk: '开始的话了',
      status: '待审核',
      record: '未录音'
    }
  ]

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: '节点名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '话术内容',
      dataIndex: 'talk',
      key: 'talk',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '真人录音',
      dataIndex: 'record',
      key: 'record',
    },
    {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      render: (txt, record: any) => {
        return  <>
          <Button onClick={() => startRecord(record)} type='link'>录音</Button>
          <Button onClick={() => playVolice(record)} type='link'>播放</Button>
          <Button onClick={() => download(record)} type='link'>下载</Button>
        </>
      }
    }
  ];

  const submitApproval = () => {

  }

  useEffect(() => {
    console.log('audioRef.current ==> ',audioRef.current, data);
    if (data.url && audioRef.current) {
      audioRef.current.src = data.url;
    }
  }, [data.url]);

  const handleRecording = () => {
    if (recording) {
      stop();
      setHasRecording(false);
    } else {
      start();
      setHasRecording(true);
    }
  }

  const togglePlay = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  };

  

  return <div className='record-containner'>
    <div className='title'>录音设置</div>
    <Form layout="inline" className='record-form'>
      <Form.Item label="录音方式">
          <Select style={{width: 200}} options={RECORD_METHOD} defaultValue={1} />
      </Form.Item>
    </Form>

    <Row justify={'end'} style={{marginBottom: 20}}><Button disabled={selectedRowKeys.length <= 0} onClick={submitApproval} type='primary'>提交审核</Button></Row>
    <Table dataSource={dataSource} columns={columns} rowSelection={rowSelection} rowKey={'id'} />


    <Modal
        title="话术录音"
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setModalOpen(false);
          reset()
        }}
        getContainer={false}
      >
        <Row align={'middle'}>
          <PlayCircleOutlined className='record-icon' />
          <Input style={{flex: 1, marginRight: 20}} />
          <Space>
            <UploadOutlined className='record-icon' />
            <div onClick={handleRecording}>{ hasRecording? <PauseCircleOutlined className='record-icon stop' /> :  <AudioOutlined className='record-icon' />}</div>
            <DeleteOutlined className='record-icon' />
          </Space>
        </Row>

        <Row align={'middle'} justify={'center'} style={{marginTop: 20}}>
          {recording && <span>{time.h}:{time.m}:{time.s}</span>}

          {!recording && data.url && (
            <Button type="primary" onClick={togglePlay}>
              播放录音
            </Button>
          )}
        </Row>
        

      <audio ref={audioRef} hidden />
        
      </Modal>
  </div>
}

export default Record
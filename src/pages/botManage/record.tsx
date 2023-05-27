import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Input, Form, Row, Col, Select, Table, Space, message, Upload } from 'antd';
import { AudioOutlined, ExclamationCircleOutlined, UploadOutlined, DeleteOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { RECORD_METHOD } from '@/config/dict';
import { useRecorder } from "voice-recorder-react";
import { getAllTaskByBotId, batchUpdateTask } from '@/services/record';
import { uploadFile, downloadFile } from '@/services/file';
import './index.less'


const Record: React.FC = (props) => {

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setModalOpen] = useState(false)
  const [hasRecording, setHasRecording] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([])
  const [currentRecord, setCurrentRecord] = useState<any>({})

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
    setCurrentRecord(record)
    setTimeout(() => {
      console.log('startRecord ===>', record.voiceUrlFull, audioRef.current);

      if (record.voiceUrlFull && audioRef.current) {
        audioRef.current.src = record.voiceUrlFull;
      }
    });
    setModalOpen(true)
  }

  const playVolice = (record: any) => {
    setTimeout(() => {
      console.log('playVolice ===>', record.voiceUrlFull, audioRef.current);
      if (record.voiceUrlFull && audioRef.current) {
        audioRef.current.src = record.voiceUrlFull;
      }
      if (audioRef.current?.paused) {
        audioRef.current?.play();
      } else {
        audioRef.current?.pause();
      }
    });

    
  }

  const download = (record: any) => {
    console.log('downloadFile ====>', record.voiceUrlFull);
    const filePath = record.voiceUrlFull.split('filePath=')[1]
    const link = document.createElement('a');
    link.href = record.voiceUrlFull;
    link.download = 'audio.mp3';
    document.body.appendChild(link);
    link.click();
    // downloadFile({
    //   filePath,
    // }).then(audioStream => {
    //   console.log(audioStream);
    //   // 创建Blob对象
    //   const blob = new Blob([audioStream]);
      
    //   // 创建可下载的URL
    //   const audioUrl = URL.createObjectURL(blob);
      
    //   // 创建链接元素
    //   const link = document.createElement('a');
    //   link.href = audioUrl;
    //   link.download = 'audio.mp3';
      
    //   // 添加链接元素到文档并触发下载
    //   document.body.appendChild(link);
    //   link.click();
      
    //   // 清理资源
    //   URL.revokeObjectURL(audioUrl);
      

    // })
  }

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
      width: 200
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
      width: 200
    },
    {
      title: '真人录音',
      dataIndex: 'record',
      key: 'record',
      width: 200
    },
    {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      width: 300,
      render: (txt, record: any) => {
        return  <>
          <Button onClick={() => startRecord(record)} type='link'>录音</Button>
          {record.voiceUrlFull && <Button onClick={() => playVolice(record)} type='link'>播放</Button>}
          { record.voiceUrlFull && <Button onClick={() => download(record)} type='link'>下载</Button>}
        </>
      }
    }
  ];

  const submitApproval = () => {

  }

  useEffect(() => {

    if (data.url && audioRef.current) {
      audioRef.current.src = data.url;
    }

    if (!dataSource.length) {
      getAllTaskByBotId({
        id: props.botData.id
      }).then(res => {
        setDataSource(res)
      })
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
    console.log('audioRef ====>', audioRef, data);
    if (audioRef.current?.paused) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  };

  const deleteRecord = () => {
    Modal.confirm({
      title: '删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除录音吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return reset()
      },
    });
  }

  const saveRecord = () => {
    const formdata = new FormData();
    formdata.append('file', data.blob, 'audio.mp3');
    console.log('saveRecord ====> ', formdata);
    uploadFile(formdata).then(res => {
      console.log('uploadFile ===>', res);
      const newDataSource = dataSource.map(item => {
        if (item.id === currentRecord.id) {
          return {
            ...item,
            voiceUrlFull: res,
          }
        }
        return {
          ...item
        }
      })
      setDataSource(newDataSource)
      const newCurrentRecord = {
        ...currentRecord,
        voiceUrlFull: res
      }
      setCurrentRecord(newCurrentRecord)
      batchUpdateTask({salesTalkTaskList: [newCurrentRecord]}).then((res) => {
        message.success('保存成功')
        setModalOpen(false);
        reset()
      })
    })
  }

  const handleUploadFile = (file: File) => {
    console.log('handleUploadFile ====>', file);
    // const formdata = new FormData();
    // formdata.append('file', file.file, 'audio.mp3');
  }


  return <div className='record-containner'>
    <div className='title'>录音设置</div>
    <Form layout="inline" className='record-form'>
      <Form.Item label="录音方式">
          <Select style={{width: 200}} options={RECORD_METHOD} defaultValue={1} />
      </Form.Item>
    </Form>

    <Row justify={'end'} style={{marginBottom: 20}}><Button disabled={selectedRowKeys.length <= 0} onClick={submitApproval} type='primary'>提交审核</Button></Row>
    <Table dataSource={dataSource} columns={columns} rowSelection={rowSelection} pagination={false} rowKey={'id'} />


    <Modal
        title="话术录音"
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setModalOpen(false);
          reset()
        }}
        getContainer={false}
        destroyOnClose={true}
      >
        <Row align={'middle'}>
          {/* <PlayCircleOutlined onClick={togglePlay} disabled={recording || currentRecord.voiceUrlFull} className='record-icon' /> */}
          <Button type="link" onClick={togglePlay} disabled={recording || (!data.url && !currentRecord.voiceUrlFull)} icon={<PlayCircleOutlined />}  />
          {/* <Input.TextArea rows={2} disabled style={{flex: 1, margin: '0 20px'}} value={currentRecord.talk} /> */}
          <div className='talk-content'>{currentRecord.talk}</div>
          <Space>
            {/* <UploadOutlined className='record-icon' /> */}
            <Upload
              showUploadList={false}
              maxCount={1}
              disabled={recording}
              accept='.wav,.mp3,.MP3'
              customRequest={handleUploadFile}
            >
              <Button type="link" disabled={recording} icon={<UploadOutlined />}  />
            </Upload>
            {/* <Button type="link" disabled={recording} icon={<UploadOutlined />}  /> */}
            {/* <div onClick={handleRecording}>{ hasRecording? <PauseCircleOutlined className='record-icon stop' /> :  <AudioOutlined className='record-icon' />}</div> */}
            <Button type="link" onClick={handleRecording} icon={hasRecording ? <PauseCircleOutlined style={{ color: 'red'}} /> : <AudioOutlined />} />

            <Button type="link" onClick={deleteRecord} disabled={recording || (!data.url && !currentRecord.voiceUrlFull)} icon={<DeleteOutlined />} />
            {/* <DeleteOutlined className='record-icon' /> */}
          </Space>
        </Row>

        <Row align={'middle'} justify={'center'} style={{marginTop: 20}}>
          {recording && <span>{time.h}:{time.m}:{time.s}</span>}
        </Row>
        

        <Row align={'middle'} justify={'center'} style={{marginTop: 20}}>
            <div>上传仅支持WAV格式的文件</div>
        </Row>
        
        <Row align={'middle'} justify={'center'} style={{marginTop: 20}}>
            <Button type='primary' disabled={!data.url} onClick={saveRecord}>保存录音</Button>
        </Row>
        
        <audio ref={audioRef} hidden />
      </Modal>
  </div>
}

export default Record
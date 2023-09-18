import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Form, Row, Col, Select, Card } from 'antd';
import { getAllTaskList } from '../../services/taskCenter'


const TaskCenter: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskList, setTaskList] = useState([]);

  const getList = useCallback(() =>{
    setLoading(true);
    getAllTaskList
    .then((res) => {
        setTaskList(res);
        setLoading(false);
      })
    .catch((err) => {
        console.log(err);
      });
  })

  console.log('TaskCenterTaskCenterTaskCenterTaskCenterTaskCenter')

  useEffect(() => {
    debugger
    getList();
  }, [])

  return (
    <Card>
      <h1>Task Center</h1>
    </Card>
  );
}
export default TaskCenter
  


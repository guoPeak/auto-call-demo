import { Button, Tag, Modal, Form, Input, Spin, Popconfirm, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import type {
  ITopologyNode,
  ITopologyData,
  IWrapperOptions,
} from '@byai/topology/dist/lib/declare';
import { Topology, topologyWrapper, TemplateWrapper } from '@byai/topology';
import '@byai/topology/dist/lib/index.css';
import './index.less';
import {
  getBranchDefaultConfig,
  getTalkProcessById,
  saveTalkProcess,
  updateTalkProcessById,
  updateTalkProcessSortById,
  saveTalkProcessById,
  getTalkProcessTaskById,
  deleteTalkProcessById,
} from './service';
import { history, withRouter } from 'umi';
import Sortable from '@/components/Sortable/Sortable';
// import SortableItem from '@/components/Sortable/Item';
// import { SortableContainer, SortableElement } from 'react-sortable-hoc';
// import { arrayMoveImmutable } from 'array-move';
import TalkDrawer from './components/talkDrawer';

// const SortableList = SortableContainer(({ children }) => {
//     return children;
// });

// const SortableItem = SortableElement(({ children }) => (
//     children
// ))
interface FlowState {
  data: ITopologyData;
  readonly: boolean;
  overlap?: boolean;
  showBar?: boolean;
  canConnectMultiLines?: boolean;
  branchConfig?: any[];
  leftProcess?: any[];
  isModalOpen?: boolean;
  modalLoading?: boolean;
  listLoading?: boolean;
  containerLoading?: boolean;
  openDrawer?: boolean;
  drawerData?: any;
  editId?: string | number | null;
}

const switchType = (type: number) => {
  switch (type) {
    case 1:
      return '普通节点';
    case 2:
      return '跳转节点';
    case 3:
      return '条件跳转节点';
    case 4:
      return '挂机';
    default:
      return '普通节点';
  }
};

const rondomTagColor = {
  肯定: {
    bgColor: 'rgb(240, 249, 255)',
    color: 'rgb(30, 102, 204)',
  },
  否定: {
    color: 'rgb(183, 21, 34)',
    bgColor: 'rgb(255, 241, 240)',
  },
  默认: {
    color: 'rgba(0, 0, 0, 0.65)',
    bgColor: 'rgb(239, 245, 249)',
  },
  拒绝: {
    color: 'rgb(179, 82, 13)',
    bgColor: 'rgb(255, 244, 225)',
  },
};

const nextActionMap = {
  hangup: '挂机',
  next: '下一步主动流程',
  assign: '指定主动流程',
};
class Flow extends React.Component<any, FlowState> {
  state: FlowState = {
    data: {
      lines: [
        // {
        //     start: '1585466878859',
        //     end: '1585466718867',
        //     color: '#b71522',
        // },
      ],
      nodes: [
        // {
        //     id: '1585466878859-0',
        //     name: '窄节点',
        //     content: '这是一个窄节点',
        //     branches: ['锚点1'],
        //     position: {
        //         x: 19726.906692504883,
        //         y: 19512.21832561493,
        //     },
        //     filterOverlap: true
        // },
        // {
        //     id: '1585466718867',
        //     name: '宽节点',
        //     content: '这是一个宽节点',
        //     branches: ['锚点1', '锚点2', '锚点3'],
        //     position: {
        //         x: 19629.79557800293,
        //         y: 19696.197512626648,
        //     },
        //     canDrag: false,
        // },
      ],
    },
    readonly: false,
    overlap: false,
    showBar: true,
    canConnectMultiLines: false,
    branchConfig: [],
    leftProcess: [],
    isModalOpen: false,
    modalLoading: false,
    listLoading: false,
    containerLoading: false,
    openDrawer: false,
    drawerData: {},
    editId: null,
  };
  // eslint-disable-next-line
  topology: any = null;

  talkId = null;

  processId: any = null;

  setOpenDrawer(val: boolean, data?: any) {
    if (data) {
      this.setState({
        openDrawer: val,
        drawerData: data,
      });
    } else {
      this.setState({
        openDrawer: val,
      });
    }
  }

  getDefaultConfig = async () => {
    const res = await getBranchDefaultConfig();
    console.log(res);
    this.setState({
      branchConfig: res,
    });
  };

  getNameByType = (type: number) => {
    this.state.branchConfig?.find((item) => item.type === type);
  };

  generatorNodeData = (type: number) => {
    const obj: any = {
      id: `${Date.now()}`,
      type,
      talk: '',
      name: switchType(type),
      botId: this.talkId,
      instId: this.processId,
      dragChild: false,
      taskTemplate: type,
      score: 12,
      taskType: 1,
      tagIds: '',
      repeatCount: 2,
      answerType: 1,
      isIntercept: 1,
      sendMsg: 1,
      msgTemplateId: 26,
    };
    if (type === 1) {
      const { branchConfig } = this.state;
      const branchIds = branchConfig?.map((item) => item.id).join(',');
      const branchNames = branchConfig?.map((item) => item.name).join(',');
      obj.branchIds = branchIds;
      obj.branchNames = branchNames;
      // obj.branches = branchConfig
    } else if (type === 2) {
      obj.nextActionTxt = '执行下一步';
      obj.nextAction = 'next';
    } else if (type === 3) {
      obj.branchNames = '默认';
      obj.branchIds = '1';
    }
    return obj;
  };

  handleSelect = (data: ITopologyData) => {
    console.log(data);
  };

  async getTalkProcess() {
    console.log('getTalkProcess', history);
    this.setState({
      containerLoading: true,
    });
    const list = await getTalkProcessById({
      id: this.talkId,
    });
    list.sort((a, b) => a.sort - b.sort); // 排序
    list.forEach((item: any, index: number) => {
      item.selected = !index;
    });
    this.processId = list[0]?.id;
    this.setState({
      leftProcess: list,
      containerLoading: false,
    });
    this.processId && (await this.handleTalkClick(this.processId));
  }

  async componentDidMount() {
    const id = this.props.match.params.id;
    this.talkId = id;
    this.getDefaultConfig();
    await this.getTalkProcess();
  }

  renderTreeNode = (data: ITopologyNode, { anchorDecorator }: IWrapperOptions) => {
    const {
      name = '',
      talk = '',
      type,
      branchNames = '',
      branchIds = '',
      nextActionTxt,
      nextAction,
    } = data;
    const branchNamesArr = branchNames.split(',');
    const branchIdsArr = branchIds.split(',');
    const branches = branchIdsArr.map((id, i) => ({ name: branchNamesArr[i], id, checked: true }));

    return (
      <div className="topology-node" onDoubleClick={() => this.setOpenDrawer(true, data)}>
        <div className="node-header">{name}</div>
        {talk ? <p className="node-content">{talk}</p> : null}
        {branches?.length > 0 ? (
          <div className="flow-node-branches-wrapper">
            {branches.map((item: any, index: number) => {
              const itemColor = rondomTagColor[item.name] || rondomTagColor['默认'];
              return anchorDecorator({
                anchorId: `${index}`,
              })(
                <span
                  className="flow-node-branch"
                  style={{ backgroundColor: itemColor.bgColor, color: itemColor.color }}
                >
                  {item.name}
                </span>,
              );
            })}
          </div>
        ) : null}
        {nextAction && type == 2 ? (
          <div className="next-step">下一步：{nextActionMap[nextAction]}</div>
        ) : null}
      </div>
    );
  };

  onChange = (data: ITopologyData, type: string) => {
    this.setState({ data });
    console.log('data => type', data, type);
  };

  async setList(newList: any) {
    console.log('setList==', newList);
    // return newList.map((item: any) => {
    //     return (
    //         <div key={item.id} className='list-item'>
    //             {item.name}
    //         </div>
    //     )
    // })
    // const data = []
    // const list  = []
    // newList.forEach((item: any, index: number) => {
    //     data.push({
    //         id: item.id,
    //         sort: index,
    //     })
    // })
    this.setState({
      leftProcess: newList.map((item: any) => item.data),
    });
    const data = newList.map((item: any, index: number) => ({ id: item.data.id, sort: index }));
    await updateTalkProcessSortById({
      innerSorts: data,
    });
    await this.getTalkProcess();
  }

  handleTalkClick(id: string) {
    this.processId = id;
    const list = this.state.leftProcess;
    list?.forEach((item: any) => {
      item.selected = item.id === id;
    });
    this.setState({
      leftProcess: list,
      containerLoading: true,
    });
    getTalkProcessTaskById({
      // 根据流程id查询task
      botId: this.talkId,
      id,
    }).then((res) => {
      const { lines, nodes } = this.transfromDataToNodes(res);
      this.setState({
        containerLoading: false,
        data: {
          lines,
          nodes,
        },
      });
    });
  }

  transfromDataToNodes({ lines = [], nodes = [] }) {
    // const newLines = lines.map(item => item)
    const newLines = lines || [];
    const newNodes = nodes.map((item: any) => {
      // const branchNames = item.branchNames.split(',')
      // const branchIds = item.branchIds.split(',')
      // const branches: branchIds.map((id, i) => ({ name: branchNames[i], id, checked: true }))

      return {
        ...item,
        id: item.canvasId,
        position: item.config.position,
        type: item.taskTemplate,
        // branches,
      };
    });
    return {
      nodes: newNodes,
      lines: newLines,
    };
  }

  async deleteProcess(event: Event, id: number) {
    event.stopPropagation();
    console.log('deleteProcess', id);
    await deleteTalkProcessById({
      botId: this.talkId,
      id,
    });
    await this.getTalkProcess();
  }

  async handleEditProcess(event: Event, { id, name }: any) {
    event.stopPropagation();
    console.log('handleEditProcess', id);
    this.setState(
      {
        isModalOpen: true,
        editId: id,
      },
      () => {
        this.formRef.current?.setFieldValue('name', name);
      },
    );
  }

  async onLeftProcessSortEnd({ oldIndex, newIndex }) {
    const { leftProcess } = this.state;
    const newList = arrayMoveImmutable(leftProcess, oldIndex, newIndex);
    this.setState({
      leftProcess: newList,
    });
    const data = newList.map((item: any, index: number) => ({ id: item.data.id, sort: index }));
    await updateTalkProcessSortById({
      innerSorts: data,
    });
    await this.getTalkProcess();
  }

  renderLeftList() {
    // const { leftProcess } = this.state
    // return (<SortableList onSortEnd={this.onLeftProcessSortEnd.bind(this)}>
    //     {leftProcess?.map((item, index) => <SortableItem key={item.id} index={index}><div
    //         key={item.id}
    //         className={item.selected ? 'list-item active' : 'list-item'}
    //         onClick={() => this.handleTalkClick(item.id)}
    //     >
    //         {item.name}
    //         <EditOutlined className='edit-icon' key="edit" onClick={e => this.handleEditProcess(e, item)} />
    //         <Popconfirm
    //             title="确定要删除该流程？"
    //             onCancel={(e) => e.stopPropagation()}
    //             onConfirm={(event) => this.deleteProcess(event, item.id)}
    //         >
    //             <DeleteOutlined className="delete-icon" onClick={(e) => e.stopPropagation()} />
    //         </Popconfirm>
    //     </div></SortableItem>)}
    // </SortableList>)
    return this.state.leftProcess?.map((item) => {
      return {
        key: item.id,
        data: item,
        children: (
          <div
            key={item.id}
            className={item.selected ? 'list-item active' : 'list-item'}
            onClick={() => this.handleTalkClick(item.id)}
          >
            {item.name}
            <EditOutlined
              className="edit-icon"
              key="edit"
              onClick={(e) => this.handleEditProcess(e, item)}
            />
            <Popconfirm
              title="确定要删除该流程？"
              onCancel={(e) => e.stopPropagation()}
              onConfirm={(event) => this.deleteProcess(event, item.id)}
            >
              <DeleteOutlined className="delete-icon" onClick={(e) => e.stopPropagation()} />
            </Popconfirm>
          </div>
        ),
      };
    });
  }

  onSortItems(items: any) {
    console.log('onSortItems', items);
    this.setState({
      leftProcess: items,
    });
  }

  formRef = React.createRef<FormInstance>();

  handleOk() {
    this.formRef.current!.validateFields().then(({ name }) => {
      this.setState({
        modalLoading: true,
      });
      if (this.state.editId) {
        // 编辑
        updateTalkProcessById({
          botId: this.talkId,
          id: this.state.editId,
          name,
        })
          .then(() => {
            this.setState({
              modalLoading: false,
              isModalOpen: false,
            });
            this.getTalkProcess();
          })
          .finally(() => {
            this.setState({
              modalLoading: false,
            });
          });
      } else {
        // 新增
        saveTalkProcess({
          botId: this.talkId,
          name,
          sort: this.state.leftProcess?.length || 0,
        })
          .then(() => {
            this.setState({
              modalLoading: false,
              isModalOpen: false,
            });
            this.getTalkProcess();
          })
          .finally(() => {
            this.setState({
              modalLoading: false,
            });
          });
      }
    });
  }

  handleCancel() {
    this.setState({
      isModalOpen: false,
    });
  }

  afterClose() {
    this.formRef.current!.resetFields();
  }

  saveNodeData(data: any) {
    console.log('saveNodeData', data);
    const { nodes, lines } = this.state.data;
    const node = nodes.find((item) => item.id === data.id);
    node && Object.assign(node, data);
    this.setState({
      data: {
        lines,
        nodes,
      },
      openDrawer: false,
    });
    console.log(node);
  }

  saveProcess() {
    console.log('children save======');
    const { lines, nodes } = this.state.data;
    if (!nodes.length) {
      message.error('当前话术内容为空!');
      return;
    }
    this.setState({
      containerLoading: true,
    });

    // lines.forEach((item: any) => {
    //     item.instId = this.processId
    //     // item.taskId = this.talkId
    // })
    saveTalkProcessById({
      lines: lines.map((item) => {
        const [taskCanvasId, startNodeBranchId] = item.start.split('-');
        const branch = this.state.branchConfig?.find(
          (item2) => item2.id == Number(startNodeBranchId) + 1,
        );
        console.log('saveTalkProcessById =>', branch, startNodeBranchId);
        return {
          ...item,
          instId: this.processId,
          canvasId: item.start,
          taskCanvasId,
          name: branch.name,
          keywords: branch.keywords,
          selected: 1,
        };
      }),
      nodes: nodes.map((item, i) => {
        item.canvasId = item.id;
        const obj: any = {
          ...item,
          taskCanvasId: item.id,
          isOpen: i === 0 ? 1 : 0,
          config: {
            // canDrag: true,
            // filterOverlap: true,
            position: item.position,
          },
        };
        delete obj.id;
        delete obj.branches;
        delete obj.position;
        delete obj.dragChild;
        return obj;
      }),
    })
      .then(() => {
        message.success('保存成功');
      })
      .finally(() => {
        this.setState({
          containerLoading: false,
        });
      });
  }

  render() {
    const {
      data,
      readonly,
      showBar,
      overlap,
      canConnectMultiLines,
      isModalOpen,
      modalLoading,
      listLoading,
      containerLoading,
      openDrawer,
      leftProcess,
      drawerData,
      editId,
    } = this.state;
    const mockLineColor = {
      0: '#82BEFF',
      1: '#FFA39E',
      2: '#FFC89E',
    };
    return (
      <Spin spinning={containerLoading}>
        <div className="topology">
          <Spin spinning={listLoading}>
            <div className="left-topology">
              <Button
                type="primary"
                onClick={() => this.setState({ isModalOpen: true, editId: null })}
                style={{ width: '100%' }}
              >
                添加
              </Button>
              {leftProcess?.length ? (
                <Sortable list={this.renderLeftList()} setList={this.setList.bind(this)} />
              ) : null}
              {/* {leftProcess?.length ? this.renderLeftList() : null} */}
              <Modal
                title={`${editId ? '编辑' : '新增'}流程节点`}
                open={isModalOpen}
                onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                okButtonProps={{ loading: modalLoading }}
                afterClose={this.afterClose.bind(this)}
              >
                <Form layout="inline" ref={this.formRef}>
                  <Form.Item
                    label="流程名称"
                    name="name"
                    rules={[{ required: true, message: '请输入流程名称' }]}
                  >
                    <Input placeholder="请输入流程名称" />
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </Spin>
          {leftProcess?.length ? (
            <div className="save-button">
              <Button type="primary" onClick={this.saveProcess.bind(this)}>
                保存
              </Button>
            </div>
          ) : null}
          <div className="right-topology">
            <div className="top-header">
              <TemplateWrapper generator={() => this.generatorNodeData(1)}>
                <div className="topology-templates-item">普通节点</div>
              </TemplateWrapper>
              <TemplateWrapper generator={() => this.generatorNodeData(2)}>
                <div className="topology-templates-item">跳转节点</div>
              </TemplateWrapper>
              <TemplateWrapper generator={() => this.generatorNodeData(3)}>
                <div className="topology-templates-item">条件判断节点</div>
              </TemplateWrapper>
              <TemplateWrapper generator={() => this.generatorNodeData(4)}>
                <div className="topology-templates-item">挂机</div>
              </TemplateWrapper>
            </div>
            <div style={{ width: '100%', height: '100%', backgroundColor: '#f7f7f7' }}>
              <Topology
                data={data}
                autoLayout
                lineColor={mockLineColor}
                onChange={this.onChange}
                onSelect={this.handleSelect}
                renderTreeNode={this.renderTreeNode}
                readOnly={readonly}
                showBar={showBar}
                customPostionHeight={20}
                canConnectMultiLines={canConnectMultiLines}
                overlap={overlap}
                overlapOffset={{
                  offsetX: 30,
                  offsetY: 30,
                }}
                getInstance={(ins: any) => {
                  console.log(ins);
                  this.topology = ins;
                }}
              />
            </div>

            <TalkDrawer
              open={openDrawer}
              data={drawerData}
              save={this.saveNodeData.bind(this)}
              setOpen={this.setOpenDrawer.bind(this)}
            />
          </div>
        </div>
      </Spin>
    );
  }
}

export default withRouter(topologyWrapper(Flow));

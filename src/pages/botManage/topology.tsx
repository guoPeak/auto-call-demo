import { Button, Tag, Modal, Form, Input, Spin, Popconfirm } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { DeleteOutlined } from '@ant-design/icons';
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
  saveTalkProcessById,
  getTalkProcessTaskById,
  deleteTalkProcessById,
} from './service';
import { history, withRouter } from 'umi';
import Sortable from '@/components/Sortable/Sortable';
// import SortableItem from '@/components/Sortable/Item';
import TalkDrawer from './components/talkDrawer';

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
      break;
  }
};

const rondomTagColor = {
  1: {
    bgColor: 'rgb(240, 249, 255)',
    color: 'rgb(30, 102, 204)',
  },
  2: {
    color: 'rgb(183, 21, 34)',
    bgColor: 'rgb(255, 241, 240)',
  },
  3: {
    color: 'rgba(0, 0, 0, 0.65)',
    bgColor: 'rgb(239, 245, 249)',
  },
  4: {
    color: 'rgb(179, 82, 13)',
    bgColor: 'rgb(255, 244, 225)',
  },
};
class Flow extends React.Component<{}, FlowState> {
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
  };
  // eslint-disable-next-line
  topology: any = null;

  talkId = null;

  setOpenDrawer(val: boolean) {
    this.setState({
      openDrawer: val,
    });
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
    return {
      id: `${Date.now()}`,
      type,
      name: switchType(type),
      content: '',
      branches: this.state.branchConfig,
      dragChild: false,
      nextAction: '执行下一步',
    };
  };

  handleSelect = (data: ITopologyData) => {
    console.log(data);
  };

  async getTalkProcess() {
    console.log('getTalkProcess', history);
    this.setState({
      listLoading: true,
    });
    const list = await getTalkProcessById({
      id: this.talkId,
    });
    list.forEach((item: any, index: number) => {
      item.selected = !index;
    });
    list.sort((a, b) => a.sort - b.sort);
    this.setState({
      leftProcess: list,
      listLoading: false,
    });
  }

  async componentDidMount() {
    // eslint-disable-next-line
    const id = this.props.match.params.id;
    this.talkId = id;
    this.getDefaultConfig();
    await this.getTalkProcess();
  }

  renderTreeNode = (data: ITopologyNode, { anchorDecorator }: IWrapperOptions) => {
    const { name = '', content = '', branches = [], type, nextAction } = data;
    return (
      <div className="topology-node" onDoubleClick={() => this.setOpenDrawer(true)}>
        <div className="node-header">{name}</div>
        <p className="node-content">{content}</p>
        {branches.length > 0 && type === 1 && (
          <div className="flow-node-branches-wrapper">
            {branches.map((item: any, index: number) => {
              const itemColor = rondomTagColor[item.type] || rondomTagColor[3];
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
        )}
        {type === 2 && <div className="next-step">下一步：{nextAction}</div>}
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
    await updateTalkProcessById({
      innerSorts: data,
    });
    await this.getTalkProcess();
  }

  handleTalkClick(id: string) {
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
      this.setState({
        containerLoading: false,
        data: {
          lines: res.lines || [],
          nodes: res.nodes || [],
        },
      });
    });
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

  getList() {
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
                onClick={() => this.setState({ isModalOpen: true })}
                style={{ width: '100%' }}
              >
                添加
              </Button>
              {/* <div className='list'>
                        {this.state.leftProcess?.map((item, i) => {
                            return (
                                <SortableItem key={i} onSortItems={this.onSortItems.bind(this)} items={this.state.leftProcess} sortId={i}>
                                    <div className='list-item'>
                                        {item.name}
                                    </div>
                                </SortableItem>
                            )
                        })}
                    </div> */}
              <Sortable list={this.getList()} setList={this.setList.bind(this)} />
              <Modal
                title="新增流程节点"
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
              title="编辑普通流程"
              open={openDrawer}
              setOpen={this.setOpenDrawer.bind(this)}
            />
          </div>
        </div>
      </Spin>
    );
  }
}

export default withRouter(topologyWrapper(Flow));

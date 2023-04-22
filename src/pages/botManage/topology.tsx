import { Button, Tag, Modal, Form, Input, Spin } from 'antd';
import type { FormInstance } from 'antd/es/form';
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
} from './service';
import { history } from 'umi';
import Sortable from '@/components/Sortable/Sortable';
// import SortableItem from '@/components/Sortable/Item';

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
}

const switchType = (type: number) => {
  switch (type) {
    case 1:
      return '普通节点';
    case 2:
      return '跳转节点';
    case 3:
      return '结束节点';
    default:
      return '普通节点';
      break;
  }
};

const rondomTagColor = (type: number) => {
  switch (type) {
    case 1:
      return 'magenta';
    case 2:
      return 'red';
    case 3:
      return 'orange';
    case 4:
      return 'green';
    default:
      return 'blue';
  }
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
  };
  // eslint-disable-next-line
  topology: any = null;

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
      name: switchType(type),
      content: '',
      branches: this.state.branchConfig,
      dragChild: false,
    };
  };

  handleSelect = (data: ITopologyData) => {
    console.log(data);
  };

  async getTalkProcess() {
    const { query } = history.location;
    this.setState({
      listLoading: true,
    });
    const list = await getTalkProcessById({
      id: query?.id,
    });
    this.setState({
      leftProcess: list,
      listLoading: false,
    });
  }

  async componentDidMount() {
    this.getDefaultConfig();
    await this.getTalkProcess();
  }

  renderTreeNode = (data: ITopologyNode, { anchorDecorator }: IWrapperOptions) => {
    const { name = '', content = '', branches = [] } = data;
    return (
      <div className="topology-node">
        <div className="node-header">{name}</div>
        <p className="node-content">{content}</p>
        {branches.length > 0 && (
          <div className="flow-node-branches-wrapper">
            {branches.map((item: any, index: number) =>
              anchorDecorator({
                anchorId: `${index}`,
              })(<Tag color={rondomTagColor(item.type)}>{item.name}</Tag>),
            )}
          </div>
        )}
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
    // const data = newList.map((item: any, index: number) => ({ id: item.data.id, sort: index }))
    // await saveTalkProcess({
    //     botId: history.location.query?.id,
    //     innerSorts: data
    // })
    // await this.getTalkProcess()
  }

  getList() {
    return this.state.leftProcess?.map((item) => {
      return {
        key: item.id,
        data: item,
        children: (
          <div key={item.id} className="list-item">
            {item.name}
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
      const { query } = history.location;
      saveTalkProcess({
        botId: query?.id,
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
    } = this.state;
    const mockLineColor = {
      0: '#82BEFF',
      1: '#FFA39E',
      2: '#FFC89E',
    };
    return (
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
          </div>
          <div style={{ width: '100%', height: '700px', backgroundColor: '#f7f7f7' }}>
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
                this.topology = ins;
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default topologyWrapper(Flow);

import { Button, Tag, Modal, Form, Input, Spin, Popconfirm, message, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { DeleteOutlined, EditOutlined, ArrowDownOutlined, ArrowUpOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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
// import Sortable from '@/components/Sortable/Sortable';
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
              
            ],
            nodes: [

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
        this.state.branchConfig?.find((item) => item.type == type);
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
            score: null,
            taskType: 1,
            tagIds: '',
            repeatCount: 0,
            answerType: 1,
            recall: 0,
            isIntercept: 0,
            sendMsg: 1,
            msgTemplateId: 26,
        };
        if (type == 1) {
            const { branchConfig } = this.state;
            // const branchIds = branchConfig?.map((item) => item.id).join(',');
            // const branchNames = branchConfig?.map((item) => item.name).join(',');
            // obj.branchIds = branchIds;
            // obj.branchNames = branchNames;
            obj.branches = branchConfig?.map((item, i) => {
              return {
                ...item,
                selected: 1,
                start: `${obj.id}-${item.type}`,
                end: '',
                startNodeBranchId: item.id
                // id: id
              }
            })
        } else if (type == 2) {
            obj.nextActionTxt = '执行下一步';
            obj.nextAction = 'next';
            obj.nextTaskId = ''
        } else if (type == 3) {
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
        let list = []
        try {
            list = await getTalkProcessById({
                botId: this.talkId,
            });
            list.sort((a, b) => a.sort - b.sort); // 排序
            list.forEach((item: any, index: number) => {
                item.selected = !index;
            });
            this.processId = list[0]?.instId;
        } catch (error) {
            
        }
        this.setState({
            leftProcess: list,
            containerLoading: false,
        });
        this.processId && (await this.handleTalkClick({instId: this.processId}));
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
            // branchNames = '',
            // branchIds = '',
            // nextActionTxt,
            nextAction,
            nextTaskId,
            branches
        } = data;
        let nextActionName = ''
        if (nextTaskId) {
          nextActionName = this.state.leftProcess?.find(item => item.instId === nextTaskId)?.name || ''
        } else if (nextAction) {
          nextActionName = nextActionMap[nextAction]
        }
        // const branchNamesArr = branchNames.split(',');
        // const branchIdsArr = branchIds.split(',');
        const newBranches = branches?.map((item) => ({ ...item })) || [];
        return (
            <div className="topology-node" onDoubleClick={() => this.setOpenDrawer(true, data)}>
                <div className="node-header">{name}</div>
                {talk ? <p className="node-content">{talk}</p> : null}
                {newBranches?.length > 0 ? (
                    <div className="flow-node-branches-wrapper">
                        {newBranches.map((item: any) => {
                          if (!item.selected) return null
                            const itemColor = rondomTagColor[item.name] || rondomTagColor['默认'];
                            return anchorDecorator({
                                anchorId: `${item.startNodeBranchId}`,
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
                    <div className="next-step">下一步：{nextActionName}</div>
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
            leftProcess: newList // .map((item: any) => item.data),
        });
        const data = newList.map((item: any, index: number) => ({ id: item.id, sort: index }));
        await updateTalkProcessSortById({
            innerSorts: data,
        });
        // await this.getTalkProcess();
    }

    handleTalkClick({ selected, instId }: any) {
        if (selected) return
        this.processId = instId;
        const list = this.state.leftProcess;
        list?.forEach((item: any) => {
            item.selected = item.instId === instId;
        });
        this.setState({
            leftProcess: list,
            containerLoading: true,
        });
        getTalkProcessTaskById({
            // 根据流程id查询task
            botId: this.talkId,
            instId,
        }).then((res) => {
            const { lines, nodes } = this.transfromDataToNodes(res);
            debugger
            this.setState({
                containerLoading: false,
                data: {
                    lines,
                    nodes,
                },
            });
        });
    }

    transfromDataToNodes({ lines, nodes }: any) {
        lines = lines || []
        nodes = nodes || []
        // const newLines = lines.map(item => item)
        const newLines = lines?.filter(item => !!item.end) || [];
        const newNodes = nodes.map((item: any) => {
            // const branchNames = item.branchNames.split(',')
            // const branchIds = item.branchIds.split(',')
            // const branches = branchIds.map((id, i) => {
            //   const curBranch = lines?.fileter((e: any) => e.taskCanvasId === item.canvasId) || {}
            //   const { keywords = '', selected = 1 }: any = curBranch
            //   return { name: branchNames[i], id, keywords, selected }
            // })

            const branches = lines?.filter((e: any) => e.taskCanvasId === item.canvasId).sort((a, b) => a.type - b.type) || []

            console.log('transfromDataToNodes ====>', branches);

            return {
                ...item,
                id: item.canvasId,
                position: item.config.position,
                // type: item.taskTemplate,
                branches,

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

    // async onLeftProcessSortEnd({ oldIndex, newIndex }) {
    //     const { leftProcess } = this.state;
    //     const newList = arrayMoveImmutable(leftProcess, oldIndex, newIndex);
    //     this.setState({
    //         leftProcess: newList,
    //     });
    //     const data = newList.map((item: any, index: number) => ({ id: item.data.id, sort: index }));
    //     await updateTalkProcessSortById({
    //         innerSorts: data,
    //     });
    //     await this.getTalkProcess();
    // }

    handleUp (index: number) {
      const leftProcess = this.state.leftProcess || []
      const temp = leftProcess[index]
      leftProcess[index] = leftProcess[index - 1]
      leftProcess[index - 1] = temp
      this.setList(leftProcess)
      return Promise.resolve()
    }

    handleDown (index: number) {
      const leftProcess = this.state.leftProcess || []
      const temp = leftProcess[index]
      leftProcess[index] = leftProcess[index + 1]
      leftProcess[index + 1] = temp
      this.setList(leftProcess)
      return Promise.resolve()
    }

    handleUpOrDown (e: any, index: number, type: string) {
      e.stopPropagation()
      Modal.confirm({
        title: '移动',
        icon: <ExclamationCircleOutlined />,
        content: '确定要移动流程吗',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          return type === 'up' ? this.handleUp(index) : this.handleDown(index)
        },
      });
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
        const leftProcess= this.state.leftProcess
        return leftProcess?.map((item, index) => {
            return (
                    <div
                        key={item.instId}
                        className={item.selected ? 'list-item active' : 'list-item'}
                        onClick={() => this.handleTalkClick(item)}
                    >
                        {item.name}

                        <div className='left-arrow'>
                          <Space size={[8, 8]}>
                            { index > 0 ? <ArrowUpOutlined onClick={(e) =>this.handleUpOrDown(e, index, 'up')} /> : null}
                            { index < leftProcess.length - 1 ? <ArrowDownOutlined onClick={(e) => this.handleUpOrDown(e, index, 'down')} /> : null}
                          </Space>
                        </div>
                        <EditOutlined
                            className="edit-icon"
                            key="edit"
                            onClick={(e) => this.handleEditProcess(e, item)}
                        />
                        <Popconfirm
                            title="确定要删除该流程？"
                            onCancel={(e) => e.stopPropagation()}
                            onConfirm={(event) => this.deleteProcess(event, item.instId)}
                        >
                            <DeleteOutlined className="delete-icon" onClick={(e) => e.stopPropagation()} />
                        </Popconfirm>
                    </div>
                )
            })
    }

    // onSortItems(items: any) {
    //     console.log('onSortItems', items);
    //     this.setState({
    //         leftProcess: items,
    //     });
    // }

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
        console.log('saveNodeData ===>', node);
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
        debugger
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

        const nodeLines = lines.map((item) => {
          const [taskCanvasId, startNodeBranchId] = item.start.split('-');
          return {
            ...item,
            instId: this.processId,
            canvasId: item.start,
            taskCanvasId,
            startNodeBranchId,
            name: '',
            keywords: '',
            selected: '',
        };
      })
        const newLines: any[] = []
        const newNodes = nodes.map((item, i) => {
          item.canvasId = item.id;
          const obj: any = {
              ...item,
              taskCanvasId: item.id,
              isOpen: i === 0 ? 1 : 0,
              config: {
                  canDrag: true,
                  filterOverlap: true,
                  position: item.position,
              },
          };
          item.branches?.length > 0 && item.branches.forEach((branch: any) => {
            const hasLine = nodeLines.findIndex(e => e.taskCanvasId == item.id && e.startNodeBranchId == branch.id )
            // console.log('item.branches.forEach ===>', item.id, hasLine, nodeLines, branch);
            if (hasLine > -1) {
              nodeLines[hasLine].name = branch.name
              nodeLines[hasLine].keywords = branch.keywords
              nodeLines[hasLine].selected = branch.selected
            } else {
              newLines.push({
                ...branch,
                instId: this.processId,
                canvasId: item.start,
                taskCanvasId: item.id,
                startNodeBranchId: branch.id,
              })
            }
          })
          delete obj.id;
          delete obj.branches;
          delete obj.position;
          delete obj.dragChild;
          return obj;
      })

        saveTalkProcessById({
            lines: newLines.concat(nodeLines),
            nodes: newNodes,
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
            // branchConfig,
        } = this.state;
        const mockLineColor = {
            0: '#82BEFF',
            1: '#FFA39E',
            2: '#FFC89E',
        };
        return (
          <div className='topology-spin'>
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
                            {/* {leftProcess?.length ? (
                                <Sortable list={this.renderLeftList()} setList={this.setList.bind(this)} />
                            ) : null} */}
                            {leftProcess?.length ? this.renderLeftList() : null}
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
                            {/* <TemplateWrapper generator={() => this.generatorNodeData(3)}>
                                <div className="topology-templates-item">条件判断节点</div>
                            </TemplateWrapper> */}
                            {/* <TemplateWrapper generator={() => this.generatorNodeData(4)}>
                                <div className="topology-templates-item">挂机</div>
                            </TemplateWrapper> */}
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
                                // getInstance={(ins: any) => {
                                //     console.log('getInstance ===>', ins);
                                //     this.topology = ins;
                                // }}
                            />
                        </div>

                        {openDrawer && <TalkDrawer
                            open={true}
                            data={drawerData}
                            allTalk={leftProcess}
                            save={this.saveNodeData.bind(this)}
                            setOpen={this.setOpenDrawer.bind(this)}
                        />}
                    </div>
                </div>
            </Spin>
            </div>
        );
    }
}

export default withRouter(topologyWrapper(Flow));

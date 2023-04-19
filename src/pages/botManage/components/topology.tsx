import { Button, message, Input, Drawer, Form, Row, Col, Select, Tabs, Card } from 'antd';
import React, { useState, useRef } from 'react';
import type { ITopologyNode, ITopologyData, IWrapperOptions } from '@byai/topology/dist/lib/declare';
import { Topology, topologyWrapper, TemplateWrapper } from '@byai/topology';
import '@byai/topology/dist/lib/index.css';
import './index.less';
import { getBranchDefaultConfig } from '../service';


interface FlowState {
    data: ITopologyData;
    readonly: boolean;
    overlap?: boolean;
    showBar?: boolean;
    canConnectMultiLines?: boolean;
    branchConfig?: any[]
}

const switchType = (type: number) => {
    switch (type) {
        case 1:
            return '普通节点'
        case 2:
            return '跳转节点'
        case 3:
            return '结束节点'
        default:
            break;
    }
}
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
        branchConfig: []
    };
    // eslint-disable-next-line
    topology: any = null;

    getDefaultConfig = async () => {
        const res = await getBranchDefaultConfig()
        console.log(res);
        this.setState({
            branchConfig: res.data
        })
    }

    getNameByType = (type: number) => {
        this.state.branchConfig?.find(item => item.type === type)
    }

    generatorNodeData = (type: number) => {
        return {
            id: `${Date.now()}`,
            name: switchType(type),
            content: '',
            branches: this.state.branchConfig,
            dragChild: false
        }
    };

    handleSelect = (data: ITopologyData) => {
        console.log(data);
    }

    componentDidMount() {
        this.getDefaultConfig()
    }

    renderTreeNode = (data: ITopologyNode, { anchorDecorator }: IWrapperOptions) => {
        const {
            name = '',
            content = '',
            branches = [],
        } = data;
        return (
            <div className="topology-node">
                <div className="node-header">{name}</div>
                <p className="node-content">{content}</p>
                {branches.length > 0 && (
                    <div className="flow-node-branches-wrapper">
                        {branches.map(
                            (item: string, index: number) => anchorDecorator({
                                anchorId: `${index}`,
                            })(<div className="flow-node-branch">{item.name}</div>),
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

    render() {
        const {
            data, readonly, showBar, overlap,
            canConnectMultiLines
        } = this.state;
        const mockLineColor = {
            0: '#82BEFF',
            1: '#FFA39E',
            2: '#FFC89E',
        };
        return (
            <div className="topology">
                <div className='top-header'>
                    <TemplateWrapper generator={() => this.generatorNodeData(1)}>
                        <div className="topology-templates-item">普通节点</div>
                    </TemplateWrapper>
                    <TemplateWrapper generator={() => this.generatorNodeData(2)}>
                        <div className="topology-templates-item">条件节点</div>
                    </TemplateWrapper>
                </div>
                <div style={{ width: '100%', height: '800px', backgroundColor: '#f7f7f7' }}>
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
                            offsetY: 30
                        }}
                        getInstance={
                            (ins: any) => { this.topology = ins; }}
                    />
                </div>
            </div>
        );
    }
}

export default topologyWrapper(Flow);
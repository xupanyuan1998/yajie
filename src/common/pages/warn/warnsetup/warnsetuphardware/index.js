import React from 'react'
import {Tabs,Select,Table, Divider, Tag,Modal,Button,message} from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../../utils/urls';
import {createHashHistory} from 'history';
import  settings from '../../../../images/operation/Settings.PNG';
const { TabPane } = Tabs;
const { Option } = Select;
import BreadcrumbCustom from "../../../../components/BreadcrumbCustom";
import  Networkwarnsetup from '../warnsetupitems/networkwarnsetup';
import  Serviceclientwarnsetup from '../warnsetupitems/serviceclientwarnsetup';
import  Upswarnsetup from '../warnsetupitems/upswarnsetup';
import Editsoftwareresource from "../../../setupmanager/resourcemanager/softwaremanager/editsoftwareresource";
import setBtn from '../../../../images/icon/parabtn.png';
export default class WarnSetupHardWare extends React.Component {
    columnsArray = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },{
            title: '设备名称',
            dataIndex: 'resouceName',
            key: 'resouceName',
        },{
            title: '资源编号',
            dataIndex: 'appId',
            key: 'appId',
        },{
            title: '设备类型',
            dataIndex: 'resouceTypeName',
            key: 'resouceTypeName',
        },{
            title: 'IP地址',
            dataIndex: 'resouceIp',
            key: 'resouceIp',
        },{
            title: '操作',
            key: 'tags',
            dataIndex: 'tags',
            render: (tags,data) => (
                <span>
            {tags.map((tag,index) => {
                return (
                    <a href="javascript:void(0);" onClick={this.actionClick.bind(this,{tag},{index},{data})} title={tag}><img src={setBtn}/></a>
                );
            })}
          </span>
            ),
        },
    ];
    constructor(props) {
        super(props);
        this.state = {
            selectPosition: '添加设备',
            tabsPostion:"1",//tabs选中索引
            hardWareArray:[],//硬件资源
            softWareArray:[],//软件资源
            selectOrButtonShow:true//当为ture：显示设备下拉列表，false:显示添加软件按钮
        };
    }

    /**
     * 设备select的切换事件
     * @param tabPosition
     */
    changeSelectPosition = selectPosition => {
        this.setState({ selectPosition:selectPosition });
        console.log(selectPosition);
        let path = {
            pathname:"addequipmentresource"
        }

        this.props.history.push(path);
    };

    componentDidMount() {
        //获取设备列表
        this.getHardWareResource();
    }

    /**
     * 获取设备列表
     * @returns
     */
    getHardWareResource() {
        axios.post(PATH.hardwareResource, {})
            .then(response => {
                console.log(response);
                if (response.data.code == 0) {
                    let dataArray = response.data.data;
                    for(let i = 0;i<dataArray.length;i++){
                        dataArray[i].key = i;
                        dataArray[i].tags = ["告警设置"];
                    }
                    this.setState({
                        hardWareArray:dataArray
                    })
                }
            });
    }

    /**
     * 点击操作功能
     * @returns {*}
     */
    actionClick = (props0,props1,props2) => {
        console.log(props0);
        console.log(props1);
        console.log(props2);
        let path = {
            state:{
                id:props2.data.id,
                appId:props2.data.appId,
                name:props2.data.resouceName,
                resouceType:props2.data.resouceType,
                isSoftware:0,
                props2:props2
            },
        }
        console.log(path);
        localStorage.setItem("softIdCurrent",props2.data.id);
        //0服务器，1客户端，2UPS，3路由器，4交换机
        if(props2.data.resouceType == 0 || props2.data.resouceType == 1){
            console.log(props2);
            this.state.ServiceclientData = {
                data:{
                    props2:props2,
                    id:props2.data.id,
                    appId:props2.data.appId,
                    resouceName:props2.data.resouceName,
                    resouceType:props2.data.resouceType,
                    isSoftware:0,
                }
            }
            this.setState({
                ServiceclientData:this.state.ServiceclientData,
                clientAndServiceBooladd:true
            })
            path.pathname='/serviceclientwarnsetup';
        }else if(props2.data.resouceType == 2){
            this.state.setupSoftWareResourceData = {
                data:{
                    props2:props2,
                    id:props2.data.id,
                    appId:props2.data.appId,
                    resouceName:props2.data.resouceName,
                    resouceType:props2.data.resouceType,
                    isSoftware:0,
                }
            }
            this.setState({
                setupSoftWareResourceData:this.state.setupSoftWareResourceData,
                UpswarnsetupServiceBool:true
            })

            path.pathname='/upswarnsetup';
        }else if(props2.data.resouceType == 3 ||props2.data.resouceType == 4){
            this.state.clientAndServiceData = {
                data:{
                    props2:props2,
                    id:props2.data.id,
                    appId:props2.data.appId,
                    resouceName:props2.data.resouceName,
                    resouceType:props2.data.resouceType,
                    isSoftware:0,
                }
            }
            this.setState({
                clientAndServiceData:this.state.clientAndServiceData,
                clientAndServiceBool:true
            })
            path.pathname='/networkwarnsetup';
        }
        //this.props.history.push(path);
    }

    /**
     * 硬件切换到软件
     * @returns {*}
     */
    onHardToSoftFun=e=>{
        let path={
            pathname:'warnsetupsoftware'
        };
        this.props.history.push(path);
    }

    handleOk = e => {
        console.log(e);
        this.child.onSubmit();
        this.setState({
            clientAndServiceBool: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            clientAndServiceBool: false,
        });
    };
    handleOkadd = e => {
        console.log(e);
        this.child.onSubmit();
        this.setState({
            clientAndServiceBooladd: false,
        });
    };

    handleCanceladd = e => {
        console.log(e);
        this.setState({
            clientAndServiceBooladd: false,
        });
    };

    handleOksetup = e => {
        console.log(e);
        this.child.onSubmit();
        this.setState({
            UpswarnsetupServiceBool: false,
        });
    };

    handleCancelsetup = e => {
        console.log(e);
        this.setState({
            UpswarnsetupServiceBool: false,
        });
    };
    onRefv = (ref) => {
        this.child = ref
    }

    changePage=(key)=>{
        console.log(key);
        if(key==2){
            let path={
                pathname:'/warnsetupsoftware'
            }
            this.props.history.push(path);
        }
    }

    render() {
        return (
            <div id="sceneManagerDiv">
                <BreadcrumbCustom first="告警管理" second="告警设置" />

                <div className="sceneSetUpDiv">

                    <Tabs defaultActiveKey="1"  onChange={this.changePage} defaultActiveKey="1">
                        <TabPane tab="设备告警设置" key="1">
                            <Table locale={{ emptyText: '无数据'}} size={"small"} columns={this.columnsArray} dataSource={this.state.hardWareArray} bordered />
                        </TabPane>
                        <TabPane tab="软件告警设置" key="2">

                        </TabPane>
                    </Tabs>
                    {
                        this.state.clientAndServiceBool?(
                            <Modal
                                title="告警设置"
                                visible={true}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                footer={this.state.clientAndServiceBool?(
                                    [
                                        <Button onClick={this.handleOk}>确定</Button>,
                                        <Button onClick={this.handleCancel}>取消</Button>
                                    ]
                                ):null}
                                width='50%'
                            >
                                <Networkwarnsetup onRefv={this.onRefv} onUpdataEquipment={this.getHardWareResource} dataSource={this.state.clientAndServiceData}></Networkwarnsetup>
                            </Modal>
                        ):null
                    }

                    {
                        this.state.clientAndServiceBooladd?(
                            <Modal
                                title="告警设置"
                                visible={true}
                                onOk={this.handleOkadd}
                                onCancel={this.handleCanceladd}
                                footer={this.state.clientAndServiceBooladd?(
                                    [
                                        <Button onClick={this.handleOkadd}>确定</Button>,
                                        <Button onClick={this.handleCanceladd}>取消</Button>
                                    ]
                                ):null}
                                width='50%'
                            >
                                <Serviceclientwarnsetup onRefv={this.onRefv} onUpdataEquipment={this.getHardWareResource} dataSource={this.state.ServiceclientData}></Serviceclientwarnsetup>
                            </Modal>
                        ):null
                    }
                    {
                        this.state.UpswarnsetupServiceBool?(
                            <Modal
                                title="告警设置"
                                visible={true}
                                onCancel={this.handleCancelsetup}
                                footer={this.state.UpswarnsetupServiceBool?(
                                    [
                                        <Button onClick={this.handleOksetup}>确定</Button>,
                                        <Button onClick={this.handleCancelsetup}>取消</Button>
                                    ]
                                ):null}
                                width='50%'
                            >
                                <Upswarnsetup onRefv={this.onRefv} onUpdataEquipment={this.getHardWareResource} dataSource={this.state.setupSoftWareResourceData}></Upswarnsetup>
                            </Modal>
                        ):null
                    }
                </div>
            </div>
        )
    }
}
import React from 'react'
import {Tabs,Select,Table, Divider, Tag,Modal,Button,message} from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../../utils/urls';
import BreadcrumbCustom from "../../../../components/BreadcrumbCustom";
import setBtn from "../../../../images/icon/parabtn.png";
import ServiceClientWarnSetup from "../warnsetupitems/serviceclientwarnsetup";

const { TabPane } = Tabs;
const { Option } = Select;

export default class WarnSetupSoftWare extends React.Component {
    columnsArray = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            render:(text)=>{
                let index = text+1;
                return <span>{index}</span>
            }
        },{
            title: '资源编号',
            dataIndex: 'hardwareAppId',
            key: 'hardwareAppId',
        },{
            title: '软件类型',
            dataIndex: 'resouceTypeName',
            key: 'resouceTypeName',
        },{
            title: '软件名称',
            dataIndex: 'resouceName',
            key: 'resouceName',
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
        console.log(props.location);
        let appId = "";
        let name = "";
        let currentId = localStorage.getItem("softIdCurrent");
        if(props.location.state){
            appId = props.location.state.appId;
        }else if(currentId){
            appId = currentId;
        }
        if(props.location.state){
            name = props.location.state.name;
        }
        this.state = {
            tabsPostion:"1",//tabs选中索引
            hardWareArray:[],//硬件资源
            softWareArray:[],//软件资源
            hardWareId:appId,
            name:name,
            warnSetUpBool:false,//告警设置权限
            serviceClienSetUpBool:false,
        };

        //判断按钮权限
        let permList = localStorage.getItem("permList");
        if(permList.indexOf("rz:warnconf:edit")>=0){
            this.state.warnSetUpBool = true;
        }
    }

    componentDidMount() {
        //获取软件列表
        this.getSoftWareResource();
    }

    /**
     * 获取软件列表
     * @returns {*}
     */
    getSoftWareResource(){
        axios.post(PATH.softwareResource, {
            // hardwareId: this.state.hardWareId
        }).then(response => {
            console.log(response);
            if (response.data.code == 0) {
                let dataArray = response.data.data;
                console.log(response.data.data);
                for(let i = 0;i<dataArray.length;i++){
                    dataArray[i].key = i;
                    dataArray[i].name = this.state.name;
                    if(this.state.warnSetUpBool){
                        dataArray[i].tags = ["告警设置"];
                    }
                }
                console.log(dataArray);
                this.setState({
                    hardWareArray:dataArray
                })
            }
        })
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
                appId:props2.data.hardwareAppId,
                name:props2.data.resouceName,
                resouceType:props2.data.resouceType,
                isSoftware:1,
                id:props2.data.id,
            },
        }
        path.pathname='/serviceclientwarnsetup';
        // this.props.history.push(path);

        this.state.serviceClientData = {
            data:{
                appId:props2.data.hardwareAppId,
                resouceName:props2.data.resouceName,
                resouceType:props2.data.resouceType,
                isSoftware:1,
                id:props2.data.id,
            }
        }
        this.setState({
            serviceClienSetUpBool:true,
            serviceClientData:this.state.serviceClientData
        })
    }

    /**
     * 返回
     * @returns {*}
     */
    backFun=()=>{
        let path={
            pathname:"warnsetuphardware"
        }
        this.props.history.push(path);
    }
    changePage =(key)=>{
        if(key==1){
            let path={
                pathname:'/warnsetuphardware'
            }
            this.props.history.push(path);
        }
    }

    handleOkadd2 = e => {
        console.log(e);
        this.child.onSubmit();
        this.setState({
            serviceClienSetUpBool: false,
        });
    };

    handleCanceladd2 = e => {
        console.log(e);
        this.setState({
            serviceClienSetUpBool: false,
        });
    };

    onRefv = (ref) => {
        this.child = ref
    }

    render() {
        return (
            <div id="sceneManagerDiv">
                <BreadcrumbCustom first="告警管理" second="告警设置" />

                <div className="sceneSetUpDiv">
                    <Tabs defaultActiveKey="1"  onChange={this.changePage} defaultActiveKey="2">
                        <TabPane tab="设备告警设置" key="1">

                        </TabPane>
                        <TabPane tab="软件告警设置" key="2">
                            <Table  locale={{ emptyText: '无数据'}} size={"small"} columns={this.columnsArray} dataSource={this.state.hardWareArray} bordered />
                        </TabPane>
                    </Tabs>
                </div>

                {
                    this.state.serviceClienSetUpBool ? (
                        <Modal
                            title="告警设置"
                            visible={true}
                            onCancel={this.handleCanceladd2}
                            footer={this.state.serviceClienSetUpBool?(
                                [
                                    <Button onClick={this.handleOkadd2}>确定</Button>,
                                    <Button onClick={this.handleCanceladd2}>取消</Button>
                                ]
                            ):null}
                            width="36%"
                        >
                            <ServiceClientWarnSetup onRefv={this.onRefv} onUpdataEquipment={this.getSoftWareResource}
                                                  dataSource={this.state.serviceClientData}></ServiceClientWarnSetup>
                        </Modal>
                    ):null
                }
            </div>
        )
    }
}
import React from 'react'
import {Tabs,Select,Table, Divider, Tag,Modal,Button,message} from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../../../utils/urls';
import {createHashHistory} from 'history';
const { TabPane } = Tabs;
const { Option } = Select;
import editBtn from "../../../../../images/icon/editbtn.png";
import delBtn from "../../../../../images/icon/delbtn.png";
import BreadcrumbCustom from "../../../../../components/BreadcrumbCustom";
import Editsoftwareresource from "../../softwaremanager/editsoftwareresource";
import  Editresourcegatherconf from './editresourcegatherconf';

export default class EquipmentParamsSetup extends React.Component {
    columnsArray = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },{
            title: '数据项',
            dataIndex: 'monitorTypeDictName',
            key: 'monitorTypeDictName',
        },{
            title: 'OID',
            dataIndex: 'oid',
            key: 'oid',
        },{
            title: '描述',
            dataIndex: 'remark',
            key: 'remark',
        },{
            title: '管理',
            key: 'tags',
            dataIndex: 'tags',
            render: (tags,data) => (
                <span>
            {tags.map((tag,index) => {
                if(index ==0){
                    return (
                        <span key={index}><a href="javascript:void(0);" onClick={this.actionClick.bind(this,{tag},{index},{data})}>{tag}</a>
                        <Divider type="vertical" /></span>
                    );
                }else{
                    return (
                        <span key={index}><a href="javascript:void(0);" onClick={this.actionClick.bind(this,{tag},{index},{data})}>{tag}</a></span>
                    );
                }
            })}
          </span>
            ),
        },
    ];
    constructor(props) {
        super(props);
        this.state = {
            tabsPostion:"1",//tabs选中索引
            hardWareArray:[],//硬件资源
            softWareArray:[],//软件资源
            resourceId:""
        };
    }

    componentDidMount() {
        console.log(this.props);
        if(this.props.location.state == null){
            let currentHardId = localStorage.getItem("currentHareId");
            this.state.resourceId = currentHardId;
            if(currentHardId){
                this.resourceGatherConf();
            }
            return;
        }
        if(this.props.location.state){
            this.setState({
                ...this.props.location.state.data
            })
            this.state.resourceId = this.props.location.state.data.id;
        }
        //获取数据项列表
        this.resourceGatherConf();
    }

    /**
     * 获取数据项列表
     * @returns
     */
    resourceGatherConf=()=> {
        console.log(this.state);
        axios.post(PATH.resourceGatherConf, {
            isSoftware:0,
            resourceId:this.state.resourceId
        })
            .then(response => {
                console.log(response);
                if (response.data.code == 0) {
                    let dataArray = response.data.data;
                    console.log(response.data.data);
                    for(let i = 0;i<dataArray.length;i++){
                        dataArray[i].key = i;
                        dataArray[i].tags = [];
                        dataArray[i].tags.push(<a title={'修改'}><img src={editBtn}/></a>);
                        dataArray[i].tags.push(<a title={'删除'}><img src={delBtn} /></a>);
                    }
                    if(dataArray.length>0){
                        console.log(dataArray);
                        this.setState({
                            hardWareArray:dataArray
                        })
                    }
                }
            });
    }

    /**
     * 获取软件列表
     * @returns {*}
     */
    getSoftWareResource(){
        axios.post(PATH.softwareResource, {
            // hardwareId: this.state.resourceArray[props].data[0].id
        }).then(response => {
            let dataArray = response.data.data;
        })
    }

    /**
     * 点击操作功能
     * @returns {*}
     */
    actionClick = (props0,props1,props2) => {
        console.log(props2);
        let path = {
            state:{
                ...props2
            },
        }
        switch (props1.index) {
            //修改
            case 0:

                this.setState({
                    EditresourcegatherData:props2,
                    clientAndServiceBooladd:true
                })
                path.pathname='/editresourcegatherconf';
                break;
            //删除
            case 1:
                Modal.confirm({
                    title: "提示",
                    content: '是否确认删除？',
                    onOk:this.delectAreaSceneFun.bind(this,props0,props1,props2),
                    okText: '确认',
                    cancelText: '取消',
                });
                this.props.history.push(path);
                break;
            default:
                break;
        }

    }

    /**
     * 删除区域场景
     * @returns {*}
     */
    delectAreaSceneFun(props0,props1,props2){
        console.log(props2);
        axios.post(PATH.resourceGatherConfRemove+"?ids="+props2.data.id,{
        },{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success(response.data.msg);
                //获取数据项列表
                this.resourceGatherConf();
            }else{
                message.error(response.data.msg);
            }
        })
    }

    /**
     * 添加数据项
     * @returns {*}
     */
    addSoftWareResource = () => {
        let path = {
            pathname:"editresourcegatherconf",
            state:{
                ...this.state
            }
        };
        this.setState({
            clientAndServiceBool:true,
            addSoftWareResourceData:{
                ...this.state
            }
        })
        //this.props.history.push(path);
    }

    /**
     * 返回
     * @returns {*}
     */
    backFun=()=>{
        let path={
            pathname:"equipmentmanager"
        }
        this.props.history.push(path);
    }
    handleOk = e => {
        console.log(e);
        this.child.onSubmits();
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
        this.child.onSubmits();
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

    onRefs = (ref) => {
        this.child = ref
    }


    render() {
        return (
            <div>
                <BreadcrumbCustom first="资源配置" second="管理设备参数" />
                <div className="shuJuXiangDiv">
                    <Button className="shuJuXiangBtn" onClick={this.addSoftWareResource} style={{display:this.state.selectOrButtonShow}}>添加数据项</Button>
                    <Button onClick={this.backFun} className="shuJuXiangBtn">返回</Button>
                </div>
                <Table locale={{ emptyText: '无数据'}}  size={"small"} className= "reasureManagerClass" columns={this.columnsArray} dataSource={this.state.hardWareArray} bordered />

                {
                    this.state.clientAndServiceBool?(
                        <Modal
                            title="添加数据项"
                            visible={true}
                            onCancel={this.handleCancel}
                            footer={this.state.clientAndServiceBool?(
                                [
                                    <Button onClick={this.handleOk}>确定</Button>,
                                    <Button onClick={this.handleCancel}>取消</Button>
                                ]
                            ):null}

                        >
                            <Editresourcegatherconf onRefs={this.onRefs} onUpdataEquipment={this.resourceGatherConf} dataSource={this.state.addSoftWareResourceData}></Editresourcegatherconf>
                        </Modal>
                    ):null
                }

                {
                    this.state.clientAndServiceBooladd?(
                        <Modal
                            title="修改"
                            visible={true}
                            onCancel={this.handleCanceladd}
                            footer={this.state.clientAndServiceBooladd?(
                                [
                                    <Button onClick={this.handleOkadd}>确定</Button>,
                                    <Button onClick={this.handleCanceladd}>取消</Button>
                                ]
                            ):null}
                        >
                            <Editresourcegatherconf onRefs={this.onRefs} onUpdataEquipment={this.resourceGatherConf} dataSource={this.state.EditresourcegatherData}></Editresourcegatherconf>
                        </Modal>
                    ):null
                }
            </div>
        )
    }
}
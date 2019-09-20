import React from 'react'
import {Tabs,Select,Table, Divider, Tag,Modal,Button,message,Switch} from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../../utils/urls';
import {createHashHistory} from 'history';
const { TabPane } = Tabs;
const { Option } = Select;
import BreadcrumbCustom from "../../../../components/BreadcrumbCustom";
import SearchBar from "../../../../components/searchbar";
import {SOFTWARETYPE} from "../../../../utils/config";
import edit from '../../../../images/operation/edit.png';
import  deletes from '../../../../images/operation/deletes.png';
import EditEquipmentResource from "../equipmentmanager/editequipmentresource";
import Editsoftwareresource from './editsoftwareresource';


export default class SoftWareManager extends React.Component {
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
            title: '软件类型',
            dataIndex: 'resouceTypeName',
            key: 'resouceTypeName',
        },{
            title: '软件名称',
            dataIndex: 'resouceName',
            key: 'resouceName',
        },{
            title: '所属设备',
            dataIndex: 'hardwareName',
            key: 'hardwareName',
            render:(text,record)=>{
                return <span>{text}({record.hardwareAppId})</span>
            }
        },{
            title: '开启采集',
            dataIndex: 'isCollect',
            key: 'isCollect',
            render:(text,record)=>{
                if(text == "1"){
                    return <Switch className="switchDiv" checked={true} disabled="true"/>

                }else{
                    return <Switch disabled="true" checked={false} ></Switch>
                }
            }
        },{
            title: '开启看护',
            dataIndex: 'isWatch',
            key: 'isWatch',
            render:(text,record)=>{
                if(text == "1"){
                    return <Switch className="switchDiv" checked={true}  disabled="true"/>

                }else{
                    return <Switch disabled="true" checked={false} ></Switch>
                }
            }
        },{
            title: '操作',
            key: 'tags',
            dataIndex: 'tags',
            render: (tags,data) => (
                <span>
            {tags.map((tag,index) => {
                if(index !=tags.length - 1){
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
            softWareArray:[],//软件资源
            hardWareId:"",
            hardWareAppId:"",
            resourceAddBool:false,//添加权限
            resourceRemoveBool:false,//删除权限
            resourceEditBool:false,//编辑权限
            addBtnVisible:false,//是否显示添加按钮
            queryInfo:{
                current:1,
                total2:10,
                pageSize:10
            },
            seachData:{//搜索
                resouceName:null,
                resouceType:null
            }
        };

        console.log(props)
        let hardWareId = "";
        let hardWareAppId="";
        if(props.location.state){
            if(props.location.state.status == "all"){
                hardWareId = null;
                hardWareAppId = "";
                localStorage.setItem("currentHareId","");
                localStorage.setItem("currentHareAppId","");
            }else{
                hardWareId = props.location.state.data.id;
                hardWareAppId = props.location.state.data.appId;
                this.state.addBtnVisible = true;
            }
        }else{
            if(localStorage.getItem("currentHareId")!=""){
                hardWareId = localStorage.getItem("currentHareId");
                hardWareAppId = localStorage.getItem("currentHareAppId");
                this.state.addBtnVisible = true;
            }else{
                hardWareId = null;
            }
        }

        this.state.hardWareId = hardWareId;
        this.state.hardWareAppId = hardWareAppId;

        //判断按钮权限
        let permList = localStorage.getItem("permList");
        if(permList.indexOf("pzgl:resource:add")>=0){
            this.state.resourceAddBool = true;
        }
        if(permList.indexOf("pzgl:resource:remove")>=0){
            this.state.resourceRemoveBool = true;
        }
        if(permList.indexOf("pzgl:resource:edit")>=0){
            this.state.resourceEditBool = true;
        }

        //获取软件列表
        this.getSoftWareResource(1);
    }

    componentDidMount() {

    }

    /**
     * 获取软件列表
     * @returns {*}
     */
    getSoftWareResource=(page)=>{
        let param = {
            current:page,
            size: 10,
            resouceName:this.state.seachData.resouceName,
            resouceType:this.state.seachData.resouceType,
            hardwareId: this.state.hardWareId
        }
        axios.post(PATH.softwareResourceList,param ).then(response => {
            console.log(response);
            if (response.data.code == 0) {
                let dataArray = response.data.data.records;
                console.log(response.data.data);
                for(let i = 0;i<dataArray.length;i++){
                    dataArray[i].key = i;
                    //0未开启，1：开启，2：未发现
                    dataArray[i].tags = [];
                    if(dataArray[i].serviceStatus == 0 || dataArray[i].serviceStatus == 1){
                        if(this.state.resourceEditBool){
                            dataArray[i].tags.push(<a title={"修改信息"}><img src={edit} /></a>);
                        }
                        // dataArray[i].tags.push("启动");
                        if(this.state.resourceRemoveBool){
                            dataArray[i].tags.push(<a title={"删除"}><img src={deletes} /></a>);
                        }
                        // dataArray[i].tags.push("重启");
                    }else{
                        if(this.state.resourceEditBool){
                            dataArray[i].tags.push(<a title={"修改信息"}><img src={edit} /></a>);
                        }
                        if(this.state.resourceRemoveBool){
                            dataArray[i].tags.push(<a title={"删除"}><img src={deletes} /></a>);
                        }
                    }
                }
                console.log(dataArray);
                this.setState({
                    softWareArray:dataArray,
                    queryInfo:{
                        total2: response.data.data.total,
                        pageSize:response.data.data.size,
                        current:response.data.data.current
                    }
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
        console.log(this.state);
        let path = {
            state:{
                ...props2,
                hardWareId:this.state.hardWareId,
                hardWareAppId:this.state.hardWareAppId
            },
        }
        switch (props0.tag.props.title) {
            //修改信息
            case "修改信息":
                this.setState({
                    clientAndServiceData:{
                        ...props2,
                        hardWareId:this.state.hardWareId,
                        hardWareAppId:this.state.hardWareAppId
                    },
                    clientAndServiceBool:true
                })
                //path.pathname=\'/editsoftwareresource';
                break;
            //启动
            case "启动":
                Modal.confirm({
                    title: "提示",
                    content: '是否确认启动？',
                    onOk:this.hardWareSwitch.bind(this,props2.data.id,35),
                    okText: '确认',
                    cancelText: '取消',
                });
                break;
            //删除
            case "删除":
                Modal.confirm({
                    title: "提示",
                    content: '是否确认删除？',
                    okText: '取消',
                    cancelText: '确认',
                    onCancel:this.delectAreaSceneFun.bind(this,props2),
                });
                break;
            //重启
            case "重启":
                Modal.confirm({
                    title: "提示",
                    content: '是否确认重启？',
                    onOk:this.hardWareSwitch.bind(this,props2.data.id,38),
                    okText: '确认',
                    cancelText: '取消',
                });
                break;
            default:
                break;
        }
        //this.props.history.push(path);
    }


    /**
     * 设备开关机
     * dealTypeDictId:33开机 34关机 35重启机器 36启动服务 37关闭服务 38重启服务
     * isSoftware:0是设备1 是软件
     */
    hardWareSwitch(resourceId,dealTypeDictId){
        axios.post(PATH.warnDeal,{
            dealTypeDictId:dealTypeDictId,
            isSoftware:1,
            resourceId:resourceId
        }).then(response=>{
            if(response.data.code == 0){
                message.success(response.data.msg)
            }else{
                message.error(response.data.msg)
            }
        });
    }

    /**
     * 删除区域场景
     * @returns {*}
     */
    delectAreaSceneFun(props2){
        console.log(props2);
        axios.post(PATH.softwareResourceRemove+"?ids="+props2.data.id,{
        },{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success(response.data.msg);
                //获取软件列表
                this.getSoftWareResource(1);
            }else{
                message.error(response.data.msg);
            }
        })
    }

    /**
     * 添加软件资源
     * @returns {*}
     */
    addSoftWareResource = () => {
        let id = "";
        if(this.state.softWareArray.length>0){
            id = this.state.softWareArray[0].id;
        }
        let path={
            pathname:"editsoftwareresource",
            state:{
                id:id,
                hardWareId:this.state.hardWareId,
                hardWareAppId:this.state.hardWareAppId
            }
        }
        this.setState({
            clientAndServiceBooladd:true,
            addSoftWareResourceData:{
                id:id,
                hardWareId:this.state.hardWareId,
                hardWareAppId:this.state.hardWareAppId
            }
        })
        // this.props.history.push(path);
    }

    /**
     * 从软件管理中跳转到设备管理
     * @returns {*}
     */
    goToHardWare=()=>{
        let path={
            pathname:'equipmentmanager'
        };
        this.props.history.push(path);
    }

    onSearch = (searchFields) => {
        console.log(searchFields);
        //查询获取设备列表
        let data = {};
        if(searchFields.resouceName!=""){
            data.resouceName = searchFields.resouceName;
        }
        if(searchFields.resouceType!=-1){
            data.resouceType = searchFields.resouceType;
        }
        this.state.seachData.resouceName = data.resouceName;
        this.state.seachData.resouceType = data.resouceType;
        this.getSoftWareResource(1);
    }

    searchFields = () => {
        return [{
            title: '软件名称',
            key: "resouceName",
            type: 'input',
            placeholder: "请输入软件名称"
        },{
            title: '软件类型',
            key: "resouceType",
            type: 'select',
            defaultValue:SOFTWARETYPE[0].name,
            items: () => SOFTWARETYPE.map(ele => ({
                value: ele.type,
                mean: ele.name
            })),
        }]
    }
    changePage =(key)=>{
        if(key==1){
            let path={
                pathname:'/equipmentmanager'
            }
            this.props.history.push(path);
        }
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

    onRef = (ref) => {
        this.child = ref
    }
    render() {
        return (
            <div id="sceneManagerDiv">
                <BreadcrumbCustom first="配置管理" second="资源管理" />

                <div className="sceneSetUpDiv">
                    <SearchBar
                        onSubmit={this.onSearch}
                        fields={this.searchFields()}
                    />
                    <Tabs defaultActiveKey="1" onChange={this.changePage} defaultActiveKey="2">
                        <TabPane tab="设备资源管理" key="1">

                        </TabPane>
                        <TabPane tab="软件资源管理" key="2">
                            {
                                this.state.addBtnVisible?(
                                    <Button onClick={this.addSoftWareResource} style={{display:this.state.selectOrButtonShow,marginBottom:"10px"}}>添加软件资源</Button>
                                ):null
                            }
                            <Table locale={{ emptyText: '无数据'}} size={"small"}
                                   className= "reasureManagerClass" columns={this.columnsArray}
                                   dataSource={this.state.softWareArray} bordered
                                   rowKey={record => record.key}
                                   pagination={{  // 分页
                                       pageSize: this.state.queryInfo.pageSize,  //显示几条一页
                                       current: this.state.queryInfo.current,//当前显示页
                                       total: this.state.queryInfo.total2,//数据总数量
                                       onChange: this.getSoftWareResource,//切换页数
                                   }}
                            />
                        </TabPane>
                    </Tabs>
                    {
                        this.state.clientAndServiceBool?(
                            <Modal
                                title="修改信息"
                                visible={true}
                                onCancel={this.handleCancel}
                                footer={this.state.clientAndServiceBool?(
                                    [
                                        <Button onClick={this.handleOk}>确定</Button>,
                                        <Button onClick={this.handleCancel}>取消</Button>
                                    ]
                                ):null}
                                width='36%'
                            >
                                <Editsoftwareresource onRef={this.onRef} onUpdataEquipment={this.getSoftWareResource} dataSource={this.state.clientAndServiceData}></Editsoftwareresource>
                            </Modal>
                        ):null
                    }

                    {
                        this.state.clientAndServiceBooladd?(
                            <Modal
                                title="添加软件资源"
                                visible={true}
                                onCancel={this.handleCanceladd}

                                footer={this.state.clientAndServiceBooladd?(
                                    [
                                        <Button onClick={this.handleOkadd}>确定</Button>,
                                        <Button onClick={this.handleCanceladd}>取消</Button>
                                    ]
                                ):null}
                                width='38%'
                            >
                                <Editsoftwareresource onRef={this.onRef} onUpdataEquipment={this.getSoftWareResource} dataSource={this.state.addSoftWareResourceData}></Editsoftwareresource>
                            </Modal>
                        ):null
                    }
                </div>
            </div>
        )
    }
}
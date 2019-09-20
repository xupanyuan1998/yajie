import React from 'react'
import './index.less';
import {Tabs,Select,Table, Divider, Tag,Modal,Button,message,Menu,Icon,Layout,Badge} from 'antd';
import axios from 'axios';
import {PATH} from '../../../../utils/urls';
import {HARDWARETYPE, LOGTYPE} from "../../../../utils/config";
import edit from '../../../../images/operation/edit.png';
import deletes from '../../../../images/operation/deletes.png';
import software from '../../../../images/operation/software.PNG';
import settings from '../../../../images/operation/Settings.PNG';
import EditEquipmentResource from './editequipmentresource';
import Addequipmentresource from './addequipmentresource';

const { Option } = Select;
const { TabPane } = Tabs;

import BreadcrumbCustom from "../../../../components/BreadcrumbCustom";
import SearchBar from "../../../../components/searchbar";

export default class EquipmentMangager extends React.Component {
    columnsArray = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key',
        },{
            title: '资源编号',
            dataIndex: 'appId',
            key: 'appId',
        },{
            title: '设备类型',
            dataIndex: 'resouceTypeName',
            key: 'resouceTypeName',
        },{
            title: '设备名称',
            dataIndex: 'resouceName',
            key: 'resouceName',
        },{
            title: 'IP地址',
            dataIndex: 'resouceIp',
            key: 'resouceIp',
        },{
            title: '所属场景',
            dataIndex: 'sceneName',
            key: 'sceneName',
            render:(text,record)=>{
                if(text !=null){
                    return <span>{text}</span>
                }else{
                    return <span>--</span>
                }
            }
        },{
            title: '操作',
            key: 'tags',
            dataIndex: 'tags',
            render: (tags,data) => (
                <div className="equiptmentTagsDiv">
            {tags.map((tag,index) => {
                if(index < tags.length-1){
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
          </div>
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
            selectOrButtonShow:true,//当为ture：显示设备下拉列表，false:显示添加软件按钮
            resourceAddBool:false,//添加权限
            resourceRemoveBool:false,//删除权限
            resourceEditBool:false,//编辑权限
            queryInfo:{
                current:1,
                total2:10,
                pageSize:10
            },
            seachData:{
                resouceName:null,
                resouceType:null,
                appId:null
            },
            clientAndServiceBool:false,
            clientAndServiceData:null,
            selectEquiptmentType:0
        };
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
    }

    componentDidMount() {
        //获取设备列表
        this.getHardWareResource(1);
    }

    /**
     * 获取设备列表
     * @returns
     */
    getHardWareResource=(page)=> {
        let param = {
            current:page,
            size: 10,
            resouceName:this.state.seachData.resouceName,
            resouceType:this.state.seachData.resouceType,
            appId:this.state.seachData.appId,
        }
        axios.post(PATH.hardwareResourceList, param)
            .then(response => {
                console.log(response);
                if (response.data.code == 0) {
                    let dataArray = response.data.data.records;
                    for(let i = 0;i<dataArray.length;i++){
                        dataArray[i].key = i+1;
                        //0和1为服务器、客户端，
                        dataArray[i].tags = [];
                        if(dataArray[i].resouceType == 0 || dataArray[i].resouceType == 1){
                            if(this.state.resourceEditBool){
                                dataArray[i].tags.push(<a title={'修改信息'}><img src={edit}/></a>);
                                dataArray[i].tags.push(<a title={'软件资源管理'}><img src={software} /></a>);
                            }
                            // if(this.state.resourceRemoveBool){
                            //     dataArray[i].tags.push("");
                            // }
                        }else{
                            if(this.state.resourceEditBool){
                                dataArray[i].tags.push(<a title={'修改信息'}><img src={edit}/></a>);
                                dataArray[i].tags.push(<a title={'参数设置'}><img src={settings} /></a>);
                            }
                            if(this.state.resourceRemoveBool){
                                dataArray[i].tags.push(<a title={'删除'}><img src={deletes} /></a>);
                                //<img src={deletes}/>
                            }
                        }
                    }
                    console.log(dataArray);
                    this.setState({
                        hardWareArray:dataArray,
                        queryInfo:{
                            total2: response.data.data.total,
                            pageSize:response.data.data.size,
                            current:response.data.data.current
                        }
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
                ...props2
            },
        }

        localStorage.setItem("currentHareId",props2.data.id);
        localStorage.setItem("currentHareAppId",props2.data.appId);
        console.log(path);
        switch (props0.tag.props.title) {
            //修改信息
            case "修改信息":
                //客户端和服务器
                if(props2.data.resouceType == 0 || props2.data.resouceType == 1){
                    this.setState({
                        clientAndServiceData:props2,
                        clientAndServiceBool:true
                    })
                }else{//UPS、路由器、交换机
                    this.setState({
                        clientAndServiceDataadd:props2,
                        clientAndServiceBooladd:true
                    })
                }

                break;
            //管理软件资源
            case "软件资源管理":
                path.pathname='/softwaremanager';
                this.props.history.push(path);
                break;
            //管理软件资源
            case "参数设置":
                path.pathname='/equipmentparamssetup';
                this.props.history.push(path);
                break;
            //删除
            case "删除":
                Modal.confirm({
                    title: "提示",
                    content: '是否确认删除？',
                    okText: '取消',
                    cancelText: '确认',
                    onCancel:this.delectAreaSceneFun.bind(this,props0,props1,props2),
                });
                break;
            default:
                break;
        }

    }

    /**
     * 删除资源
     * @returns {*}
     */
    delectAreaSceneFun(props0,props1,props2){
        console.log(props2);
        axios.post(PATH.removeHareWareResource+"?ids="+props2.data.id,{

        },{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success(response.data.msg);
                //获取设备列表
                this.getHardWareResource(1);
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
        console.log(123);
    }

    /**
     * 点击tab跳转到软件资源管理
     * @returns {*}
     */
    goToSoftWare=()=>{
        let path = {
            pathname:'softwaremanager',
            state:{
                status:"all"
            }
        };
        this.props.history.push(path);
    }

    /**
     * 设备select的切换事件
     * @param tabPosition
     */
    changeSelectPosition = selectPosition => {
        // this.setState({ selectPosition:selectPosition });
        // console.log(selectPosition);
        let path = {
            pathname:"addequipmentresource",
            state:{
                resouceType:selectPosition
            }
        }

        this.setState({
            selectEquiptmentType:{resouceType:selectPosition},
            equipmentBooladd:true
        })

        // this.props.history.push(path);
    };

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
        if(searchFields.resouceName!=""){
            data.appId = searchFields.appId;
        }
        this.state.seachData.resouceName = data.resouceName;
        this.state.seachData.resouceType = data.resouceType;
        this.state.seachData.appId = data.appId;

        this.getHardWareResource(1);
    }

    searchFields = () => {
        return [{
            title: '设备名称',
            key: "resouceName",
            type: 'input',
            placeholder: "请输入设备名称"
        },{
            title: '设备类型',
            key: "resouceType",
            type: 'select',
            defaultValue:HARDWARETYPE[0].name,
            items: () => HARDWARETYPE.map(ele => ({
                value: ele.type,
                mean: ele.name
            })),
        },{
            title: '资源编号',
            key: "appId",
            type: 'input',
            placeholder: "请输入资源编号"
        }]
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

    handleOkadd2 = e => {
        console.log(e);
        this.child.onSubmit();
        this.setState({
            equipmentBooladd: false,
        });
    };

    handleCanceladd2 = e => {
        console.log(e);
        this.setState({
            equipmentBooladd: false,
        });
    };

    changePage =(key)=>{
        localStorage.setItem("currentHareId","");
        if(key==2){
            let path={
                pathname:'/softwaremanager'
            }
            this.props.history.push(path);
        }
    }

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
                    <Tabs defaultActiveKey="1"  onChange={this.changePage} defaultActiveKey="1">
                        <TabPane tab="设备资源管理" key="1">
                            <div className="addTitleCss">
                                <Select
                                    value={this.state.selectPosition}
                                    onChange={this.changeSelectPosition}
                                    dropdownMatchSelectWidth={false}
                                    style={{display:(this.state.selectOrButtonShow?"inline-block":"none")}}
                                    className="resourceAddSelect1"
                                >
                                    <Option value={0} style={{display:"none"}}>添加设备</Option>
                                    <Option value={2}>添加UPS</Option>
                                    <Option value={3}>添加路由器</Option>
                                    <Option value={4}>添加交换机</Option>
                                </Select>
                                <Button onClick={this.addSoftWareResource} style={{display:(this.state.selectOrButtonShow?"none":"inline-block")}}>添加软件资源</Button>
                            </div>
                            <Table locale={{ emptyText: '无数据'}} size={"small"} className= "reasureManagerClass"
                                   columns={this.columnsArray} dataSource={this.state.hardWareArray} bordered
                                   rowKey={record => record.key}
                                   pagination={{  // 分页
                                       pageSize: this.state.queryInfo.pageSize,  //显示几条一页
                                       current: this.state.queryInfo.current,//当前显示页
                                       total: this.state.queryInfo.total2,//数据总数量
                                       onChange: this.getHardWareResource,//切换页数
                                   }}/>
                        </TabPane>
                        <TabPane tab="软件资源管理" key="2">
                            {/*<Table locale={{ emptyText: '无数据'}} size={"small"}
                                   className= "reasureManagerClass" columns={this.columnsArray}
                                   dataSource={this.state.softWareArray} bordered
                                   rowKey={record => record.key}
                                   pagination={{  // 分页
                                       pageSize: this.state.queryInfo.pageSize,  //显示几条一页
                                       current: this.state.queryInfo.current,//当前显示页
                                       total: this.state.queryInfo.total2,//数据总数量
                                       onChange: this.getSoftWareResource,//切换页数
                                   }}
                            />*/}
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
                                width="34%"
                            >
                                <EditEquipmentResource onRef={this.onRef} onUpdataEquipment={this.getHardWareResource} dataSource={this.state.clientAndServiceData}></EditEquipmentResource>
                            </Modal>
                        ):null
                    }

                    {
                        this.state.clientAndServiceBooladd ? (
                            <Modal
                                title="修改信息"
                                visible={true}
                                onCancel={this.handleCanceladd}
                                footer={this.state.clientAndServiceBooladd?(
                                    [
                                        <Button onClick={this.handleOkadd}>确定</Button>,
                                        <Button onClick={this.handleCanceladd}>取消</Button>
                                    ]
                                ):null
                                }
                                width="36%"
                            >
                                <Addequipmentresource onRef={this.onRef} onUpdataEquipment={this.getHardWareResource}
                                                      dataSource={this.state.clientAndServiceDataadd}></Addequipmentresource>
                            </Modal>
                        ):null
                    }

                    {
                        this.state.equipmentBooladd ? (
                            <Modal
                                title="添加设备"
                                visible={true}
                                onCancel={this.handleCanceladd2}

                                footer={this.state.equipmentBooladd?(
                                    [
                                        <Button onClick={this.handleOkadd2}>确定</Button>,
                                        <Button onClick={this.handleCanceladd2}>取消</Button>
                                    ]
                                ):null}
                                width="36%"
                            >
                                <Addequipmentresource onRef={this.onRef} onUpdataEquipment={this.getHardWareResource}
                                                      dataSource={this.state.selectEquiptmentType}></Addequipmentresource>
                            </Modal>
                        ):null
                    }
                </div>
            </div>
        )
    }
}
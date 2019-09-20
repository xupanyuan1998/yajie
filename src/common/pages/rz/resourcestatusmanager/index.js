import React from 'react'
import {Tabs,Select,Table, Modal, Tagm,message} from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../utils/urls';
import SearchBar from '../../../components/searchbar'
const { TabPane } = Tabs;
const { Option } = Select;
import moment from 'moment'
import {languageKindList, musicKindList, publishCountry, LOGTYPE, formatDate} from "../../../utils/config";
import BreadcrumbCustom from "../../../components/BreadcrumbCustom";

export default class Resourcestatusmanager extends React.Component {
    columnsArray = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width:120,
            fixed:'left',
        },{
            title: '资源编号',
            dataIndex: 'appId',
            key: 'appId',
            width:180,
            fixed:'left',
        },
        {
            title: '名称',
            dataIndex: 'resourceName',
            key: 'resourceName',
            width:170,
            fixed:'left',
        },
        {
            title: '类型',
            dataIndex: 'resourceTypeName',
            key: 'resourceTypeName',
            width:120,
        },
        {
            title: 'CPU利用率',
            key: 'cpuRate',
            dataIndex: 'cpuRate',
            width:120,
            render:(text,record)=>{
                if(text !=null){
                    return <span>{text}</span>
                }else{
                    return <span>--</span>
                }
            }
        },
        {
            title: '内存利用率',
            key: 'memoryRate',
            dataIndex: 'memoryRate',
            width:120,
            render:(text,record)=>{
                if(text !=null){
                    return <span>{text}</span>
                }else{
                    return <span>--</span>
                }
            }
        },
        {
            title: '硬盘利用率',
            key: 'disk',
            dataIndex: 'disk',
            width:120,
            render:(text,record)=>{
                if(text !=null){
                    return <span>{text}</span>
                }else{
                    return <span>--</span>
                }
            }
        },
        {
            title: '网络IO',
            key: 'io',
            dataIndex: 'io',
            width:120,
            render:(text,record)=>{
                if(text !=null){
                    return <span>{text}</span>
                }else{
                    return <span>--</span>
                }
            }
        },
        {
            title: '状态',
            key: 'serviceStatusName',
            dataIndex: 'serviceStatusName',
            width:120,
            render:(text,record)=>{
                if(text !=null){
                    return <span>{text}</span>
                }else{
                    return <span>--</span>
                }
            }
        },
        {
            title: '电压',
            key: 'voltage',
            dataIndex: 'voltage',
            width:120,
            render:(text,record)=>{
                if(text !=null){
                    return <span>{text}</span>
                }else{
                    return <span>--</span>
                }
            }
        },
        {
            title: '电流',
            key: 'electric',
            dataIndex: 'electric',
            width:120,
            render:(text,record)=>{
                if(text !=null){
                    return <span>{text}</span>
                }else{
                    return <span>--</span>
                }
            }
        },
        {
            title: '剩余电量',
            key: 'remainingBattery',
            dataIndex: 'remainingBattery',
            width:120,
            render:(text,record)=>{
                if(text !=null){
                    return <span>{text}</span>
                }else{
                    return <span>--</span>
                }
            }
        },
        {
            title: '备用电源',
            key: 'standbyPower',
            dataIndex: 'standbyPower',
            width:120,
            render:(text,record)=>{
                if(text !=null){
                    return <span>{text}</span>
                }else{
                    return <span>--</span>
                }
            }
        },
        {
            title: '有功功率',
            key: 'activePower',
            dataIndex: 'activePower',
            width:120,
            render:(text,record)=>{
                if(text !=null){
                    return <span>{text}</span>
                }else{
                    return <span>--</span>
                }
            }
        },
        {
            title: '无功功率',
            key: 'reactivePower',
            dataIndex: 'reactivePower',
            width:120,
            render:(text,record)=>{
                if(text !=null){
                    return <span>{text}</span>
                }else{
                    return <span>--</span>
                }
            }
        },
        {
            title: '端口带宽',
            key: 'interfaceBandwidth',
            dataIndex: 'interfaceBandwidth',
            width:120,
            render:(text,record)=>{
                if(text !=null){
                    return <span>{text}</span>
                }else{
                    return <span>--</span>
                }
            }
        },

        {
            title: '更新时间',
            key: 'createTime',
            dataIndex: 'createTime',
            render:(text,record)=>{
                if(text !=null){
                    return <span>{text}</span>
                }else{
                    return <span>--</span>
                }
            }
        }
    ];




    constructor(props) {
        super(props);
        this.state = {
            resourceStatusArray:[],
            queryInfo:{
                current:1,
                total2:10,
                pageSize:20
            },
            tableDetailList:[],
            param:{
                resourceName:"",
                pageNum: 1,
                pageSize: 20,
            },
            seachData:{
                resourceType:null,
                appId:null,
                createTimeBegin:null,
                createTimeEnd:null,
            },
            deleteIds:"",//删除的id数据
            selectedRowKeys:[]
        };
    }

    componentWillMount() {
        let endTime=new Date();
        let endTime0=new Date();
        let startTime=endTime0.setDate(endTime0.getDate()-7);
        this.setState({
            createTimeBegin:formatDate(new Date(startTime).getTime()),
            createTimeEnd:formatDate(endTime.getTime())
        },()=>{
            console.log(this.state);
            this.changePage(1);
        })
    }
    /**
     * 点击操作功能
     * @returns {*}
     */
    actionClick = (props0,props1) => {
        let path = {
            pathname:'/changehardwareresource',
            state:{
                appId:this.state.hardWareArray[parseInt(props1.index)].appId,
                name:this.state.hardWareArray[parseInt(props1.index)].resourceName,
                resouceType:this.state.hardWareArray[parseInt(props1.index)].resouceType
            },
        }
        this.props.history.push(path);
    }

    onSearch = (searchFields) => {
        console.log(searchFields);
        let type = searchFields.type;
        let appId = searchFields.appId;
        let start = null;
        let end = null;
        if(type == -1){
            type = null;
        }
        if(appId == ""){
            appId = null;
        }
        if(searchFields.start){
            start = moment(searchFields.start).format('YYYY-MM-DD');
        }
        if(searchFields.end){
            end = moment(searchFields.end).format('YYYY-MM-DD');
        }
        this.state.seachData.resourceType = type;
        this.state.seachData.appId = appId;
        this.state.seachData.createTimeBegin = start;
        this.state.seachData.createTimeEnd = end;
        this.changePage();
    }

    searchFields = () => {
        return [{
            title: '资源编号',
            key: 'appId',
            type: 'input',
            defaultValue: LOGTYPE[0].name,
            placeholder: "请输入资源编号"
        }, {
            title: '分类',
            key: 'type',
            type: 'select',
            defaultValue: LOGTYPE[0].name,
            items: () => LOGTYPE.map(ele => ({
                value: ele.type,
                mean: ele.name
            })),
        }, {
            title: '开始日期',
            key: "start",
            type: 'date',
            defaultValue: moment(this.state.createTimeBegin, 'YYYY-MM-DD'),
        }, {
            title: '结束日期',
            key: "end",
            type: 'date',
            defaultValue: moment(this.state.createTimeEnd, 'YYYY-MM-DD')
        }]
    }

    /**
     * 切换页数
     * @param page
     */
    changePage = (page) => {
        console.log(page);
        let param = {
            current:page,
            size: 20,
            resourceType:this.state.seachData.resourceType,
            appId:this.state.seachData.appId,
            createTimeBegin:this.state.seachData.createTimeBegin,
            createTimeEnd:this.state.seachData.createTimeEnd
        }
        axios.post(PATH.resourceStatusList,param).then(response=>{
            console.log(response);
            this.setState({
                tableDetailList:response.data.data.records,
                queryInfo:{
                    total2: response.data.data.total,
                    pageSize:response.data.data.size,
                    current:response.data.data.current
                }
            })
        })
    }

    handleDelete=()=>{
        Modal.confirm({
            title: "提示",
            content: '删除后不可恢复,是否确认删除？',
            okText: '取消',
            cancelText: '确认',
            onCancel:this.deleteResource.bind(this),
        });
    }

    deleteResource=()=>{
        if(this.state.deleteIds == ""){
            message.error("请选择要删除的日志！");
            return;
        }
        axios.post(PATH.resourceStatusListDelete+"?ids="+this.state.deleteIds,{
        },{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success("删除成功！");
                this.changePage();
                this.setState({
                    selectedRowKeys:[]
                })
            }else{
                message.error(response.data.msg);
            }
        })
    }

    handleAllDelete=()=>{
        Modal.confirm({
            title: "提示",
            content: '删除后不可恢复,是否确认删除？',
            okText: '取消',
            cancelText: '确认',
            onCancel:this.deleteAllResource.bind(this),
        });
    }

    deleteAllResource=()=>{
        console.log(this.state.seachData);
        axios.post(PATH.resourceStatusListAllDelete,{
            "resourceType":this.state.seachData.resourceType,
            "appId":this.state.seachData.appId,
            "createTimeBegin":this.state.seachData.createTimeBegin,
            "createTimeEnd":this.state.seachData.createTimeEnd,
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success("列表中监控日志已全部删除！");
                this.changePage();
                this.setState({
                    selectedRowKeys:[]
                })
            }else{
                message.error(response.data.msg);
            }
        })
    }

    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({
                    selectedRowKeys:selectedRowKeys
                });
                this.state.deleteIds = "";
                for(let i = 0;i<selectedRows.length;i++){
                    if(i!=selectedRowKeys.length - 1){
                        this.state.deleteIds = this.state.deleteIds+selectedRows[i].id+",";
                    }else{
                        this.state.deleteIds = this.state.deleteIds+selectedRows[i].id;
                    }
                }

                console.log(this.state.deleteIds);
            },
            getCheckboxProps: record => ({
                disabled: record.serviceStatusName === '预警中', // Column configuration not to be checked
                name: record.name,
            }),
        };
        return (
            <div id="sceneManagerDiv">
                <BreadcrumbCustom first="日志管理" second="监控日志" />
                <div className="sceneSetUpDiv">
                    <SearchBar
                        onSubmit={this.onSearch}
                        fields={this.searchFields()}
                        deleteBtn="true"
                        allDeleteBtn="true"
                        handleDelete={this.handleDelete}
                        handleAllDelete={this.handleAllDelete}
                    />
                    <Table
                        rowSelection={rowSelection}
                        locale={{ emptyText: '无数据'}}
                        size={"small"}
                        scroll={{ x: 2300, y: 580 }}
                        bordered dataSource={this.state.tableDetailList}
                        columns={this.columnsArray}
                        rowKey={record => record.key}
                        pagination={{  // 分页
                            pageSize: this.state.queryInfo.pageSize,  //显示几条一页
                            current: this.state.queryInfo.current,//当前显示页
                            total: this.state.queryInfo.total2,//数据总数量
                            onChange: this.changePage,//切换页数
                        }}
                    />
                </div>
            </div>
        )
    }
}
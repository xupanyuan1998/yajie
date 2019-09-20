import React from 'react'
import {Table, Modal, Tagm,message} from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../utils/urls';
import SearchBar from '../../../components/searchbar'
import moment from 'moment';
import {LOGTYPE,formatDate} from "../../../utils/config";
import BreadcrumbCustom from "../../../components/BreadcrumbCustom";

export default class Warnlogmanager extends React.Component {
    columnsArray = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '资源编号',
            dataIndex: 'appId',
            key: 'appId',
        },
        {
            title: '设备名称',
            dataIndex: 'resourceName',
            key: 'resourceName',
        },
        {
            title: '设备类型',
            dataIndex: 'resourceTypeName',
            key: 'resourceTypeName',
        },
        {
            title: '预警状态',
            key: 'warmStatusName',
            dataIndex: 'warmStatusName'
        },
        {
            title: '预警开始时间',
            key: 'warnBeginTime',
            dataIndex: 'warnBeginTime',
            render:(text,record)=>{
                if(text){
                    return (
                        <div>
                            {moment(text).format('YYYY-MM-DD HH:mm:ss')}
                        </div>
                    )
                }else{
                    return <span>--</span>
                }
            }
        },
        {
            title: '预警结束时间',
            key: 'warmEndTime',
            dataIndex: 'warmEndTime',
            render:(text,record)=>{
                if(text){
                    return (
                        <div>
                            {moment(text).format('YYYY-MM-DD HH:mm:ss')}
                        </div>
                    )
                }else{
                    return <span>--</span>
                }
            }
        },
        {
            title: '备注',
            key: 'remark',
            dataIndex: 'remark',
        },

        {
            title: 'IP',
            key: 'resourceIp',
            dataIndex: 'resourceIp',
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
            param:{
                resourceName:"",
                pageNum: 1,
                pageSize: 20,
            },
            resourceName:null,
            resourceType:null,
            appId:null,
            createTimeBegin:null,
            createTimeEnd:null,
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

    onSearch = (searchFields) => {
        console.log(searchFields);
        let type = searchFields.type;
        let resourceName=searchFields.resourceName;
        let appId = searchFields.appId;
        let start = null;
        let end = null;
        if(type == -1){
            type = null;
        }
        if(appId == ""){
            appId = null;
        }
        if(resourceName == ""){
            resourceName = null;
        }
        if(searchFields.start){
            start = moment(searchFields.start).format('YYYY-MM-DD');
        }
        if(searchFields.end){
            end = moment(searchFields.end).format('YYYY-MM-DD');
        }
        this.setState({
            resourceName:resourceName,
            resourceType:type,
            appId:appId,
            createTimeBegin:start,
            createTimeEnd:end
        },()=>{
            this.changePage(1);
        })
    }

    searchFields = () => {
        return [{
            title: '设备名称',
            key: 'resourceName',
            type: 'input',
            defaultValue: LOGTYPE[0].name,
            placeholder: "请输入设备名称"
        }, {
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
        let param = {
            current:page,
            size: 20,
            resourceName:this.state.resourceName,
            resourceType:this.state.resourceType,
            appId:this.state.appId,
            createTimeBegin:this.state.createTimeBegin,
            createTimeEnd:this.state.createTimeEnd
        }
        console.log(param);
        axios.post(PATH.warnLogList,param).then(response=>{
            console.log(response);
            this.setState({
                resourceStatusArray:response.data.data.records,
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
            content: '删除后不可恢复,正在预警中不能删除,是否确认删除？',
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
        axios.post(PATH.warnLogListDelete+"?ids="+this.state.deleteIds,{
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
            content: '删除后不可恢复,正在预警中不能删除,是否确认删除？',
            okText: '取消',
            cancelText: '确认',
            onCancel:this.deleteAllResource.bind(this),
        });
    }

    deleteAllResource=()=>{
        axios.post(PATH.warnLogListAllDelete,{
            "resourceType":this.state.resourceType,
            "appId":this.state.appId,
            "resourceName":this.state.resourceName,
            "createTimeBegin":this.state.createTimeBegin,
            "createTimeEnd":this.state.createTimeEnd,
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success("除“预警中”日志无法删除外，列表中告警日志已全部删除！");
                this.changePage();
                this.setState({
                    selectedRowKeys:[]
                })
            }else{
                message.error(response.data.msg);
            }
        })
    }

    /**
     * 预警中日志不可删除
     */
    checkWarnLing=()=>{
        let warnList = this.state.deleteIds.split(",");
        let bool= false;
        for(let i = 0;i<this.state.resourceStatusArray.length;i++){
            for(let k = 0;k<warnList.length;k++){
                if(this.state.resourceStatusArray[i].id == warnList[k]){
                    if(this.state.resourceStatusArray[i].warmStatus == 1){
                        message.error("预警中日志不可删除!");
                        bool = true;
                        break;
                    }
                }
            }
            if(bool){
                break;
            }
        }
    }

    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.state.selectedRowKeys = selectedRowKeys;
                this.setState({
                    selectedRowKeys:this.state.selectedRowKeys
                });
                this.state.deleteIds = "";
                for(let i = 0;i<selectedRows.length;i++){
                    if(i!=selectedRowKeys.length - 1){
                        this.state.deleteIds = this.state.deleteIds+selectedRows[i].id+",";
                    }else{
                        this.state.deleteIds = this.state.deleteIds+selectedRows[i].id;
                    }
                }
                this.checkWarnLing();
                console.log(this.state.deleteIds);
            },
            getCheckboxProps: record => ({
                disabled: record.warmStatusName==="预警中"
            }),
        };
        return (
            <div id="sceneManagerDiv">
                <BreadcrumbCustom first="日志管理" second="告警日志" />
                <div className="sceneSetUpDiv">

                    <SearchBar
                        onSubmit={this.onSearch}
                        fields={this.searchFields()}
                        deleteBtn="true"
                        allDeleteBtn="true"
                        handleDelete={this.handleDelete}
                        handleAllDelete={this.handleAllDelete}
                    />

                    <Table  locale={{ emptyText: '无数据'}} size={"small"} bordered dataSource={this.state.resourceStatusArray}
                            columns={this.columnsArray}
                            rowSelection={rowSelection}
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
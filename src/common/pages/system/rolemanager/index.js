import React from 'react'
import {Tabs,Select,Table, Divider,message,Modal,Input,Tree,Button} from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../utils/urls';
import SearchBar from '../../../components/searchbar'
const { TabPane } = Tabs;
const { Option } = Select;
import {languageKindList, musicKindList, publishCountry} from "../../../utils/config";
import moment from 'moment';
import BreadcrumbCustom from "../../../components/BreadcrumbCustom";
import  deletes from '../../../images/operation/deletes.png';
import  edit from '../../../images/operation/edit.png';
import  lookBtn from '../../../images/icon/lookbtn.png';
import  grantBtn from '../../../images/icon/grantbtn.png';

const { TreeNode } = Tree;
export default class Rolemanager extends React.Component {
    columnsArray = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key',

        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
        },
        /**
         {
        title: '角色key',
        dataIndex: 'roleKey',
        key: 'roleKey',
    },
         */
        {
            title: '角色状态',
            dataIndex: 'status',
            key: 'status',
            render:(text,record)=>{
                if(text == 0){
                    return (<span>正常</span>)
                }else{
                    return (<span>停用</span>)
                }
            }
        },
        {
            title: '添加时间',
            key: 'createTime',
            dataIndex: 'createTime',
        },{
            title:"操作",
            key:"tags",
            dataIndex: 'tags',
            render: (tags,data) => (
                <span>
            {tags.map((tag,index) => {
                if(index !=3){
                    return (
                        <span key={index}><a href="javascript:void(0);" onClick={this.actionClick.bind(this,index,data,tag)}>{tag}</a>
                        <Divider type="vertical" /></span>
                    );
                }else{
                    return (
                        <span key={index}><a href="javascript:void(0);" onClick={this.actionClick.bind(this,index,data,tag)}>{tag}</a></span>
                    );
                }
            })}
          </span>
            ),
        }
    ];
    constructor(props) {
        super(props);
        this.state = {
            resourceStatusArray:[],
            //分页参数
            queryInfo:{
                current:1,
                total2:10,
                pageSize:10
            },
            //编辑
            editData:{
                roleName:"",
                status:"",
                roleId:""
            },
            editBtnBool:true,//弹出窗确定按钮是否可以点击
            showEditModal: false,//控制编辑弹出窗显示
            addOrEdit:-1,//0为添加角色，1为修改角色
            modalTitle:"",//编辑角色的标题内容
            showEmpower:false,//授权界面显示
            editEmpowerId:-1,//修改授权选中的角色id
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            roleTreeData:null,
            //按钮权限
            roleAddBool:false,//增加
            roleEditBool:false,//编辑
            roleRemoveBool:false,//删除
            roleListBool:false,//查看
            roleAuthBool:false,//授权
            seachData:{
                roleName:null,
                createTimeBegin:null,
                createTimeEnd:null
            }
        };
        //判断按钮权限
        let permList = localStorage.getItem("permList");
        if(permList){
            if(permList.indexOf("system:role:remove")>=0){
                this.state.roleRemoveBool = true;
            }
            if(permList.indexOf("system:role:auth")>=0){
                this.state.roleAuthBool = true;
            }
            if(permList.indexOf("system:role:list")>=0){
                this.state.roleListBool = true;
            }
            if(permList.indexOf("system:role:edit")>=0){
                this.state.roleEditBool = true;
            }
            if(permList.indexOf("system:role:add")>=0){
                this.state.roleAddBool = true;
            }
        }

        //获取角色数据列表
        this.changePage(1);
    }

    /**
     * 点击操作功能
     * @returns {*}
     */
    actionClick = (index,props,tag) => {
        console.log(props);
        console.log(tag);
        switch (tag.props.title) {
            //查看信息
            case "查看":
                this.state.editData.roleName = props.roleName;
                this.state.editData.status = props.status;
                this.state.editData.roleId = props.roleId;
                this.setState({
                    editData:this.state.editData,
                    showEditModal: true,
                    addOrEdit:1,
                    modalTitle:"查看角色",
                    editBtnBool:false,
                });
                break;
            //修改信息
            case "编辑":
                this.state.editData.roleName = props.roleName;
                this.state.editData.status = props.status;
                this.state.editData.roleId = props.roleId;
                this.setState({
                    editData:this.state.editData,
                    showEditModal: true,
                    addOrEdit:1,
                    modalTitle:"编辑角色",
                    editBtnBool:true,
                });
                break;
            //删除
            case "删除":
                Modal.confirm({
                    title: "提示",
                    content: '是否确认删除？',
                    okText: '取消',
                    cancelText: '确认',
                    onCancel:this.delectAreaSceneFun.bind(this,props),
                });
                break;
            //授权
            case "授权":
                //获取权限
                this.getRoleMenuRoleData(props.roleId);
                this.setState({
                    showEmpower:true,
                    editEmpowerId:props.roleId
                })
                break;
            default:
                break;
        }

    }

    /**
     * 删除
     * @returns {*}
     */
    delectAreaSceneFun(props){
        axios.post(PATH.delectRole+"?ids="+props.roleId,{
        },{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
            .then(response=>{
                if(response.data.code == 0){
                    message.success(response.data.msg);
                    //获取角色数据列表
                    this.changePage(1);
                }else{
                    message.error(response.data.msg);
                }
            })
    }

    /**
     * 点击搜索
     * @param searchFields
     */
    onSearch = (searchFields) => {
        let props0 = searchFields.roleName;
        let start = null;
        let end = null;
        if(props0 == -1){
            props0 = null;
        }
        if(searchFields.start){
            start = moment(searchFields.start).format('YYYY-MM-DD');
        }
        if(searchFields.end){
            end = moment(searchFields.end).format('YYYY-MM-DD');
        }
        this.state.seachData.roleName = props0;
        this.state.seachData.createTimeBegin = start;
        this.state.seachData.createTimeEnd = end;
        this.changePage(1);
    }

    /**
     * 搜索内容
     * @returns {*[]}
     */
    searchFields = () => {
        return [{
            title: '角色名称',
            key: 'roleName',
            type: 'input',
            labelWidth:80,
            placeholder:"请输入角色名称"
        }
            , {
                title: '开始日期',
                key: "start",
                type: 'date',
                defaultValue: "",
                labelWidth:80
            }, {
                title: '结束日期',
                key: "end",
                type: 'date',
                defaultValue: "",
                labelWidth:80
            }]
    }

    /**
     * 切换页数
     * @param page
     */
    changePage = (page) => {
        let param = {
            current:page,
            size: 10,
            roleName:this.state.seachData.roleName,
            createTimeBegin:this.state.seachData.createTimeBegin,
            createTimeEnd:this.state.seachData.createTimeEnd
        }
        axios.post(PATH.roleList,param).then(response=>{
            console.log(response);
            let actionArray = [];
            if(this.state.roleListBool){
                actionArray.push(<a title={'查看'}><img src={lookBtn} /></a>);
            }
            if(this.state.roleEditBool){
                actionArray.push(<a title={'编辑'}><img src={edit} /></a>);
            }
            if(this.state.roleAuthBool){
                actionArray.push(<a title={'授权'}><img src={grantBtn} /></a>);
            }
            if(this.state.roleRemoveBool){
                actionArray.push(<a title={'删除'}><img src={deletes} /></a>);
            }
            for(let i = 0;i<response.data.data.records.length;i++){
                response.data.data.records[i] = {...response.data.data.records[i],
                    key:(i+1),
                    tags:actionArray};
            }
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

    /**
     * 弹出角色编辑或添加窗点击确定
     * @param e
     */
    handleOk = e => {
        let path = "";
        if(this.state.addOrEdit == 0){
            path = PATH.addRole;
        }else{
            path = PATH.editRole;
        }

        axios.post(path,this.state.editData)
            .then(response=>{
                console.log(response);
                if(response.data.code == 0){
                    message.success(response.data.msg);
                    //获取角色数据列表
                    this.changePage(1);
                }else{
                    message.error(response.data.msg);
                }

            })
        this.setState({
            showEditModal: false,
        });
    };

    /**
     * 角色编辑或添加窗点击取消
     * @param e
     */
    handleCancel = e => {
        console.log(e);
        this.setState({
            showEditModal: false,
        });
    };

    /**
     * 弹出授权窗点击确定
     * @param e
     */
    handleEmpowerOk = e => {
        console.log(this.state);
        axios.post(PATH.roleRightSave,{
            roleId:this.state.editEmpowerId,
            menuIds:this.state.checkedKeys
        })
            .then(response=>{
                console.log(response);
                if(response.data.code == 0){
                    message.success(response.data.msg);
                }else{
                    message.error(response.data.msg);
                }
            })
        this.setState({
            showEmpower: false,
        });
    };

    /**
     * 授权窗点击取消
     * @param e
     */
    handleEmpowerCancel = e => {
        console.log(e);
        this.setState({
            showEmpower: false,
        });
    };

    /**
     * 输入框值变化
     * @returns {*}
     */
    inputChange = (event)=>{
        if(event && event.target){
            let value = event.target.value;
            switch (event.target.id) {
                case "editEquipMentInput0":
                    this.state.editData.roleName= value;
                    break;
                case "editEquipMentInput2":
                    this.state.editData.status= value;
                    break;
            }
            this.setState({editData:this.state.editData});
        }
    }

    /**
     * 添加
     */
    addFun=()=>{
        this.setState({
            showEditModal: true,
            addOrEdit:0,
            modalTitle:"添加角色",
            editData:{
                roleName:"",
                status:"",
            }
        });
    }

    /**
     * 获取角色权限树
     */
    getRoleMenuRoleData=(roleId)=>{
        axios.get(PATH.roleMenuTreeData+"/"+roleId,{
            roleId:roleId
        },{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
            .then(response=>{
                console.log(response);
                if(response.data.code == 0){
                    this.state.checkedKeys = [];
                    for(let i = 0;i<response.data.data.length;i++){
                        response.data.data[i] = {
                            ...response.data.data[i],
                            key:response.data.data[i].id
                        }
                        //树形结构默认选中
                        if(response.data.data[i].checked){
                            this.state.checkedKeys.push(response.data.data[i].id);
                        }
                    }
                    this.setState(
                        {
                            roleTreeData:this.setRoleListToTree(response.data.data),
                            checkedKeys:this.state.checkedKeys
                        }
                    );
                    console.log(this.state.roleTreeData);
                }else{

                }
            })
    }

    /**
     * 处理后台获取到的角色权限数据，转化成树结构
     * @param expandedKeys
     */
    setRoleListToTree(data) {
        data.forEach(function (item) {
            delete item.children;
        });
        let map = {};
        data.forEach(function (item) {
            map[item.id] = item;
        });
        let val = [];
        data.forEach(function (item) {
            let parent = map[item.pId];
            if (parent) {
                (parent.children || ( parent.children = [] )).push(item);
            } else {
                val.push(item);
            }
        });
        return val;
    }

    onExpand = expandedKeys => {
        console.log('onExpand', expandedKeys);
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    };

    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    };

    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} {...item} />;
        });

    /**
     * 切换启用和禁用
     * @returns {*}
     */
    handleChange=e=>{
        console.log(e);
        this.state.editData.status = e;
        this.setState({
            editData:this.state.editData
        })
    }

    render() {
        return (
            <div id="sceneManagerDiv">
                <BreadcrumbCustom first="系统设置" second="角色管理" />
                <div className="sceneSetUpDiv">
                    <SearchBar
                        onSubmit={this.onSearch}
                        onAdd={this.addFun}
                        fields={this.searchFields()}
                        addBtn = {this.state.roleAddBool}
                    />
                    <Table locale={{ emptyText: '无数据'}} size={"small"}  className= "reasureManagerClass" bordered dataSource={this.state.resourceStatusArray}
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
                <Modal
                    title={this.state.modalTitle}
                    visible={this.state.showEditModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确认"
                    cancelText="取消"
                    footer={this.state.editBtnBool?"":null}
                    footer={this.state.editBtnBool?(
                        [
                            <Button key="submit" type="primary" onClick={this.handleOk}>
                                确定
                            </Button>,
                            <Button key="back" onClick={this.handleCancel}>
                                取消
                            </Button>
                        ]
                    ):null}
                >
                    <div>
                        <div className="resourceContentCell">
                            <div className="changeTitle">角色名称:</div>
                            <Input disabled={this.state.editBtnBool?false:true} onChange={event=>this.inputChange(event)}  id="editEquipMentInput0" className="changeCell" value={this.state.editData.roleName} placeholder="请输入角色名称"/>
                        </div>

                        <div className="resourceContentCell">
                            <div className="changeTitle">角色状态:</div>
                            <Select disabled={this.state.editBtnBool?false:true} className="changeCell" onChange={this.handleChange} value={this.state.editData.status}>
                                <Option value="0">启用</Option>
                                <Option value="1">停用</Option>
                            </Select>
                        </div>
                        <div className="clearBoth"></div>
                    </div>
                </Modal>

                <Modal
                    title="授权"
                    visible={this.state.showEmpower}
                    onCancel={this.handleEmpowerCancel}
                    footer={this.state.showEmpower?(
                        [
                            <Button onClick={this.handleEmpowerOk}>确定</Button>,
                            <Button onClick={this.handleEmpowerCancel}>取消</Button>
                        ]
                    ):null}

                >
                    <Tree
                        checkable
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelect}
                        selectedKeys={this.state.selectedKeys}
                    >
                        {this.state.roleTreeData!=null?(this.renderTreeNodes(this.state.roleTreeData)):null}
                    </Tree>
                </Modal>
            </div>
        )
    }
}
import React from 'react'
import {Tabs,Select,Table, Divider, Tagm,message,Modal,Input,Button} from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../utils/urls';
import SearchBar from '../../../components/searchbar'
import moment from 'moment';
import BreadcrumbCustom from "../../../components/BreadcrumbCustom";
import {isPoneAvailable,isEmail} from "../../../utils/config";
import  deletes from '../../../images/operation/deletes.png';
import  edit from '../../../images/operation/edit.png';
import  lookBtn from '../../../images/icon/lookbtn.png';
import  resetPwdBtn from '../../../images/icon/resetpwdbtn.png';


const { TabPane } = Tabs;
const { Option } = Select;

export default class Usermanager extends React.Component {
    columnsArray = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key',

        },
        {
            title: '登录账号',
            dataIndex: 'loginName',
            key: 'loginName',
        },
        {
            title: '用户名',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: '账号状态',
            key: 'status',
            dataIndex: 'status',
            render:(text,record)=>{
                if(text == 0){
                    return (
                        <span>正常</span>
                    )
                }else{
                    return (<span>停用</span>)
                }
            }
        },
        {
            title: '电话',
            key: 'phonenumber',
            dataIndex: 'phonenumber',
        },
        {
            title: '邮箱',
            key: 'email',
            dataIndex: 'email',
        },
        {
            title: '添加时间',
            key: 'createTime',
            dataIndex: 'createTime',
        },{
            title:"操作",
            key:"tags",
            dataIndex:"tags",
            render:(tags,data)=>(
                <span>
                    {tags.map((tag,index) => {
                        if(index !=tags.length-1){
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
            )
        }
    ];
    constructor(props) {
        super(props);
        this.state = {
            resourceStatusArray:[],
            queryInfo:{
                current:1,
                total2:10,
                pageSize:10
            },
            param:{
                resourceName:"",
                pageNum: 1,
                pageSize: 10,
            },
            //编辑
            editData:{
                userName:"",
                email:"",
                phonenumber:"",
                loginName:"",
                userId:"",
                password:"",
                passwordCopy:"",
                status:"0",
                roleId:""
            },
            modalTitle:"",//编辑还是添加标题
            addOrEdit:-1,//0为添加人员，1为修改人员
            showAddModal:false,//添加弹出是否显示
            resetPwdBool:false,//修改密码权限
            removeUserBool:false,//删除用户权限
            userAddBool:false,//添加
            userEditBool:false,//编辑
            userListBool:false,//查看
            reSetPW:{
                showRePWModal:false,//重置密码显示
                userId:"",
                newPW:"",
                newPW1:""
            },
            lookUserMsgBool:false,//修改密码是否显示，查看和编辑是不可见，新增时可见
            editBtnBool:true,//弹出窗确定按钮是否可以点击
            roleList:[],//角色列表
        };

        //判断按钮权限
        let permList = localStorage.getItem("permList");
        if(permList.indexOf("system:user:resetPwd")>=0){
            this.state.resetPwdBool = true;
        }
        if(permList.indexOf("system:user:add")>=0){
            this.state.userAddBool = true;
        }

        if(permList.indexOf("system:user:edit")>=0){
            this.state.userEditBool = true;
        }

        if(permList.indexOf("system:user:remove")>=0){
            this.state.userListBool = true;
        }

        if(permList.indexOf("system:user:list")>=0){
            this.state.removeUserBool = true;
        }

        this.changePage(1,null,null,null,null);
    }

    componentDidMount() {
        //获取角色列表
        this.getRolesList();
    }

    /**
     * //获取角色列表
     */
    getRolesList=()=>{
        axios.post(PATH.roleQuery,{})
            .then(response=>{
                console.log(response);
                if(response.data.code == 0){
                    this.setState({
                        roleList:response.data.data
                    })
                }
            })
    }

    /**
     * 点击搜索
     * @param searchFields
     */
    onSearch = (searchFields) => {
        console.log(searchFields);
        let type = searchFields.loginName;
        let appId = searchFields.userName;
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
        this.changePage(1,type,appId,start,end);
    }

    searchFields = () => {
        return [{
            title: '登录账号',
            key: 'loginName',
            type: 'input',
            labelWidth:80,
            placeholder:"请输入登录账号"
        }, {
            title: '用户名',
            key: 'userName',
            type: 'input',
            labelWidth:80,
            placeholder:"请输入用户名"
        }, {
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
    changePage = (page,props0,props1,createTimeBegin,createTimeEnd) => {
        let param = {
            current:page,
            size: 10,
            loginName:props0,
            userName:props1,
            createTimeBegin:createTimeBegin,
            createTimeEnd:createTimeEnd
        }
        axios.post(PATH.userList,param).then(response=>{
            console.log(response);
            for(let i = 0;i<response.data.data.records.length;i++){
                let actionArray = [];
                if(this.state.userListBool){
                    actionArray.push(<a title={'查看'}><img src={lookBtn}/></a>);
                }
                if(this.state.userEditBool){
                    actionArray.push(<a title={'编辑'}><img src={edit}/></a>);
                }
                if(this.state.resetPwdBool){
                    actionArray.push(<a title={'重置密码'}><img src={resetPwdBtn}/></a>);
                }
                if(this.state.removeUserBool){
                    actionArray.push(<a title={'删除'}><img src={deletes}/></a>);
                }
                response.data.data.records[i] = {...response.data.data.records[i],key:(i+1),
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
     * 添加
     */
    addFun=()=>{
        this.setState({
            showAddModal: true,
            addOrEdit:0,
            modalTitle:"添加人员",
            lookUserMsgBool:false,
            editBtnBool:true,
            editData:{
                userName:"",
                email:"",
                phonenumber:"",
                loginName:"",
                status:"",
                roleId:""
            }
        });
    }

    /**
     * 点击操作功能
     * @returns {*}
     */
    actionClick = (index,props,tag) => {
        console.log(props);
        console.log(tag);

        switch (tag.props.title) {
            //查看
            case "查看":
                this.state.editData.userName = props.userName;
                this.state.editData.email = props.email;
                this.state.editData.phonenumber = props.phonenumber;
                this.state.editData.loginName = props.loginName;
                this.state.editData.userId = props.userId;
                this.state.editData.roleId = props.roleId;
                this.setState({
                    editData:this.state.editData,
                    showAddModal: true,
                    addOrEdit:1,
                    modalTitle:"查看人员",
                    lookUserMsgBool:true,
                    editBtnBool:false,
                });
                this.getUserInfo(props.userId);
                break;
            //编辑
            case "编辑":
                this.state.editData.userName = props.userName;
                this.state.editData.email = props.email;
                this.state.editData.phonenumber = props.phonenumber;
                this.state.editData.loginName = props.loginName;
                this.state.editData.userId = props.userId;
                this.state.editData.status = props.status;
                this.setState({
                    editData:this.state.editData,
                    showAddModal: true,
                    addOrEdit:1,
                    modalTitle:"编辑人员",
                    lookUserMsgBool:true,
                    editBtnBool:true,
                });
                this.getUserInfo(props.userId);
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
            //重置密码
            case "重置密码":
                // Modal.confirm({
                //     title: "提示",
                //     content: '是否确认重置密码？',
                //     okText: '取消',
                //     cancelText: '确认',
                //     onCancel:this.ReSetPWAreaSceneFun.bind(this,props),
                // });
                this.state.reSetPW.showRePWModal = true;
                this.state.reSetPW.userId = props.userId;
                this.setState({
                    reSetPW:this.state.reSetPW
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
        console.log(props);
        axios.post(PATH.delectUser+"?ids="+props.userId,{
        },{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
            .then(response=>{
                console.log(response);
                if(response.data.code == 0){
                    message.success(response.data.msg);
                    this.changePage(1,null,null,null,null);
                }else{
                    message.error(response.data.msg);
                }
            })
    }

    /**
     * 重置密码
     * @returns {*}
     */
    ReSetPWAreaSceneFun(){
        this.state.reSetPW.newPW='000000';
        axios.post(PATH.userReSetPW,{
            newPassword:this.state.reSetPW.newPW,
            userId:this.state.userId
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success(response.data.msg);
            }else{
                message.error(response.data.msg);
            }

        })
        this.state.reSetPW = {
            showRePWModal : false,
        }
        this.setState({
            reSetPW:this.state.reSetPW
        })
    };


    /**
     * 弹出人员编辑或添加窗点击确定
     * @param e
     */
    handleOkFun = e => {
        let bool = true;//判断是否输入框为空
        for(let i = 0;i<this.state.editData.length;i++){
            if(this.state.editData[i].length<=0){
                bool = false;
                break;
            }
        }
        if(!bool){
            message.error("内容不能为空！");
            return;
        }
        if(this.state.lookUserMsgBool){//编辑信息
            this.editInfo();
        }else{//添加人员
            this.addUser();
        }
    };

    /**
     * 编辑信息
     */
    editInfo=()=>{

        if(!isEmail(this.state.editData.email)){
            message.error("邮箱地址不正确！");
            return;
        }
        if(!isPoneAvailable(this.state.editData.phonenumber)){
            message.error("手机号不正确！");
            return;
        }
        this.state.editData.roleIds = [this.state.editData.roleId];
        axios.post(PATH.editUser,this.state.editData)
            .then(response=>{
                console.log(response);
                if(response.data.code == 0){
                    message.success(response.data.msg);
                    this.changePage(1,null,null,null,null);
                    this.setState({
                        showAddModal: false,
                    });
                }else{
                    message.error(response.data.msg);
                }
            })
    }

    /**
     * 添加人员
     */
    addUser=()=>{

        if(!isEmail(this.state.editData.email)){
            message.error("邮箱地址不正确！");
            return;
        }
        if(!isPoneAvailable(this.state.editData.phonenumber)){
            message.error("手机号不正确！");
            return;
        }
        if(this.state.editData.password !=this.state.editData.passwordCopy){
            message.error("两次输入密码不一致！");
            return;
        }
        this.state.editData.roleIds = [this.state.editData.roleId];
        axios.post(PATH.addUser,this.state.editData)
            .then(response=>{
                console.log(response);
                if(response.data.code == 0){
                    message.success(response.data.msg);
                    this.changePage(1,null,null,null,null);
                    this.setState({
                        showAddModal: false,
                    });
                }else{
                    message.error(response.data.msg);
                }
            })
    }

    /**
     * 人员编辑或添加窗点击取消
     * @param e
     */
    handleCancel = e => {
        console.log(e);
        this.setState({
            showAddModal: false,
        });
    };

    /**
     * 重置密码确定
     * @param e
     */
    handleRePWOk = e => {
        this.state.reSetPW.newPW='000000';
        axios.post(PATH.userReSetPW,{
            newPassword:this.state.reSetPW.newPW,
            userId:this.state.reSetPW.userId
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success(response.data.msg);
            }else{
                message.error(response.data.msg);
            }
        })
        this.state.reSetPW = {
            showRePWModal : false,
        }
        this.setState({
            reSetPW:this.state.reSetPW
        })
    };

    /**
     * 重置密码点击取消
     * @param e
     */
    handleRePWCancel = e => {
        console.log(e);
        this.state.reSetPW = {
            showRePWModal : false,
        }
        this.setState({
            reSetPW:this.state.reSetPW
        })
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
                    this.state.editData.userName= value;
                    this.setState({editData:this.state.editData});
                    break;
                case "editEquipMentInput1":
                    this.state.editData.loginName= value;
                    this.setState({editData:this.state.editData});
                    break;
                case "editEquipMentInput2":
                    this.state.editData.email= value;
                    this.setState({editData:this.state.editData});
                    break;
                case "editEquipMentInput3":
                    this.state.editData.phonenumber= value;
                    this.setState({editData:this.state.editData});
                    break;
                case "editEquipMentInput4":
                    this.state.reSetPW.newPW= value;
                    this.setState({reSetPW:this.state.reSetPW});
                    break;
                case "editEquipMentInput5":
                    this.state.reSetPW.newPW1= value;
                    this.setState({reSetPW:this.state.reSetPW});
                    break;
                case "editEquipMentInput6":
                    this.state.editData.password= '000000';
                    this.setState({editData:this.state.editData});
                    break;
                case "editEquipMentInput7":
                    this.state.editData.passwordCopy= '000000';
                    this.setState({editData:this.state.editData});
                    break;
            }

            console.log(this.state.editData);
        }
    }

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

    /**
     * 角色
     * @returns {*}
     */
    handleRoleChange=e=>{
        console.log(e);
        this.state.editData.roleId = e;
        this.setState({
            editData:this.state.editData
        })
    }

    /**
     * 获取人员的角色
     * @returns {*}
     */
    getUserInfo=(userId)=>{
        axios.get(PATH.userView+"/"+userId)
            .then(response=>{
                console.log(response);
                if(response.data.code == 0){
                    if(response.data.data.roles.length>0){
                        this.state.editData.roleId = response.data.data.roles[0].roleId
                        this.setState({
                            editData:this.state.editData
                        })
                    }
                }
            })
    }

    render() {
        console.log(this.state);
        return (
            <div id="sceneManagerDiv">
                <BreadcrumbCustom first="系统设置" second="人员管理" />
                <div className="sceneSetUpDiv">
                    <SearchBar
                    onSubmit={this.onSearch}
                    fields={this.searchFields()}
                    addBtn = {this.state.userAddBool}
                    onAdd={this.addFun}
                    />

                    <Table  locale={{ emptyText: '无数据'}} size={"small"}  className= "reasureManagerClass" bordered dataSource={this.state.resourceStatusArray}
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
                    visible={this.state.showAddModal}
                    onOk={this.handleOkFun}
                    onCancel={this.handleCancel}
                    footer={this.state.editBtnBool?"":null}
                    footer={this.state.editBtnBool?(
                        [
                            <Button key="submit" onClick={this.handleOkFun}>
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
                            <div className="changeTitle">用户名:</div>
                            <Input disabled={this.state.editBtnBool?false:true} onChange={event=>this.inputChange(event)}  id="editEquipMentInput0" className="changeCell" value={this.state.editData.userName} placeholder="请输入用户名"/>
                        </div>
                        <div className="resourceContentCell">
                            <div className="changeTitle">登录账号:</div>
                            <Input disabled={this.state.editBtnBool?false:true} onChange={event=>this.inputChange(event)}  id="editEquipMentInput1" className="changeCell" value={this.state.editData.loginName} placeholder="请输入登录账号"/>
                        </div>
                        <div className="clearBoth"></div>
                        <div className="resourceContentCell">
                            <div className="changeTitle">状态:</div>
                            <Select disabled={this.state.editBtnBool?false:true} className="changeCell" onChange={this.handleChange} value={this.state.editData.status}>
                                <Option value="0">启用</Option>
                                <Option value="1">停用</Option>
                            </Select>
                        </div>
                        <div className="resourceContentCell">
                            <div className="changeTitle">角色:</div>
                            <Select disabled={this.state.editBtnBool?false:true} className="changeCell" onChange={this.handleRoleChange} value={this.state.editData.roleId}>
                                {
                                    this.state.roleList.map((item,index)=>(
                                        <Option key={index} value={item.roleId}>{item.roleName}</Option>
                                    ))
                                }
                            </Select>
                        </div>

                        <div className="resourceContentCell">
                            <div className="changeTitle">邮箱:</div>
                            <Input disabled={this.state.editBtnBool?false:true} onChange={event=>this.inputChange(event)}  id="editEquipMentInput2" className="changeCell" value={this.state.editData.email} placeholder="请输入邮箱"/>
                        </div>
                        <div className="resourceContentCell">
                            <div className="changeTitle">手机号:</div>
                            <Input disabled={this.state.editBtnBool?false:true} onChange={event=>this.inputChange(event)}  id="editEquipMentInput3" className="changeCell" value={this.state.editData.phonenumber} placeholder="请输入手机号"/>
                        </div>
                        {
                            this.state.modalTitle == "添加人员"?(
                                <div className="resourceContentCell" hidden={this.state.editBtnBool?false:true}>
                                    <div className=" changeTitle">默认密码:</div>
                                    <Input className="changeCell" disabled="false" value="000000" />
                                </div>
                            ):null
                        }

                        <div className="clearBoth"></div>
                    </div>
                </Modal>

                <Modal
                    title="重置密码"
                    visible={this.state.reSetPW.showRePWModal}
                    footer={this.state.reSetPW.showRePWModal?(
                        [
                            <Button onClick={this.handleRePWOk}>确定</Button>,
                            <Button onClick={this.handleRePWCancel}>取消</Button>
                        ]
                    ):null}
                >
                    <div>
                        <div className="resourceContentCell" hidden={this.state.editBtnBool?false:true}>
                            <div className=" changeTitle">默认密码:</div>
                            <Input className="changeCell" disabled="false" value="000000" />
                        </div>
                        <div className="clearBoth"></div>
                    </div>
                </Modal>
            </div>
        )
    }
}
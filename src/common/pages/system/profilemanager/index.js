import React from 'react'
import {Input ,Radio ,Select ,Button ,message,Tabs,Table,Modal } from 'antd';
import './index.less';
import axios from 'axios';
import {PATH} from '../../../utils/urls';
import BreadcrumbCustom from "../../../components/BreadcrumbCustom";
import {isPoneAvailable,isEmail} from "../../../utils/config";
import  Changepassword from '../changepassword';
import Upswarnsetup from "../../warn/warnsetup/warnsetupitems/upswarnsetup";
const { Option } = Select;
const infoTitle = ["用户名","账号","手机号","邮箱","角色"];
export default class Profilemanager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selfInfoArray:[],//显示的个人信息
            profileEditBool:false,//按钮权限
        };

        //判断按钮权限
        let permList = localStorage.getItem("permList");
        if(permList.indexOf("system:userProfile:edit")>=0){
            this.state.profileEditBool = true;
        }
    }

    componentDidMount() {
        //获取个人信息
        this.getSelfMessage();
    }

    /**
     * 获取任务信息
     * infoTitle = ["用户名","账号","手机号","邮箱","角色"];
     * @returns {*}
     */
    getSelfMessage(){
        axios.get(PATH.profile,{})
            .then(response=>{
                    console.log(response);
                    if(response.data.code == 0){
                        let infoObj = response.data.data.user;
                        let infoList = [infoObj.userName,infoObj.loginName,infoObj.phonenumber,infoObj.email,response.data.data.roleList[0].roleName];
                        this.state.selfInfoArray = [];
                        for(let i = 0;i<infoList.length;i++){
                            if(i == 1 || i == 4){
                                this.state.selfInfoArray.push({
                                    type:infoTitle[i],
                                    value:infoList[i],
                                    disabled:true
                                })
                            }else{
                                this.state.selfInfoArray.push({
                                    type:infoTitle[i],
                                    value:infoList[i],
                                    disabled:false
                                })
                            }
                        }
                        this.setState({
                            selfInfoArray:this.state.selfInfoArray
                        })
                    }
                }
            )}

    /**
     * 修改个人信息
     * @returns {*}
     */
    onSubmit=()=>{
        console.log(this.state);
        let bool = true;//判断是否输入框为空
        for(let i = 0;i<this.state.selfInfoArray.length;i++){
            if(this.state.selfInfoArray[i].value.length<=0){
                bool = false;
                break;
            }
        }
        if(!bool){
            message.error("内容不能为空！");
            return;
        }
        if(!isPoneAvailable(this.state.selfInfoArray[2].value)){
            message.error("手机号不正确！");
            return;
        }
        if(!isEmail(this.state.selfInfoArray[3].value)){
            message.error("邮箱地址不正确！");
            return;
        }
        let sendData = {
            userName:this.state.selfInfoArray[0].value,
            loginName:this.state.selfInfoArray[1].value,
            phonenumber:this.state.selfInfoArray[2].value,
            email:this.state.selfInfoArray[3].value
        };
        axios.post(PATH.editProfile,sendData).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success(response.data.msg);
                this.getSelfMessage();
            }else{
                message.error(response.data.msg);
            }
        })
    }

    /**
     * 修改密码
     */
    onChangePassWord=()=>{
        let path = {
            pathname:"changepassword"
        }
        this.setState({
            setupSoftWareResourceData:{
                pathname:"changepassword"
            },
            UpswarnsetupServiceBool:true
        })
        //this.props.history.push(path);
    }

    /**
     * 输入框值变化
     * @returns {*}
     */
    inputChange = (event)=>{
        console.log(event.target.id);
        if(event && event.target){
            console.log(event.target.id);
            let index = event.target.id.substring(event.target.id.length - 1,event.target.length);
            this.state.selfInfoArray[index].value = event.target.value;
        }
    }
    handleOksetup = e => {
        console.log(e);
        this.child.onSubmitv();
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
    onRefw = (ref) => {
        this.child = ref
    }
    render() {
        return (
            <div id="sceneManagerDiv">
                <BreadcrumbCustom first="系统设置" second="个人信息" />
                <div className="sceneSetUpDiv">
                    {
                        this.state.selfInfoArray.map((item,i)=>(
                            <div className="resourceContentCell" key={i}>
                                <div className="changeTitle">{item.type}:</div>
                                <Input id={`editEquipMentInput${i}`} className="changeCell" defaultValue={item.value} disabled={item.disabled} onChange={event=>this.inputChange(event)}/>
                            </div>
                        ))
                    }
                    {
                        this.state.profileEditBool?(
                            <div className="resourceContentCell changePWDiv">
                                <Button className="changePWBtn" onClick={this.onSubmit}>修改</Button>
                                <Button className="changePWBtn" onClick={this.onChangePassWord}>修改密码</Button>
                            </div>
                        ):null
                    }
                </div>
                {
                    this.state.UpswarnsetupServiceBool?(
                        <Modal
                            title="修改密码"
                            visible={true}
                            onCancel={this.handleCancelsetup}
                            footer={this.state.UpswarnsetupServiceBool?(
                                [
                                    <Button onClick={this.handleOksetup}>确定</Button>,
                                    <Button onClick={this.handleCancelsetup}>取消</Button>
                                ]
                            ):null}

                            width='36%'
                        >
                            <Changepassword onRefw={this.onRefw} onUpdataEquipment={this.getSoftWareResource} dataSource={this.state.setupSoftWareResourceData}></Changepassword>
                        </Modal>
                    ):null
                }
            </div>
        )
    }
}
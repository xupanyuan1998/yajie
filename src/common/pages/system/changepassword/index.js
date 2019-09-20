import React from 'react'
import {Input ,Radio ,Select ,Button ,message } from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../utils/urls';
import BreadcrumbCustom from "../../../components/BreadcrumbCustom";
const { Option } = Select;
export default class ChangePassWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPW:"",
            newPW:"",
            newPW1:""
        };
    }

    componentDidMount() {
        this.props.onRefw(this)

    }


    /**
     * 修改个人信息
     * @returns {*}
     */
    onSubmitv=()=>{
        console.log(this.state);
        if(this.state.newPW1 !=this.state.newPW){
            message.error("两次输入密码不一致！");
            return;
        }
        if(this.state.oldPW.length<=0 ||this.state.newPW.length<=0 ||this.state.newPW1.length<=0){
            message.error("内容不能为空！");
            return;
        }
        let sendData = {
            newPassword :this.state.newPW,
            oldPassword :this.state.oldPW,
        };
        axios.post(PATH.changePassWord,sendData).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success(response.data.msg);
                //this.state.onUpdataEquipment();
                //this.backFun();
            }else{
                message.error(response.data.msg);
            }
        })
    }
    /**
     * 输入框值变化
     * @returns {*}
     */
    inputChange = (event)=> {

        console.log(event.target.id);
        if (event && event.target) {
            if (event.target.id == "editEquipMentInput0") {
                this.setState({
                    oldPW:event.target.value
                })
            } else if (event.target.id == "editEquipMentInput1") {
                this.setState({
                    newPW:event.target.value
                })
            }else if (event.target.id == "editEquipMentInput2") {
                this.setState({
                    newPW1:event.target.value
                })
            }
            onUpdataEquipment:this.props.onUpdataEquipment
        }
    }

    render() {
        return (
            <div>
                <div className="changeAllContent">
                    <div className="resourceContentCell">
                        <div className="changeTitle">旧密码:</div>
                        <Input id={"editEquipMentInput0"} value={this.state.oldPW} className="changeCell" placeholder="请输入旧密码" onChange={event=>this.inputChange(event)}/>
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">新密码:</div>
                        <Input id={"editEquipMentInput1"} value={this.state.newPW} className="changeCell" placeholder="请输入新密码" onChange={event=>this.inputChange(event)}/>
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">重新输入:</div>
                        <Input id={"editEquipMentInput2"} value={this.state.newPW1} className="changeCell" placeholder="请重新输入新密码" onChange={event=>this.inputChange(event)}/>
                    </div>
                </div>
                <div className="clearBoth"></div>
            </div>
        )
    }
}
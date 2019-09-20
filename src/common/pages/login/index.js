import React from 'react';
import { Form, Input, Button, notification, Icon,message } from 'antd';
import axios from 'axios'
import './index.less';
import logoImage from '../../images/login/logo.png';
import titleImage from '../../images/login/title.png';
import loginImage from '../../images/login/login.png';
import {PATH,URL,IP} from '../../utils/urls'
import {getUID} from "../../utils/config";

const FormItem = Form.Item;

class LoginPage extends React.Component {

    constructor(props){
        super(props);
        this.state={
            captchImageSource:null,
            uuid:"",
            /* logoImageSource:"../../images/login/logo.png",
             titleImageSource:"../../images/login/title.png",*/
        };
        //判断是否是退出登录
        if(this.props.location.state && this.props.location.state.loginOut){
            localStorage.setItem("current_system_token",null);
        }
        //如果当前有token，那么直接进入软件
        console.log(localStorage.getItem("current_system_token"));
        if(localStorage.getItem("current_system_token") && localStorage.getItem("current_system_token")!="null"){
            console.log(localStorage.getItem("current_system_token"));
            this.props.history.push('/index');
        }
    }

    /**
     * 提交按钮点击
     * @param e
     */
    handleSubmit = (e) => {
        e.preventDefault();
        let n = this.props.form.getFieldsValue().username;
        let p = this.props.form.getFieldsValue().password;
        this.loginFun(n,p)
    }

    /**
     * 返回一个弹框对象，提示用户名和密码
     * @param type
     * @param msg
     * @returns {*}
     */
    openNotificationWithIcon = (type,msg) => {
        return notification[type]({
            message: '登录',
            description: msg,
            duration: 6,
            icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
        })
    }

    componentDidMount() {
        /**
         * 获取图片验证码并显示在页面
         */
        // this.getCaptchaImage();
    }

    /**
     * 登录接口调用
     * @param n
     * @param p
     */
    loginFun(n,p){
        if(n.length<=0){
            message.error("用户名不能为空！");
            return;
        }
        if(p.length<=0){
            message.error("密码不能为空！");
            return;
        }
        axios({
            method:'post',
            url:PATH.login,
            params:{
                username:n,
                password:p,
                // validateCode:document.getElementById("captchValue").value,
                rememberMe:false,
                // uid:this.state.uuid
            }
        }).then(response => {
            console.log(response);
            if(response.data.code==0){
                localStorage.setItem("username",n);
                localStorage.current_system_token = response.data.data;
                this.props.history.push('/index');
            }else{
                this.openNotificationWithIcon('info',response.data.msg);
            }
            console.log(response);
        });
    }
    /**
     * 点击验证码更新
     * @returns {*}
     */
    getCaptchaImage=()=>{
        this.state.uuid = getUID(16);
        document.getElementById("captchImage").setAttribute("src",PATH.getCaptcha+"?type=math&&uid="+this.state.uuid);
    }

    render() {
        //获取当前域名
        let hostname=IP;
        if(location.hostname.indexOf("localhost")<0){
            hostname = location.hostname;
        }
        localStorage.setItem("hostname",hostname);
        const { getFieldDecorator } = this.props.form
        const captchImage = this.state.captchImageSource;
        return (
            <div className="loginpagewrap">
                <div className="box">
                    <div className="loginTitle">
                        {/*   <img className="imglogo" src={logoImage}></img>
                        <img className="imgtitle" src={titleImage}></img>*/}
                        <img className="imglogin" src={loginImage}></img>
                    </div>
                    <div className="loginWrap">
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: '请输入用户名' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: '#126049' }} />} placeholder="用户名" />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入密码' }],
                                })(
                                    <Input prefix={<Icon type="lock" style={{ color: '#126049' }} />} type="password" placeholder="密码" />
                                )}
                            </FormItem>
                            {/*<div className="checkCode">*/}
                            {/*<input className="ant-input ant-input-lg" id='captchValue' placeholder="输入验证码"></input>*/}
                            {/*<img onClick={this.getCaptchaImage} id= 'captchImage' src={captchImage}></img>*/}
                            {/*</div>*/}
                            <Button type="primary" htmlType="submit" className="loginBtn">登录</Button>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

let Login = Form.create()(LoginPage);
export default Login;
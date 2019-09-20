import React from 'react'
import { Menu, Icon, Layout ,Badge} from 'antd'
import './header.less'
import avater from '../images/head.jpg';
import warnImage from '../images/home/warn.png';
import exitImage from '../images/home/exit.png';
import personalImage from '../images/home/personal.png';
import createHistory from 'history/createHashHistory';
import logoImage from '../images/home/logo.png';
import titleImage from '../images/home/title.png';
import {IP} from "../utils/urls";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Header } = Layout
const history = createHistory();

export default class Top extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            warnList:[],//告警列表
            warnListLength:0,//告警条数
            hostname:""
        }

        this.initWarnListWebSocket = this.initWarnListWebSocket.bind(this);
        this.warnListWs = null;
        this.lock = false;
    }

    componentDidMount() {
        this.getUser()
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    tick(){
        if(localStorage.getItem("current_system_token") && localStorage.getItem("current_system_token")!="null"
        &&localStorage.getItem("hostname") && localStorage.getItem("hostname")!="null"){
            this.initWarnListWebSocket();
            clearInterval(this.timerID);
        }
    }

    componentWillUnmount() {
        if(this.warnListWs !=null){
            this.warnListWs.close();
        }
        clearInterval(this.timerID);
        this.lock = true;
    }

    /**
     * 创建websocket，实时获取告警信息
     * @returns {*}
     */
    initWarnListWebSocket() {
        let that = this;
        let hostname = IP;
        if(this.state.hostname.indexOf("localhost")<0){
            hostname = this.state.hostname;
        }
        this.warnListWs = new WebSocket("ws://"+hostname.replace("http://","")+"/websocket/headMonitor:" + localStorage.getItem("username"));
        this.warnListWs.onopen = function (evt) {
            console.log("WarnListConnection open ...----------");
        };

        this.warnListWs.onmessage = function (evt) {
            console.log("头部告警信息");
            console.log(evt);
            if(evt.data){
                let dataObj = JSON.parse(evt.data);
                console.log(dataObj);
                if(dataObj.data){
                    that.state.warnList = dataObj.data;
                    that.state.warnListLength = dataObj.data.length;
                    if (!this.lock) {
                        that.setState({
                            warnList:that.state.warnList,
                            warnListLength:that.state.warnListLength
                        });
                    }
                }
            }
        };

        this.warnListWs.onclose = function (evt) {
            console.log("Connection closed.");
        };
    }

    /**
     * 播放二进制音频流
     * @returns {*}
     */
    playSound(data){
        console.log("二进制音频流");
        console.log(data);
        let sblod = new Blob([data]);
        let audio = document.getElementById('aud');
        if (window.URL) {
            audio.src = window.URL.createObjectURL(sblod);
        } else {
            audio.src = event;
        }
        audio.autoplay = true;
    }

    getUser = () => {
        this.setState({
            username: "\u00a0"+localStorage.getItem("username")
        })
    }

    menuClick = e => {
        console.log(e);
        if(e.key == "logOut"){//退出登录
            // this.logout();
        }else if(e.key == "playWarn"){//播放告警

        }else if(e.key == "personalPage"){//播放告警
            this.personalPage();
        }else{
            this.goToWarn(this.state.warnList[parseInt(e.key)]);
        }
    };
    logout = () => {
        localStorage.setItem("current_system_token",null);
        history.push('/login');
        location.reload(true);
    };
    personalPage = () => {
        history.push('/profilemanager');
    };
    /**
     * 跳转到设备告警界面
     * */
    goToWarn=(data)=>{
        console.log(data);
        if(data && data.resourceId){
            localStorage.setItem("selectWarnResourceId",data.resourceId);
            localStorage.setItem("selectWarnIsSoftware",data.isSoftware);
            history.push('/warncheck');
        }
    }

    render() {
        console.log(this.state);
        if(this.state.hostname == ""){
            this.state.hostname = location.hostname;
        }
        return (
            <Header style={{ background: '#008669'}} className="head-div">
                <div className="img-logo">
                    <img src={logoImage}></img>
                    <img src={titleImage}></img>
                </div>
                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '120px', float: 'right',background:"#008669",color:"#ffffff"}}
                    onClick={this.menuClick}
                    forceSubMenuRender={true}
                    className="managerTitleMenu "
                >
                    <SubMenu title={<span className="submenu-title-wrapper"><img className="img-icon" src={warnImage} alt="告警" /><div className="avatar">{this.state.warnListLength}</div>告警信息</span>}>
                        {
                            this.state.warnList.length>0?(
                                <MenuItemGroup title="告警信息">
                                    {
                                        this.state.warnList.map((item,index)=>{
                                            return(
                                                <Menu.Item key={index}><span style={{ color:"rgba(0, 0, 0, 0.65)"}}>{item.resourceName}</span><span>：</span><span style={{color:"red"}}>{item.warnMsg}</span></Menu.Item>
                                            )
                                        })
                                    }
                                </MenuItemGroup>
                            ):null
                        }
                    </SubMenu>
                    <SubMenu title={<span className="submenu-title-wrapper" onClick={this.personalPage}> <img className="img-icon" src={personalImage} alt="个人中心" />{"\u00a0"+localStorage.getItem("username")}</span>}>
                        {/*<MenuItemGroup title="个人中心" >
                            <Menu.Item key="logout"><span onClick={this.logout} style={{display:'block',width:"100%"}}>个人信息</span></Menu.Item>
                        </MenuItemGroup>*/}
                    </SubMenu>
                    <SubMenu title={<span className="submenu-title-wrapper" onClick={this.logout}> <img className="img-icon" src={exitImage} alt="退出" />退出</span>}>
                       {/* <MenuItemGroup title="用户中心">
                            <Menu.Item key="logout"><span onClick={this.logout} style={{display:'block',width:"100%"}}>退出登录</span></Menu.Item>
                        </MenuItemGroup>*/}
                    </SubMenu>
                </Menu>
            </Header>
        );
    }
}
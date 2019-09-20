import React from 'react';
import './index.less'
import {Button,Table, Divider, Tag,Row, Col,Menu,Modal,Input,message,Tooltip} from "antd";
import axios from 'axios'
import {PATH,URL,IP} from '../../utils/urls'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import POINT from '../../images/point/point.svg';
import ReactSVG from 'react-svg'
export default class index extends React.Component {
    columns = [
        {
            title: '序号',
            dataIndex: 'num',
            key: 'num',
        },
        {
            title: '区域',
            dataIndex: 'sceneName',
            key: 'age',
            width:130
        },
        {
            title: '状态',
            dataIndex: 'warnStatus',
            key: 'warnStatus',
            render:(text,record)=>{
                //正常
                if(record.warnStatus == 0){
                    return (
                        <div>
                            <span className="circleGreenPoint"></span>
                            <span className="greenBgColor">正常</span>
                        </div>
                    )
                }else{
                    return (
                        <div>
                            <span className="circleRedPoint"></span>
                            <span className="redBgColor">告警</span>
                        </div>
                    )
                }
            }
        },
    ];
    constructor(props){
        super(props);
        this.state = {
            id:"",
            selectCellId:-1,//当前右键选中图id,
            svgArray:[],//在场景中的svg数组
            hostname:"",
            origin:"",
            mainSvg:"",
            warnList:["1","2"]
        }
        this.moving = false;
        this.state.origin = localStorage.getItem("origin");
        this.initWebSocket = this.initWebSocket.bind(this);
        this.ws = null;
        this.lock = false;
        this.initSoundWebSocket = this.initSoundWebSocket.bind(this);
        this.soundWs = null;
    }

    componentWillUnmount() {
        //设置全局提示信息的显示
        message.config({
            top: document.body.clientHeight/2,//消息距离顶部的位置
            duration: 2,//默认自动关闭延时，单位秒
            maxCount: 3,//最大显示数, 超过限制时，最早的消息会被自动关闭
        });
        this.lock = true;
        //断开websocket
        if(this.ws !=null){
            this.ws.close();
        }
        if(this.soundWs !=null){
            this.soundWs.close();
        }
    }

    componentDidMount() {
        console.log(this.props);
        //获取主底图资源
        this.getMainSceneFun();
        //获取区域场景列表
        this.getAreaSceneCellFun();
        //创建websocket
        this.initWebSocket();
        this.initSoundWebSocket();
    }

    /**
     * 获取主底图资源
     * mainSceneImg
     * @returns {*}
     */
    getMainSceneFun=()=>{
        axios.get(PATH.getMineScene,{})
            .then(response=>{
                console.log(response);
                if(response.data.code == 0){
                    console.log(this.state)
                    this.setState({
                        mainSvg:<img src={this.checkHttp(response.data.data.mainSceneImg)} className="areaImg"/>,
                    })
                }else{
                    // message.error(response.data.msg)
                }
            })
    }

    /**
     * 获取当前区域场景的元素
     */
    getAreaSceneCellFun(){
        axios.post(PATH.getAreaWarnList,{
            sceneStatus:1//1:启动，0为启用
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                let dataArray = response.data.data;
                for(let i = 0;i<dataArray.length;i++){
                    let style = {
                        left:parseInt(dataArray[i].locationX),
                        top:parseInt(dataArray[i].locationY),
                        position: "absolute",
                        width:dataArray[i].width,
                        height:dataArray[i].height,
                        border:"0px",
                    };
                    dataArray[i].src="";
                    //warnStatus 0 是正常 1 是预警
                    if(dataArray[i].warnStatus == 1){
                        dataArray[i].src = this.checkHttp(dataArray[i].sceneWarnIcon);
                    }else{
                        dataArray[i].src = this.checkHttp(dataArray[i].sceneIcon);
                    }
                    this.state.svgArray.push({
                        num:(i+1)+"",
                        ...dataArray[i],
                        style:style,
                        src:dataArray[i].src
                    });
                }

                this.setState({
                    svgArray:this.state.svgArray
                })

                console.log(this.state);
            }
        })
    }

    /**
     * 点击区域场景
     */
    onClickCell=(props)=>{
        console.log(props);
        let path = {
            pathname:'areascenewarn',
            state:{
                sceneImg:props.sceneImg,
                id:props.id
            }
        }
        this.props.history.push(path);
    }


    /**
     * 通过设备列表id获取当前索引
     */
    getIndexById(id){
        let index = 0;
        for(let i = 0;i<this.state.svgArray.length;i++){
            if(this.state.svgArray[i].id == id){
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * 创建websocket，实时获取场景状态
     * @returns {*}
     */
    initWebSocket() {
        let that = this;
        let hostname = IP;
        if(this.state.hostname.indexOf("localhost")<0){
            hostname = this.state.hostname;
        }
        this.ws = new WebSocket("ws://"+hostname.replace("http://","")+"/websocket/sceneMonitor:" + localStorage.getItem("username"));
        this.ws.onopen = function (evt) {
            console.log("场景Connection open ...");
        };

        this.ws.onmessage = function (evt) {
            if (evt.data.indexOf("连接成功") < 0) {
                that.updateHareAndSoftData(JSON.parse(evt.data));
            }
        };

        this.ws.onclose = function (evt) {
            console.log("Connection closed.");
        };
    }

    /**
     * 根据websocket返回的数据，更新场景状态
     * @returns {*}
     */
    updateHareAndSoftData(updateData) {
        console.log("场景状态更新");
        console.log(updateData);
        if (updateData.data != null) {
            let data = updateData.data;
            for(let i = 0;i<data.length;i++){
                for(let j = 0;j<this.state.svgArray.length;j++){
                    if(data[i].id == this.state.svgArray[j].id){
                        this.state.svgArray[j].warnStatus =data[i].warnStatus;
                        if(data[i].warnStatus == 1){
                            this.state.svgArray[j].src =this.checkHttp(this.state.svgArray[j].sceneWarnIcon);
                        }else{
                            this.state.svgArray[j].src =this.checkHttp(this.state.svgArray[j].sceneIcon);
                        }
                    }
                }
            }
        }

        if (!this.lock) {
            this.setState({
                svgArray:this.state.svgArray
            });
        }
    }

    /**
     * 创建websocket，实时获取告警信息二进制音频流
     * @returns {*}
     */
    initSoundWebSocket() {
        let that = this;
        let hostname = IP;
        if(this.state.hostname.indexOf("localhost")<0){
            hostname = this.state.hostname;
        }
        this.soundWs = new WebSocket("ws://"+hostname.replace("http://","")+"/websocket/voiceMonitor:" + localStorage.getItem("username"));
        this.soundWs.onopen = function (evt) {
            console.log("SoundConnection open ...");
        };

        this.soundWs.onmessage = function (evt) {
            console.log(evt);
            that.playSound(evt.data);
        };

        this.soundWs.onclose = function (evt) {
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

    /**
     * 判断图片路径是否有域名
     * @param url
     * @returns {*}
     */
    checkHttp=(url)=>{
        console.log(this.state.origin);
        let newUrl=url;
        if(url.indexOf("http://")<0){
            if(this.state.hostname.indexOf("localhost")<0){
                newUrl = this.state.origin+url;
            }else{
                newUrl = URL+url;
            }
        }
        return newUrl;
    }

    /**
     * 点击区域状态表
     * @returns {*}
     */
    clickRow(data){
        console.log(data);
        this.setState({
            activeIndex:(data.num-1)//获取点击行的索引
        })
        this.onClickAreaScene(data.id);
    }
    setClassName=(record,index)=>{//record代表表格行的内容，index代表行索引
        //判断索引相等时添加行的高亮样式
        return index === this.state.activeIndex ? "setTableClassName" : "";
    }

    /**
     * 点击左上角的区域场景列，图形中突出显示当前区域场景
     * @returns {*}
     */
    onClickAreaScene=(id)=>{
        let index = this.getIndexById(id);
        for(let i = 0;i<this.state.svgArray.length;i++){
            this.state.svgArray[i].style.border = "0px";
            this.state.svgArray[i].style.filter='none';
        }
        //当前设备高亮显示
        // this.state.svgArray[index].style.filter='drop-shadow(0 0 0.75rem black) opacity(90%)';
        this.state.svgArray[index].style.filter='opacity(75%)';
        this.state.svgArray[index].style.webkitFilter = 'opacity(75%)';
        this.setState({
            svgArray:this.state.svgArray
        })
    }

    onImgMouseOver=(e)=>{
        console.log(e);
        if (!e) e=window.event;
        console.log(e.target.id);
        this.onClickAreaScene(e.target.id);
    }

    onImgMouseOut =(e)=>{
        console.log(e);
        if (!e) e=window.event;
        console.log(e.target.id);
        this.clearStyleById(e.target.id);
    }

    clearStyleById=(id)=>{
        for(let i = 0;i<this.state.svgArray.length;i++){
            if(this.state.svgArray[i].id == id){
                this.state.svgArray[i].style.border = "0px";
                this.state.svgArray[i].style.filter='none';
            }
        }
    }

    render() {
        console.log(location);
            this.state.hostname = location.hostname;
            localStorage.setItem("hostname",this.state.hostname);
            this.state.origin = location.origin;
            localStorage.setItem("origin",this.state.origin);
        return (
            <div draggable="true">
                <BreadcrumbCustom/>
                <div className="mainSceneAreaWarnList mainSceneAreaWarn">
                    <audio autoPlay={true} id="aud"></audio>
                    <Table locale={{ emptyText: '无数据'}}
                           size={"small"}
                           dataSource={this.state.svgArray}
                           columns={this.columns}
                           pagination={false}
                           bordered={true}
                           rowClassName={this.setClassName} //表格行点击高亮
                           onRow={(record) => {//表格行点击事件
                               return {
                                   onClick: this.clickRow.bind(this,record),
                                   onMouseEnter: this.clickRow.bind(this,record),
                               };
                           }}
                    />
                </div>
                <div id="wrap"  className="mainSceneAreaWarn">
                    <div>{this.state.mainSvg}</div>
                    {
                        this.state.svgArray.map((item,index)=>{
                            return(
                                <div key={index}  id="areaSceneId">
                                    <Tooltip title={item.sceneName}>
                                        <img className="areaSceneImg" id={item.id} onMouseOver={this.onImgMouseOver} onMouseOut={this.onImgMouseOut} onClick={this.onClickCell.bind(this,item)}
                                             src={item.src} style={item.style}/>
                                    </Tooltip>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        )
    }
}
import React from 'react';
import './index.less'
import {message,Button,Table,Row, Col,Tooltip} from "antd";
import FWQ from "../../../images/areacellsvg/FWQ.svg";
import JHJ from "../../../images/areacellsvg/JHJ.svg";
import KHD from "../../../images/areacellsvg/KHD.svg";
import LYQ from "../../../images/areacellsvg/LYQ.svg";
import RJZY from "../../../images/areacellsvg/RJZY.svg";
import UPS from "../../../images/areacellsvg/UPS.svg";
import FWQGJ from "../../../images/areacellsvg/FWQ_gj.svg";
import JHJGJ from "../../../images/areacellsvg/JHJ_gj.svg";
import KHDGJ from "../../../images/areacellsvg/KHD_gj.svg";
import LYQGJ from "../../../images/areacellsvg/LYQ_gj.svg";
import RJZYGJ from "../../../images/areacellsvg/RJZY_gj.svg";
import UPSGJ from "../../../images/areacellsvg/UPS_gj.svg";
import BreadcrumbCustom from "../../../components/BreadcrumbCustom";
import axios from 'axios';
import {PATH,URL,IP} from '../../../utils/urls';
import {LOGTYPE} from "../../../utils/config";

const dataSource = [
    {
        key: '1',
        name: '胡彦斌',
        age: 32,
    },
    {
        key: '2',
        name: '胡彦祖',
        age: 42,
    },
];

const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    }
];

const svgTypeArray = [FWQ,KHD,UPS,LYQ,JHJ,RJZY];
const svgTypeGJArray = [FWQGJ,KHDGJ,UPSGJ,LYQGJ,JHJGJ,RJZYGJ];
export default class AreaSceneWarn extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id:"",
            areaSceneHardWareList:[],//接口中获取到设备列表
            svgArray:[],//在场景中的svg数组
            areaScenesArray:[],//左上角报警文字
            hardWareDataArray:[],//当前点击设置的信息，右上角显示
            hostname:"",//域名
            origin:"",
            modalVisible:false,//是否显示提示框
            selectCellId:-1,//当前选中图id,
        }
        this.state.origin = localStorage.getItem("origin");
        this.initWebSocket = this.initWebSocket.bind(this);
        this.ws = null;
        this.lock = false;
    }

    componentWillUnmount() {
        this.lock = true;
        //断开websocket
        if(this.ws !=null){
            this.ws.close();
        }
    }

    componentDidMount() {
        console.log(this.props);
        if(this.props.location.state){
            let srcStr=this.props.location.state.sceneImg;
            srcStr = this.checkHttp(srcStr);
            let areaMain = {
                svgCell:<img src={srcStr} className="areaImg"/>,
                id:-1
            }
            this.setState({
                svgArray:[areaMain],
                id:this.props.location.state.id
            })

            //获取当前区域场景的右侧列表
            this.getAreaSceneCellListFun();

            //创建websocket
            this.initWebSocket();
        }
    }

    /**
     *获取当前区域场景的列表
     */
    getAreaSceneCellListFun(){
        axios.post(PATH.resourceHardQuery,{
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                let dataArray = response.data.data;
                console.log(dataArray);
                for(let i = 0;i<dataArray.length;i++){
                    let src =null;
                    let style = {width:120,height:88,left:parseInt(dataArray[i].locationX),top:parseInt(dataArray[i].locationY)};
                    let currentWidth = 120;
                    let statusStyle=null;
                    if(dataArray[i].resouceStatus == 0){
                        statusStyle = {color:'black'};
                        src =svgTypeArray[dataArray[i].resouceType];
                    }else{
                        statusStyle = {color:'#09f309'};
                        src =svgTypeGJArray[dataArray[i].resouceType];
                    }
                    this.state.areaSceneHardWareList.push({
                        ...dataArray[i],
                        src:src,
                        style:style,
                        currentWidth:currentWidth,
                        statusStyle:statusStyle
                    });
                }
                this.setState({
                    areaSceneHardWareList:this.state.areaSceneHardWareList
                })
                //获取当前区域场景的元素
                this.getAreaSceneCellFun(this.props.location.state.id);
            }
        })
    }

    /**
     * 获取当前区域场景的元素
     */
    getAreaSceneCellFun(id){
        axios.post(PATH.resourceHardQuery,{
            sceneId:id
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                let dataArray = response.data.data;
                for(let i = 0;i<dataArray.length;i++){
                    dataArray[i].key = i+1;
                    let style = {
                        left:parseInt(dataArray[i].locationX),
                        top:parseInt(dataArray[i].locationY),
                        position: "absolute",
                        width:dataArray[i].width,
                        height:dataArray[i].height,
                        border:"0px",
                    };

                    //预警图片
                    let src = null;
                    if(dataArray[i].warnStatus == 0){
                        src =svgTypeArray[dataArray[i].resouceType];
                    }else{
                        src =svgTypeGJArray[dataArray[i].resouceType];
                    }

                    let index = this.getIndexById(dataArray[i].id);
                    this.state.areaSceneHardWareList[index].style = style;
                    let svgCell = <Tooltip title={dataArray[i].resouceName}>
                        <img id={dataArray[i].id} onMouseOver={this.onImgMouseOver} onMouseOut={this.onImgMouseOut}  onClick={this.onClickCell.bind(this)}
                             src={src} style={this.state.areaSceneHardWareList[index].style}/>
                    </Tooltip>;
                    this.state.svgArray.push({
                        svgCell:svgCell,
                        id:dataArray[i].id
                    });

                    this.setState({
                        areaScenesArray:dataArray,
                        svgArray:this.state.svgArray
                    })
                }
                console.log(this.state);
            }
        })
    }

    /**
     * 元素点击
     */
    onClickCell=(e)=>{
        if (!e) e=window.event;
        this.state.selectCellId = e.target.id;
        let index = this.getIndexById(e.target.id);
        for(let i = 0;i<this.state.areaSceneHardWareList.length;i++){
            this.state.areaSceneHardWareList[i].style.filter='none';
            this.state.areaSceneHardWareList[i].style.webkitFilter = 'none';
        }
        //当前设备高亮显示
        this.state.areaSceneHardWareList[index].style.filter='opacity(75%)';
        this.state.areaSceneHardWareList[index].style.webkitFilter = 'opacity(75%)';

        let resourceType = this.state.areaSceneHardWareList[index].resouceType;
        //右上角设置的信息
        this.state.hardWareDataArray = [];
        this.state.hardWareDataArray.push({
            title:"设备名称：",
            value:this.state.areaSceneHardWareList[index].resouceName
        });
        this.state.hardWareDataArray.push({
            title:"类型：",
            value:LOGTYPE[this.state.areaSceneHardWareList[index].resouceType+1].name
        });
        this.state.hardWareDataArray.push({
            title:"资源编号：",
            value:this.state.areaSceneHardWareList[index].appId
        });
        //客户端、服务器
        if(resourceType == 0 || resourceType == 1){
            this.state.hardWareDataArray.push({
                title:"CPU：",
                value:this.setRate(this.state.areaSceneHardWareList[index].cpuRate)
            });
            this.state.hardWareDataArray.push({
                title:"内存：",
                value:this.setRate(this.state.areaSceneHardWareList[index].memoryRate)
            });
            this.state.hardWareDataArray.push({
                title:"IO：",
                value:this.state.areaSceneHardWareList[index].io?this.state.areaSceneHardWareList[index].io:0
            });
        }else if(resourceType == 2){//ups
            this.state.hardWareDataArray.push({
                title:"电压：",
                value:this.state.areaSceneHardWareList[index].voltage?this.state.areaSceneHardWareList[index].voltage:0
            });
            this.state.hardWareDataArray.push({
                title:"电流：",
                value:this.state.areaSceneHardWareList[index].electric?this.state.areaSceneHardWareList[index].electric:0
            });
            this.state.hardWareDataArray.push({
                title:"有功功率：",
                value:this.state.areaSceneHardWareList[index].activePower?this.state.areaSceneHardWareList[index].activePower:0
            });
            this.state.hardWareDataArray.push({
                title:"无功功率：",
                value:this.state.areaSceneHardWareList[index].reactivePower?this.state.areaSceneHardWareList[index].reactivePower:0
            });
            this.state.hardWareDataArray.push({
                title:"电池剩余流量：",
                value:this.setRate(this.state.areaSceneHardWareList[index].remainingBattery)
            });
        }else if(resourceType == 3 || resourceType == 4) {//路由器、交换机
            this.state.hardWareDataArray.push({
                title:"端口带宽：",
                value:this.state.areaSceneHardWareList[index].networkInterface?this.state.areaSceneHardWareList[index].networkInterface:0
            });
            this.state.hardWareDataArray.push({
                title:"网络流量：",
                value:this.state.areaSceneHardWareList[index].io?this.state.areaSceneHardWareList[index].io:0
            });
        }

        this.state.hardWareDataArray.push({
            title:"告警：",
            value:this.state.areaSceneHardWareList[index].warnMsg?this.state.areaSceneHardWareList[index].warnMsg:"无"
        });

        //点击设置弹出设备详情
        this.setState({
            areaSceneHardWareList:this.state.areaSceneHardWareList,
            modalVisible: true,
            hardWareDataArray:this.state.hardWareDataArray
        });
        console.log(this.state);
    }

    /**
     * 处理cpu 硬盘 电量 内存，都乘以100
     * @param data
     * @returns {string}
     */
    setRate(data){
        let newData=0;
        if(data){
            newData = data*100;
        }
        return parseInt(newData)+"%";
    }

    /**
     * 通过设备列表id获取当前索引
     */
    getIndexById(id){
        let index = 0;
        for(let i = 0;i<this.state.areaSceneHardWareList.length;i++){
            if(this.state.areaSceneHardWareList[i].id == id){
                index = i;
                break;
            }
        }
        return index;
    }

    handleCancel = e => {
        console.log(e);
        this.setState({
            modalVisible: false,
        });
    };

    /**
     * 创建websocket，实时获取设备状态
     * @returns {*}
     */
    initWebSocket() {
        console.log(this.props);
        console.log(this.state);
        let that = this;
        let hostname = IP;
        if(this.state.hostname.indexOf("localhost")<0){
            hostname = this.state.hostname;
        }
        this.ws = new WebSocket("ws://"+hostname.replace("http://","")+"/websocket/resourceMonitor:" + localStorage.getItem("username"));
        this.ws.onopen = function (evt) {
            console.log("Connection open ...");
        };

        this.ws.onmessage = function (evt) {
            console.log("区域场景中设备告警");
            console.log(evt);
            if (evt.data.indexOf("连接成功") < 0) {
                that.updateHareAndSoftData(JSON.parse(evt.data));
            }
        };

        this.ws.onclose = function (evt) {
            console.log("Connection closed.");
        };
    }

    /**
     * 根据websocket返回的数据，更新设备和软件数据
     * @returns {*}
     */
    updateHareAndSoftData(updateData) {
        console.log(updateData);
        if (updateData.data.hardwareResource != null) {
            //更新设备数据
            let hardwareResourceList = updateData.data.hardwareResourceList;
            if(hardwareResourceList){
                for(let i = 0;i<hardwareResourceList.length;i++){
                    if (hardwareResourceList[i].id == this.selectCellId) {
                        let index = this.getIndexById(this.selectCellId);
                        this.state.areaSceneHardWareList[index] = {
                            ...this.state.areaSceneHardWareList[index],
                            ...hardwareResourceList[i]
                        };
                    }
                }
            }
        }

        if (!this.lock) {
            this.setState({
                areaSceneHardWareList: this.state.areaSceneHardWareList
            });
        }
    }

    selectSvgStyly=(id)=>{
        let index = this.getIndexById(id);
        for(let i = 0;i<this.state.areaSceneHardWareList.length;i++){
            this.state.areaSceneHardWareList[i].style.border = "0px";
            this.state.areaSceneHardWareList[i].style.filter='none';
            this.state.areaSceneHardWareList[i].style.webkitFilter = 'none';
        }
        //当前设备高亮显示
        this.state.areaSceneHardWareList[index].style.filter='opacity(75%)';
        this.state.areaSceneHardWareList[index].style.webkitFilter = 'opacity(75%)';
        this.setState({
            areaSceneHardWareList:this.state.areaSceneHardWareList
        })
    }

    onImgMouseOver=(e)=>{
        console.log(e);
        if (!e) e=window.event;
        console.log(e.target.id);
        this.selectSvgStyly(e.target.id);
    }

    onImgMouseOut =(e)=>{
        console.log(e);
        if (!e) e=window.event;
        console.log(e.target.id);
        this.clearStyleById(e.target.id);
    }

    clearStyleById=(id)=>{
        for(let i = 0;i<this.state.areaSceneHardWareList.length;i++){
            if(this.state.areaSceneHardWareList[i].id == id){
                this.state.areaSceneHardWareList[i].style.border = "0px";
                this.state.areaSceneHardWareList[i].style.filter='none';
                this.state.areaSceneHardWareList[i].style.webkitFilter = 'none';
                break;
            }
        }
        this.setState({
            areaSceneHardWareList:this.state.areaSceneHardWareList
        })
    }

    /**
     * 判断图片路径是否有域名
     * @param url
     * @returns {*}
     */
    checkHttp(url){
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

    render() {
        if(this.state.hostname == ""){
            this.state.hostname = location.hostname;
        }
        if(this.state.origin == ""){
            this.state.origin = location.origin;
        }
        let redStyle={color:"#ff0000"};
        let greenStyle={color:"#008669"};
        let titleStyle = {float:"right",right:10,top:10,width:350,border: "1px solid #000000",position: "absolute",background: "#fafafa"};
        return (

            <div draggable="true"  id="sceneManagerDiv">
                <BreadcrumbCustom first="区域场景"/>
                <div className="sceneSetUpDiv">
                    <div className="mainSceneAreaWarn">
                        <ul>
                            {
                                this.state.areaScenesArray.map((item,index)=>{
                                    return(
                                        <li key={index}>
                                            <span >{item.key}</span>
                                            <span >、</span>
                                            <span className="sceneList">{item.resouceName}</span>
                                            <span className="sceneList" style={item.warnStatus=="0"?greenStyle:redStyle}>{item.warnStatus=="0"?"\u00a0\u00a0\u00a0\u00a0\u00a0正常":"\u00a0\u00a0\u00a0\u00a0\u00a0告警"}</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div>
                        <div id="wrap" className="areascenewarndiv">
                            {
                                this.state.svgArray.map((item,index)=>{
                                    return(
                                        <div key={index}  id="areaSceneId">{item.svgCell}</div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {
                        this.state.modalVisible?(
                            <div style={titleStyle}>
                                <Button onClick={this.handleCancel} type="primary" icon="close" className="areaWarnTitleBtn"></Button>
                                <div className="areawarntitlecell">
                                    {
                                        this.state.hardWareDataArray.map((item,index)=>{
                                            return(
                                                <Row key={index}>
                                                    <Col span={9}>{item.title}</Col>
                                                    <Col span={15}>{item.value}</Col>
                                                </Row>
                                            )
                                        })
                                    }
                                <div className="clearBoth"></div>
                                </div>
                            </div>
                        ):null
                    }
                </div>
            </div>
        )
    }
}
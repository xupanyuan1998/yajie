import React from 'react'
import {Collapse} from 'antd';
import moment from 'moment';
const {Panel} = Collapse;
import {Table, Divider, Tag,Select,Button,Card, Icon, Avatar,Row, Col} from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../utils/urls';
import {getResourceNameByType} from '../../../utils/config';
import FWQ from "../../../images/areacellsvg/FWQ.svg";
import JHJ from "../../../images/areacellsvg/JHJ.svg";
import KHD from "../../../images/areacellsvg/KHD.svg";
import LYQ from "../../../images/areacellsvg/LYQ.svg";
import RJZY from "../../../images/areacellsvg/RJZY.svg";
import UPS from "../../../images/areacellsvg/UPS.svg";
import BreadcrumbCustom from "../../../components/BreadcrumbCustom";
const {Option}=Select;
const {Meta} = Card;
export default class WarnCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            warnCheckList:[],
            selectType:"-1",
            imgSrc:[FWQ,KHD,UPS,LYQ,JHJ,RJZY],
            resourceId:"",
            isSoftware:"",
            currentResourceId:"",
            currentIsSoftware:"",
            timeCount:6
        }
        this.lock = false;
    }

    componentDidMount() {
        if(localStorage.getItem("selectWarnResourceId")){
            this.state.resourceId = localStorage.getItem("selectWarnResourceId");
            this.state.isSoftware = localStorage.getItem("selectWarnIsSoftware");
            localStorage.setItem("selectWarnResourceId","");
            localStorage.setItem("selectWarnIsSoftware","");
        }
        this.getWarningList();

        this.timerID = setInterval(
            () => this.tick(),
            500
        );
    }

    tick(){
        if(this.state.timeCount>0){
            this.state.timeCount--
        }else{
            this.state.timeCount = 6;
            this.getWarningList();
        }
        if(localStorage.getItem("selectWarnResourceId")){
            this.state.resourceId = localStorage.getItem("selectWarnResourceId");
            this.state.isSoftware = localStorage.getItem("selectWarnIsSoftware");
            localStorage.setItem("selectWarnResourceId","");
            localStorage.setItem("selectWarnIsSoftware","");
        }
        if(this.state.resourceId!=""){
            if(this.state.currentResourceId != this.state.resourceId ||
                this.state.currentIsSoftware != this.state.isSoftware){
                this.setState({
                    selectType:"-1"
                })
                this.getWarningList();
            }
        }
        this.state.currentResourceId = this.state.resourceId;
        this.state.currentIsSoftware = this.state.isSoftware;
    }

    componentWillMount() {

    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    /**
     * 获取正在预警的资源
     * resourceType  0 服务器 1 客户端 2 UPS 3 路由器 4 交换机  5软件
     * id: 1
     isSoftware: 0
     remark: "磁盘空间已满"
     resourceId: 3
     resourceName: "LAPTOP-LN7CJPG4"
     resourceType: 1
     resourceTypeName: "客户端"
     warmStatus: 1
     warmStatusName: "预警中"
     */
    getWarningList(){
        let typeData = {};
        if(this.state.selectType != -1){
            typeData = {
                resourceType:this.state.selectType
            }
        }else if(this.state.resourceId !=""){
            typeData = {
                resourceId:this.state.resourceId,
                isSoftware:this.state.isSoftware
            }
        }
        axios.post(PATH.getWarningList,typeData).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                let dataArray = response.data.data;
                for(let i = 0;i<dataArray.length;i++){
                    dataArray[i].imgSrc=this.state.imgSrc[dataArray[i].resourceType];
                    if(dataArray[i].resourceIp){
                        dataArray[i].detailTitle = "IP";
                        dataArray[i].detail = dataArray[i].resourceIp;
                    }else if(dataArray[i].hardwareName){
                        dataArray[i].detailTitle = "所属设备";
                        dataArray[i].detail = dataArray[i].hardwareName;
                    }else{
                        dataArray[i].detailTitle = "状态";
                        dataArray[i].detail = dataArray[i].warmStatusName;
                    }
                    dataArray[i].remark =  dataArray[i].remark+";";
                    dataArray[i].remark = dataArray[i].remark.replace(new RegExp(",",'g'),";<br/>");
                }
                console.log(dataArray);
                this.setState({
                    warnCheckList:dataArray,
                })
            }
        })
    }

    /**
     * 资源类型切换
     * @param e
     */
    onSelectChange=e=>{
        this.setState({
            selectType:e
        })
    }

    /**
     * 查询按钮点击
     * @returns {*}
     */
    onWarnSeach=()=>{
        this.state.resourceId = "";
        localStorage.setItem("selectWarnResourceId","");
        localStorage.setItem("selectWarnIsSoftware","");
        this.getWarningList();
    }

    render() {
        return (
            <div id="sceneManagerDiv">
                <BreadcrumbCustom first="告警管理" second="告警检测" />
                <div>
                    <span>资源类型:</span>
                    <Select defaultValue="全部" value={this.state.selectType} onChange={this.onSelectChange} className="warnCheckSelect wid-150">
                        <Option value="-1">全部</Option>
                        <Option value="0">服务器</Option>
                        <Option value="1">客户端</Option>
                        <Option value="2">UPS</Option>
                        <Option value="3">路由器</Option>
                        <Option value="4">交换机</Option>
                        <Option value="5">软件资源</Option>
                    </Select>
                    <Button onClick={this.onWarnSeach} className="warnCheckSelect">查询</Button>
                </div>
                    {
                        this.state.warnCheckList.map((item,index)=>(
                            <div className="warncheckcardlist" key={index}>
                                <Card className="warnCheckCard">
                                    <div className="warnHead">
                                        <div className="warnCheckImg warnHeadLeft">
                                            <img src={item.imgSrc}></img>
                                        </div>
                                        <div className="warnCheckDetail warnHeadRigth">
                                            <Row>
                                                <Col span={9}>资源类型：</Col>
                                                <Col span={15}>{item.resourceTypeName}</Col>
                                            </Row>
                                            <Row>
                                                <Col span={9}>资源编号：</Col>
                                                <Col span={15}>{item.appId}</Col>
                                            </Row>
                                            <Row>
                                                <Col span={9}>名称：</Col>
                                                <Col span={15}>{item.resourceName}</Col>
                                            </Row>
                                            <Row>
                                                <Col span={9}>{item.detailTitle}：</Col>
                                                <Col span={15}>{item.detail}</Col>
                                            </Row>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="warnChecking">
                                            <div className="warnCheckingTitle">告警：</div>
                                            <div className="warnCheckingDetail" dangerouslySetInnerHTML={{ __html: item.remark }}></div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))
                    }
            </div>
        )
    }
}
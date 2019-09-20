import React from 'react'
import {Collapse} from 'antd';
const {Panel} = Collapse;
import {Table, message,Icon,Tabs,Progress} from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../utils/urls';
import {getResourceNameByType,updateArrayByType,getTimeByTemp} from '../../../utils/config';
import BreadcrumbCustom from "../../../components/BreadcrumbCustom";
import edit from "../../../images/operation/edit.png";
import closeBtn from '../../../images/icon/closebtn.png';
import openBtn from '../../../images/icon/openbtn.png';

const { TabPane } = Tabs;


//设备列表详细信息
const resourceArray = [];
export default class HardWareMonitor extends React.Component {
    /**
     * 设置资源中显示的属性
     */
//服务器、客户端、软件
    columns1 = [
        {
            title: '序号',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: '设备名称',
            dataIndex: 'resouceName',
            key: 'resouceName',
        },
        {
            title: '资源编号',
            dataIndex: 'appId',
            key: 'appId',
        },
        {
            title: 'CPU利用率',
            key: 'cpuRate',
            dataIndex: 'cpuRate',
            render:(text,record)=>{
                if(text){
                    return (
                        <div>
                            <Progress percent={parseInt(text*100)} strokeColor="#009d7f" size="small" status="active"   type="line" strokeWidth="13"/>
                        </div>
                    )
                }else{
                    return (
                        <Progress percent={0} size="small" strokeColor="#009d7f" status="active"   type="line" strokeWidth="13"/>
                    )
                }
            }
        },
        {
            title: '内存利用率',
            key: 'memoryRate',
            dataIndex: 'memoryRate',
            render:(text,record)=>{
                if(text){
                    return (
                        <div>
                            <Progress percent={parseInt(text*100)} strokeColor="#009d7f" size="small" status="active" type="line" strokeWidth="13"/>
                        </div>
                    )
                }else{
                    return (
                        <Progress percent={0} size="small" strokeColor="#009d7f" status="active" type="line" strokeWidth="13"/>
                    )
                }
            }
        },
        {
            title: '网络IO',
            key: 'io',
            dataIndex: 'io',
            render:(text,record)=>{
                if(!text || text==""){
                    return <span>
                        0
                    </span>
                }else{
                    return <span>
                        {text}
                    </span>
                }
            }
        },
        {
            title: '状态',
            key: 'warnStatusName',
            dataIndex: 'warnStatusName',
            render:(text,record)=>{
                if(!text || text==""){
                    return <span>
                        --
                    </span>
                }else{
                    //正常
                    if(record.warnStatus == 0){
                        if(record.serviceStatus == 0){
                            return (
                                <div>
                                    <span className="circleRedPoint"></span>
                                    <span className="redBgColor">{record.serviceStatusName}</span>
                                </div>
                            )
                        }else{
                            return (
                                <div>
                                    <span className="circleGreenPoint"></span>
                                    <span className="greenBgColor">{record.serviceStatusName}</span>
                                </div>
                            )
                        }
                    }else{
                        return (
                            <div>
                                <span className="circleRedPoint"></span>
                                <span className="redBgColor">{text}</span>
                            </div>
                        )
                    }
                }
            }
        },
        {
            title: '更新时间',
            key: 'currentDataTime',
            dataIndex: 'currentDataTime',
            render:(text,record)=>{
                console.log(text);
                if(!text || text==""){
                    return <span>
                        --
                    </span>
                }else{
                    return <span>
                        {text}
                    </span>
                }
            }
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            render: (text,record) => {
                //0未启动，1启动，2未发现
                if(record.serviceStatus ==1 ){
                    return <a href="javascript:void(0);" onClick={() => this.hardWareSwitch(0,record.id,34)} title={'关机'}><img src={closeBtn}/></a>
                   /* <button className="greenBtn" onClick={() => this.hardWareSwitch(0,record.id,34)} title="关机"></button>*/
                }else{
                    return <a href="javascript:void(0);" onClick={() => this.hardWareSwitch(0,record.id,33)} title={'开机'}><img src={openBtn}/></a>

                }
            },
        },
    ];
//UPS
    columns2 = [
        {
            title: '序号',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: '设备名称',
            dataIndex: 'resouceName',
            key: 'resouceName',
        },
        {
            title: '资源编号',
            dataIndex: 'appId',
            key: 'appId',
        },
        {
            title: '电压',
            dataIndex: 'voltage',
            key: 'voltage',
            render:(text,record)=>{
                if(!text || text==""){
                    return <span>
                        0
                    </span>
                }else{
                    return <span>
                        {text}
                    </span>
                }
            }
        },
        {
            title: '电流',
            dataIndex: 'electric',
            key: 'electric',
            render:(text,record)=>{
                if(!text || text==""){
                    return <span>
                        0
                    </span>
                }else{
                    return <span>
                        {text}
                    </span>
                }
            }
        },
        {
            title: '有功功率',
            dataIndex: 'activePower',
            key: 'activePower',
            render:(text,record)=>{
                if(!text || text==""){
                    return <span>
                        0
                    </span>
                }else{
                    return <span>
                        {text}
                    </span>
                }
            }
        },{
            title: '无功功率',
            dataIndex: 'reactivePower',
            key: 'reactivePower',
            render:(text,record)=>{
                if(!text || text==""){
                    return <span>
                        0
                    </span>
                }else{
                    return <span>
                        {text}
                    </span>
                }
            }
        },{
            title: '电池剩余流量',
            dataIndex: 'remainingBattery',
            key: 'remainingBattery',
            render:(text,record)=>{
                if(!text || text==""){
                    return <span>
                        0
                    </span>
                }else{
                    return <span>
                        {text}
                    </span>
                }
            }
        },


    ]
//路由器、交换机
    columns3 = [
        {
            title: '序号',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: '设备名称',
            dataIndex: 'resouceName',
            key: 'resouceName',
        },
        {
            title: '资源编号',
            dataIndex: 'appId',
            key: 'appId',
        },
        {
            title: '端口带宽',
            dataIndex: 'networkInterface',
            key: 'networkInterface',
            render:(text,record)=>{
                if(!text || text==""){
                    return <span>
                        0
                    </span>
                }else{
                    return <span>
                        {text}
                    </span>
                }
            }
        },
        {
            title: '网络流量',
            dataIndex: 'io',
            key: 'io',
            render:(text,record)=>{
                if(!text || text==""){
                    return <span>
                        0
                    </span>
                }else{
                    return <span>
                        {text}
                    </span>
                }
            }
        },
    ]

    COLUMNS = [this.columns1,this.columns1,this.columns2,this.columns3,this.columns3,this.columns3];
    constructor(props) {
        super(props);
        this.state = {
            resourceArray: resourceArray,//设备资源列表
            currentHardIndex: -1,//当前选中设备资源的索引,
            hostname:""//ip地址
        }
        this.initWebSocket = this.initWebSocket.bind(this);
        this.ws = null;
        this.lock = false;
    }

    componentDidMount() {
        //获取设备列表
        this.getHardWareResource();
    }

    /**
     * 获取设备列表
     * @returns
     */
    getHardWareResource() {
        axios.post(PATH.resourceHardQuery, {

        })
            .then(response => {
                console.log(response);
                if (response.data.code == 0) {
                    let dataArray = response.data.data;
                    if(dataArray.length<=0){
                        return;
                    }
                    let newDataArray = updateArrayByType(dataArray);
                    let newResourceArray = [];
                    for (let i = 0; i < newDataArray.length; i++) {
                        let cellDataArray = [];
                        for(let j = 0;j<newDataArray[i].length;j++){
                            cellDataArray.push({
                                number: (j+1),
                                ...newDataArray[i][j],
                            })
                        }
                        newResourceArray.push({
                            name: (newDataArray[i][0].resouceTypeName ? newDataArray[i][0].resouceTypeName : "")
                            , data: cellDataArray,
                            key: i,
                            warnMsg:dataArray[i].warnMsg
                        });
                    }
                    this.setState({
                        resourceArray: newResourceArray
                    });
                    console.log(this.state);
                    //创建长连接获取最新数据
                    this.initWebSocket();
                }
            });
    }

    /**
     * 创建websocket，实时获取设备状态
     * @returns {*}
     */
    initWebSocket() {
        console.log(this.props);
        console.log(this.state);
        let that = this;
        let hostname = IP;
        console.log(hostname);
        if(this.state.hostname.indexOf("localhost")<0){
            hostname = this.state.hostname;
            console.log(hostname);
        }
        console.log(hostname);
        this.ws = new WebSocket("ws://"+hostname.replace("http://","")+"/websocket/resourceMonitor:" + localStorage.getItem("username"));
        this.ws.onopen = function (evt) {
            console.log("Connection open ...");
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
     * 根据websocket返回的数据，更新设备和软件数据
     * @returns {*}
     */
    updateHareAndSoftData(updateData) {
        console.log(updateData);
        if (updateData.data.hardwareResourceList != null) {
            //更新设备数据
            let hardwareResourceList = updateData.data.hardwareResourceList;
            console.log(hardwareResourceList);
            if(hardwareResourceList){
                for (let i = 0; i < this.state.resourceArray.length; i++) {
                    for(let j = 0;j<this.state.resourceArray[i].data.length;j++){
                        for(let k = 0;k<hardwareResourceList.length;k++){
                            if(hardwareResourceList[k].id == this.state.resourceArray[i].data[j].id){
                                this.state.resourceArray[i].data[j] = {
                                    ...this.state.resourceArray[i].data[j],
                                    ...hardwareResourceList[k]
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!this.lock) {
            this.setState({
                resourceArray: this.state.resourceArray
            });
        }
    }

    /**
     * 组件将被卸载
     */
    componentWillUnmount() {
        console.log("跳转");
        this.lock = true;
        //断开websocket
        if(this.ws !=null){
            this.ws.close();
        }
    }

    /**
     * 设备开关机
     * dealTypeDictId:33开机 34关机 35重启机器 36启动服务 37关闭服务 38重启服务
     * isSoftware:0是设备1 是软件
     */
    hardWareSwitch(isSoftware,resourceId,dealTypeDictId){
        console.log(dealTypeDictId);
        axios.post(PATH.warnDeal,{
            dealTypeDictId:dealTypeDictId,
            isSoftware:isSoftware,
            resourceId:resourceId
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success(response.data.msg)
            }else{
                message.error(response.data.msg)
            }
        });
    }

    render() {
        if(this.state.hostname == ""){
            this.state.hostname = location.hostname;
        }
        return (
            <div id="sceneManagerDiv">
                <BreadcrumbCustom first="资源监控" second="设备资源" />
                <div className="sceneSetUpDiv">
                    <Tabs defaultActiveKey="1">{
                        this.state.resourceArray.map((item, index) => {
                            return (
                                <TabPane tab={item.name} key={index}>
                                    <Table locale={{ emptyText: '无数据'}} size={"small"} columns={this.COLUMNS[item.data[0].resouceType]}
                                           dataSource={item.data} bordered pagination={false}/>
                                </TabPane>
                            )
                        })
                    }
                    </Tabs>
                </div>

            </div>
        )
    }
}
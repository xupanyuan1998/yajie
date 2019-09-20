import React from 'react'
import {Collapse,Icon,Descriptions, Badge,Progress,Button} from 'antd';
import moment from 'moment';
import {Table,message} from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../utils/urls';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';
import setBtn from "../../../images/icon/parabtn.png";
import closeSoftBtn from "../../../images/icon/closesoftbtn.png";
import restartBtn from "../../../images/icon/restartbtn.png";
import openBtn from "../../../images/icon/openbtn.png";
import closeBtn from "../../../images/icon/closebtn.png";
import warnBtn from "../../../images/icon/warnBtn.png";

const {Panel} = Collapse;
//设备列表详细信息
const resourceArray = [];
export default class SoftwareMonitor extends React.Component {
    //设备菜单标题
    columns0 = [
        {
            title: '序号',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: '资源编号',
            dataIndex: 'appId',
            key: 'appId',
        },
        {
            title: 'IP',
            dataIndex: 'resouceIp',
            key: 'resouceIp',
        },
        {
            title: 'CPU利用率',
            key: 'cpuRate',
            dataIndex: 'cpuRate',
            render:(text,record)=>{
                if(text){
                    return <span>
                        {parseInt(text*100)}%
                    </span>
                }
            }
        },
        {
            title: '内存利用率',
            key: 'memoryRate',
            dataIndex: 'memoryRate',
            render:(text,record)=>{
                if(text){
                    return <span>
                        {parseInt(text*100)}%
                    </span>
                }else{
                    return <span>
                        0
                    </span>
                }
            }
        },
        {
            title: '硬盘利用率',
            key: 'disk',
            dataIndex: 'disk',
            render:(text,record)=>{
                if(text){
                    return <span>
                        {parseInt(text*100)}%
                    </span>
                }else{
                    return <span>
                        0
                    </span>
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
                    if(record.serviceStatus!=null){
                        return <span>
                                {record.serviceStatusName}
                            </span>
                    }
                }
            }
        },
        {
            title: '更新时间',
            key: 'currentDataTime',
            dataIndex: 'currentDataTime',
            render:(text,record)=>{
                if(text == null || text==""){
                    return <span>
                        --
                    </span>
                }else{
                    return <span>
                        {text}
                    </span>
                }
            }
        }
    ];
//软件菜单标题
    columns1 = [
        {
            title: '资源编号',
            dataIndex: 'hardwareAppId',
            key: 'hardwareAppId',
        },
        {
            title: '软件名称',
            dataIndex: 'resouceName',
            key: 'resouceName',
        },
        {
            title: '软件类型',
            dataIndex: 'resouceTypeName',
            key: 'resouceTypeName',
        },
        {
            title: 'CPU利用率',
            key: 'cpuRate',
            dataIndex: 'cpuRate',
            render:(text,record)=>{
                if(text){
                    return (
                        <div>
                            <Progress percent={parseInt(text*100)} strokeColor="#009d7f" size="small" status="active"  type="line" strokeWidth="13"/>
                        </div>
                    )
                }else{
                    return (
                        <Progress percent={0} size="small" strokeColor="#009d7f" status="active" type="line" strokeWidth="13"  type="line" strokeWidth="13"/>
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
                            <Progress percent={parseInt(text*100)} strokeColor="#009d7f" size="small" status="active"  type="line" strokeWidth="13"/>
                        </div>
                    )
                }else{
                    return (
                        <Progress percent={0} size="small" strokeColor="#009d7f" status="active"  type="line" strokeWidth="13"/>
                    )
                }
            }
        },
        {
            title: '网络IO',
            key: 'io',
            dataIndex: 'io',
            render:(text,record)=>{
                if(text){
                    return <span>
                        {text}
                    </span>
                }else{
                    return <span>
                        0
                    </span>
                }
            }
        },
        {
            title: '状态',
            key: 'warnStatus',
            dataIndex: 'warnStatus',
            render:(text,record)=>{
                if(record.warnStatus !=null){
                    if(record.warnStatus == 0){
                        if(record.serviceStatus!=null){
                            return <span>
                                {record.serviceStatusName}
                            </span>
                        }else{
                            return <span>
                                --
                            </span>
                        }
                    }else{
                         return <span className="softStatusBtn2"><Icon type="warning" theme="twoTone" twoToneColor="#ffff00" /> {record.warnStatusName}</span>
                    }
                }else{
                    return <span>
                        --
                    </span>
                }
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                if(record.serviceStatus ==1 ){
                    return (
                        <span>
                            <span><a href="javascript:void(0);" onClick={() => this.hardWareSwitch(1,record.id,37)} title={'关闭'}><img src={closeSoftBtn}/></a> </span>
                            <span><a href="javascript:void(0);" onClick={() => this.hardWareSwitch(1,record.id,38)} title={'重启'}><img src={restartBtn}/></a> </span>
                        </span>
                )
                }else{
                    return <a href="javascript:void(0);" onClick={() => this.hardWareSwitch(1,record.id,36)} title={'启动'}><img src={openBtn}/></a>

                }
            },
        },
    ];

    componentWillMount() {
        console.log(123);
    }

    constructor(props) {
        super(props);
        this.state = {
            resourceArray: resourceArray,//设备资源列表
            columns0: this.columns0,//设备菜单标题
            columns1: this.columns1,//软件菜单标题
            currentHardIndex: 0,//当前选中设备资源的索引,
            hostname:""//ip地址
        }
        this.onHardSoftListClick = this.onHardSoftListClick.bind(this);
        this.updateHareAndSoftData = this.updateHareAndSoftData.bind(this);
        this.initWebSocket = this.initWebSocket.bind(this);
        this.getTimeByTemp = this.getTimeByTemp.bind(this);
        this.hardWareSwitch = this.hardWareSwitch.bind(this);
        this.ws = null;
        this.lock = false;
    }

    componentDidMount() {
        //获取设备列表
        this.getHardWareResource();
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
            if(response.data.code == 0){
                message.success(response.data.msg)
                //获取设备列表
                this.getHardWareResource();
            }else{
                message.error(response.data.msg)
            }
        });
    }
    /**
     * 获取设备列表
     * @returns
     */
    getHardWareResource() {
        axios.post(PATH.resourceHardQuery, { resouceTypes:"0,1"})
            .then(response => {
                console.log(response);
                if (response.data.code == 0) {
                    let dataArray = response.data.data;
                    let newResourceArray = [];
                    for (let i = 0; i < dataArray.length; i++) {
                        newResourceArray.push({
                            name: "\u00a0\u00a0名称：" + dataArray[i].resouceName + "\u00a0\u00a0\u00a0\u00a0\u00a0"
                            , warnStatus: dataArray[i].warnStatus ? dataArray[i].warnStatus : 0
                            ,serviceStatus:dataArray[i].serviceStatus
                            ,resouceStatus:dataArray[i].resouceStatus
                            ,hardwareAppId:dataArray[i].appId,
                            warnMsg:dataArray[i].warnMsg,
                            resouceTypeName:dataArray[i].resouceTypeName,
                            resouceType:dataArray[i].resouceType,
                            id:dataArray[i].id
                            , data: [{
                                key: i,
                                ...dataArray[i],
                                number: i
                            }]
                        });
                    }
                    this.setState({
                        resourceArray: newResourceArray
                    });

                    console.log(newResourceArray);

                    for(let i = 0; i < dataArray.length; i++){
                        //获取默认打开的第一个设备下的软件
                        this.onHardSoftListClick(i);
                    }
                    //获取默认打开的第一个设备下的软件
                    // this.onHardSoftListClick(this.state.currentHardIndex);
                    //创建websocket
                    this.initWebSocket();
                }
            });
    }

    /**
     * 设备列表切换回调函数
     * @returns {*}
     */
    onHardSoftListClick(props) {
        //点击当前设置后，获取设备下的软件名称
        if (this.state.resourceArray.length <= 0 || props == null) {
            return;
        }
        this.state.currentHardIndex = props;
        if (this.state.resourceArray[props].softList == null ||
            this.state.resourceArray[props].softList.length <= 0) {
            axios.post(PATH.resourceSoftQuery, {
                hardwareId: this.state.resourceArray[props].data[0].id
            }).then(response => {
                let dataArray = response.data.data;
                console.log(response);
                let newSoftArray = [];
                for (let i = 0; i < dataArray.length; i++) {
                    newSoftArray.push({
                        key: i,
                        hardwareAppId:dataArray[i].hardwareAppId,
                        ...dataArray[i]
                    })
                }
                this.state.resourceArray[props].softList = newSoftArray;
                if (!this.lock) {
                    this.setState({
                        resourceArray: this.state.resourceArray
                    })
                }

                console.log(this.state.resourceArray);
            })
        }
    }

    /**
     * 创建websocket，实时获取设备状态
     * @returns {*}
     */
    initWebSocket() {
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
            if(hardwareResourceList){
                for (let i = 0; i < this.state.resourceArray.length; i++) {
                    for(let j = 0;j<hardwareResourceList.length;j++){
                        if (hardwareResourceList[j].id == this.state.resourceArray[i].id) {
                            this.state.resourceArray[i].serviceStatus = hardwareResourceList[j].serviceStatus;
                            this.state.resourceArray[i].warnStatus = hardwareResourceList[j].warnStatus;
                            this.state.resourceArray[i].serviceStatusName = hardwareResourceList[j].serviceStatusName;
                            this.state.resourceArray[i].warnStatusName = hardwareResourceList[j].warnStatusName;
                            this.state.resourceArray[i].data[0] = {
                                ...this.state.resourceArray[i].data[0],
                                ...hardwareResourceList[j]
                            }
                        }
                    }
                }
            }
        }

        if (updateData.data.softwareResourceList != null) {
            let softwareResourceList = updateData.data.softwareResourceList;
            //更新软件数据
            for (let i = 0; i < this.state.resourceArray.length; i++) {
                if (this.state.resourceArray[i].softList != null) {
                    for (let j = 0; j < this.state.resourceArray[i].softList.length; j++) {
                        for (let k = 0; k < softwareResourceList.length; k++) {
                            if (this.state.resourceArray[i].softList[j].id == softwareResourceList[k].id) {
                                this.state.resourceArray[i].softList[j] = {
                                    ...this.state.resourceArray[i].softList[j],
                                    ...softwareResourceList[k]
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
     * 时间戳转时间格式
     * @returns {*}
     */
    getTimeByTemp(num){
        return moment(num).format('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * 告警设备跳转到设备告警检测
     */
    goToWarn=(data)=>{
        console.log(data);
        if(data){
            localStorage.setItem("selectWarnResourceId",data.data[0].id);
            localStorage.setItem("selectWarnIsSoftware",0);
            this.props.history.push('/warncheck');
        }
    }

    /**
     * 软件监控中标题显示的设备状态信息
     * @param item
     * @returns {*}
     */
    genExtra = (item) =>{
        let iconHtml =<Icon type="database" />
        let hardStatusHtml = <span className="softStatusBtn3"><Icon type="disconnect" /> 未连接</span>;
        if(item.serviceStatus == 1){
            hardStatusHtml = <span className="softStatusBtn1"><Icon type="desktop"/> 正常</span>
        }
        if(item.warnStatus != 0){
            hardStatusHtml=<span className="softStatusBtn2" onClick={event => {
                this.goToWarn(item);
            }
            }>< img src={warnBtn}></img>  告警</span>
        }
        if(item.resouceStatus==1){
            iconHtml=<Icon type="desktop" />
        }
        return (
            <div className="merchHead">
                <div className="softStatusBtn0">
                    { iconHtml}
                    {item.resouceTypeName}
                </div>
                <div className="merchHeadRight">
                    <span className="softStatusName">{item.name}</span>
                    <div className="softStatusBtn">
                        {
                            hardStatusHtml
                        }
                    </div>
                </div>
            </div>
        );

    }

    render() {
        if(this.state.hostname == ""){
            this.state.hostname = location.hostname;
        }
        let locale = {
            emptyText: '无数据',
        };
        return (
            <div className="softwaremonitormain">
                <BreadcrumbCustom first="资源监控" second="软件资源" />

                <Collapse bordered defaultActiveKey={['0']}>
                    {
                        this.state.resourceArray.map((item, index) => {
                            //正常状态
                            if (item.warnStatus == 0) {
                                return (
                                    <Panel header="" key={index} extra={this.genExtra(item)}>
                                        {
                                            item.data.map((cell,i)=>{
                                                return(
                                                    <div key={i}>
                                                        <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }} size="default" className="descdiv">
                                                            <Descriptions.Item label="资源编号">{cell.appId}</Descriptions.Item>
                                                            <Descriptions.Item label="Ip地址">{cell.resouceIp}</Descriptions.Item>
                                                            <Descriptions.Item label="网络IO">{cell.io}</Descriptions.Item>
                                                            <Descriptions.Item label="状态">{cell.warnStatus == 0?cell.serviceStatusName:cell.warnStatusName}</Descriptions.Item>
                                                            <Descriptions.Item label="CPU利用率"><Progress percent={parseInt(cell.cpuRate*100)} strokeColor="#009d7f" size="small" status="active"   type="line" strokeWidth="13"/></Descriptions.Item>
                                                            <Descriptions.Item label="内存利用率"><Progress percent={parseInt(cell.memoryRate*100)} strokeColor="#009d7f" size="small" status="active"   type="line" strokeWidth="13"/></Descriptions.Item>
                                                            <Descriptions.Item label="硬盘利用率"><Progress percent={parseInt(cell.disk*100)} strokeColor="#009d7f" size="small" status="active"   type="line" strokeWidth="13"/></Descriptions.Item>
                                                            <Descriptions.Item label="更新时间">{cell.currentDataTime}</Descriptions.Item>
                                                        </Descriptions>
                                                    </div>
                                                )
                                            })
                                        }
                                        <Table locale={{ emptyText: '无数据'}} size={"small"}  locale={locale} columns={this.state.columns1}
                                               dataSource={item.softList} bordered pagination={false} align="center"/>
                                    </Panel>
                                )
                            }else{
                                return (
                                    <Panel className="softManagerMonitorPanel" header="" key={index} extra={this.genExtra(item)}>
                                        {
                                            item.data.map((cell,i)=>{
                                                return(
                                                    <div key={i}>
                                                        <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }} size="default" className="descdiv">
                                                            <Descriptions.Item label="资源编号">{cell.appId}</Descriptions.Item>
                                                            <Descriptions.Item label="Ip地址">{cell.resouceIp}</Descriptions.Item>
                                                            <Descriptions.Item label="网络IO">{cell.io}</Descriptions.Item>
                                                            <Descriptions.Item label="状态">{cell.warnStatus == 0?cell.serviceStatusName:cell.warnStatusName}</Descriptions.Item>
                                                            <Descriptions.Item label="CPU利用率"><Progress percent={parseInt(cell.cpuRate*100)} strokeColor="#009d7f" size="small" status="active"   type="line" strokeWidth="13"/></Descriptions.Item>
                                                            <Descriptions.Item label="内存利用率"><Progress percent={parseInt(cell.memoryRate*100)} strokeColor="#009d7f" size="small" status="active"   type="line" strokeWidth="13"/></Descriptions.Item>
                                                            <Descriptions.Item label="硬盘利用率"><Progress percent={parseInt(cell.disk*100)} strokeColor="#009d7f" size="small" status="active"   type="line" strokeWidth="13"/></Descriptions.Item>
                                                            <Descriptions.Item label="更新时间">{cell.currentDataTime}</Descriptions.Item>
                                                        </Descriptions>
                                                    </div>
                                                )
                                            })
                                        }
                                        <Table locale={{ emptyText: '无数据'}} size={"small"}  locale={locale} columns={this.state.columns1}
                                               dataSource={item.softList} bordered pagination={false} align="center"/>
                                    </Panel>
                                )
                            }
                        })
                    }
                </Collapse>
            </div>
        )
    }
}
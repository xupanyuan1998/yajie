import moment from 'moment';

/**
 * 根据类型获取类型名称
 * @param type
 * @returns {string}
 */
export function getResourceNameByType(type){
  let name = "";
  switch (type) {
    case 0:
      name="服务器"
      break;
    case 1:
      name="客户端"
      break;
    case 2:
      name="UPS"
      break;
    case 3:
      name="路由器"
      break;
    case 4:
      name="交换机"
          break;
    case 5:
      name="软件"
      break;
  }
  return name;
}

/**
 * 根据类型获取类型名称
 * @param type
 * @returns {string}
 */
export function getSoftResourceNameByType(type){
  let name = "";
  switch (type) {
    case 0:
      name="服务"
      break;
    case 1:
      name="程序"
      break;
    case 2:
      name="命令行"
      break;
  }
  return name;
}

/**
 * 根据状态类型，获取状态名称
 * @param type
 * @returns {string}
 */
export function getSoftStatusByType(type){
  let name = "";
  switch (type) {
    case 0:
      name="未启动"
      break;
    case 1:
      name="启动"
      break;
    case 2:
      name="未发现"
      break;
  }
  return name;
}

/**
 * 日志的类型
 * @type {{}[]}0 服务器 1 客户端 2 UPS 3 路由器 4 交换机 5 软件
 */
export const LOGTYPE = [
  {
    type:-1,
    name:"全部"
  },
  {
    type:0,
    name:"服务器"
  },
  {
    type:1,
    name:"客户端"
  },
  {
    type:2,
    name:"UPS"
  },
  {
    type:3,
    name:"路由器"
  },
  {
    type:4,
    name:"交换机"
  },
  {
    type:5,
    name:"软件"
  },
]
/**
 * 设备类型
 * @type {{}[]}0 服务器 1 客户端 2 UPS 3 路由器 4 交换机
 */
export const HARDWARETYPE = [
  {
    type:-1,
    name:"全部"
  },
  {
    type:0,
    name:"服务器"
  },
  {
    type:1,
    name:"客户端"
  },
  {
    type:2,
    name:"UPS"
  },
  {
    type:3,
    name:"路由器"
  },
  {
    type:4,
    name:"交换机"
  },
]

/**
 * 软件类型
 * @type
 */
export const SOFTWARETYPE = [
  {
    type:-1,
    name:"全部"
  },
  {
    type:0,
    name:"服务"
  },
  {
    type:1,
    name:"程序"
  },
  {
    type:2,
    name:"命令行"
  }
]

/**
 * 获取是否有按钮权限
 * @param name按钮标识
 * @returns {boolean}true：有权限，false：无权限
 */
export function checkPermission(name){
  let bool = false;
  let perMissionArray = localStorage.getItem("permList");
  for(let i = 0;i<perMissionArray.length;i++){
    if(perMissionArray[i].indexOf(name)>=0){
      bool = true;
      break;
    }
  }
  return bool;
}

/**
 * 获取唯一id,登录时需要发送uuid
 */
export function getUID(length) {
  return Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
}
/**
 * 时间戳转时间格式
 * @returns {*}
 */
export function getTimeByTemp(num){
  return moment(num).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 根据类型对对象数组分类
 */
export function updateArrayByType(dataArray) {
  console.log(dataArray);
  let newArray0 = dataArray.sort(compare);
  let newArray1 = [[newArray0[0]]];
  for(let i = 1;i<newArray0.length;i++){
    let bool = false;
    for(let j = 0;j<newArray1.length;j++){
      if(newArray1[j][0].resouceType == newArray0[i].resouceType){
        newArray1[j].push(newArray0[i]);
        bool = true;
      }
    }
    if(!bool){
      newArray1.push([newArray0[i]]);
    }
  }
  return newArray1;
}

let compare = function (obj1, obj2) {
  let val1 = obj1.resouceType;
  let val2 = obj2.resouceType;
  if (val1 < val2) {
    return -1;
  } else if (val1 > val2) {
    return 1;
  } else {
    return 0;
  }
}


/**
 * 设置资源中显示的属性
 */
//服务器、客户端、软件
const columns1 = [
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '名称',
    dataIndex: 'resouceName',
    key: 'resouceName',
  },
  {
    title: 'appid',
    dataIndex: 'appId',
    key: 'appId',
  },
  {
    title: 'CPU利用率',
    key: 'cupRate',
    dataIndex: 'cupRate',
  },
  {
    title: '内存利用率',
    key: 'memoryRate',
    dataIndex: 'memoryRate',
  },
  {
    title: '网络IO',
    key: 'io',
    dataIndex: 'io',
  },
  {
    title: '状态',
    key: 'resouceStatusName',
    dataIndex: 'resouceStatusName',
  },
  {
    title: '更新时间',
    key: 'updatetime',
    dataIndex: 'updatetime',
  }
];
//UPS
const columns2 = [
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '名称',
    dataIndex: 'resouceName',
    key: 'resouceName',
  },
  {
    title: 'appid',
    dataIndex: 'appId',
    key: 'appId',
  },
  {
    title: '电压',
    dataIndex: 'voltage',
    key: 'voltage',
  },
  {
    title: '电流',
    dataIndex: 'electric',
    key: 'electric',
  },
  {
    title: '有功功率',
    dataIndex: 'activePower',
    key: 'appId',
  },{
    title: '无功功率',
    dataIndex: 'reactivePower',
    key: 'appId',
  },{
    title: '电池剩余流量',
    dataIndex: 'remainingBattery',
    key: 'remainingBattery',
  },


]
//路由器、交换机
const columns3 = [
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '名称',
    dataIndex: 'resouceName',
    key: 'resouceName',
  },
  {
    title: 'appid',
    dataIndex: 'appId',
    key: 'appId',
  },
  {
    title: '端口带宽',
    dataIndex: 'networkInterface',
    key: 'networkInterface',
  },
  {
    title: '网络流量',
    dataIndex: 'io',
    key: 'io',
  },
]
export const COLUMNS = [columns1,columns1,columns2,columns3,columns3,columns3];

/**
 * 手机号验证
 * @param $poneInput
 * @returns {boolean}
 */
export function isPoneAvailable(phone) {
  let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(phone)) {
    return false;
  } else {
    return true;
  }
}

/**
 * 邮箱验证
 */
export function isEmail(email) {
  let bool = false;
  let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  if(reg.test(email)){
    bool = true;
  }
  return bool;
}

/**
 * 生成32位UUID
 */
export function uuidGenerator() {
  let originStr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      originChar = '0123456789abcdef',
      len = originChar.length;
  return originStr.replace(/x/g, function(match) {
    return originChar.charAt(Math.floor(Math.random() * len))
  })
}

/**
 * 时间戳转时间格式
 * @param inputTime
 * @returns {string}
 */
export function formatDate(inputTime) {
  let date = new Date(inputTime);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let minute = date.getMinutes();
  let second = date.getSeconds();
  return y + '-' + m + '-' + d;
}

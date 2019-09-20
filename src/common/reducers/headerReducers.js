// 创建action creator

export function showSideAction(payload) {
    return {
        type: 'SHOW-SIDE',
        payload,
    }
}

// 设置state初始值
const initState = {
    show: true
}

// reducer
export default (state=initState,action)=> {
    switch (action.type) {
        case 'SHOW-SIDE':
            return {
                ...state,
                show: action.payload
            }
        default:
            return state;
    }
}
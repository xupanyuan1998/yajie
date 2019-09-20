import actions from "../actions/Actions";
const initialState = {
    warnList: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actions.UPDATE_WARN_MESSAGE:
            return {
                ...state,
                admin: localStorage.getItem("username")
            };
        default:
            return state;
    }
};
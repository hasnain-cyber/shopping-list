import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {createStore} from "redux";

// redux store
export const reduxTypes = {
    ADD_SHOP: 0,
    DELETE_SHOP: 1,
    MODIFY_SHOP: 2,
    INIT_DEFAULTS: 3
};

export type storeItemType = {
    shopName: string,
    area: number,
    category: number,
    startDate: string,
    endDate: string
}

export const initDefaults = () => {
    return {
        type: reduxTypes.INIT_DEFAULTS,
        payload: [],
    };
};
export const addItem = (itemObject: storeItemType) => {
    return {
        type: reduxTypes.ADD_SHOP,
        payload: itemObject,
    };
};
export const deleteItem = (deleteName: string) => {
    return {
        type: reduxTypes.DELETE_SHOP,
        payload: deleteName,
    };
};
export const modifyItem = (modifyName: string, newItemObject: storeItemType) => {
    return {
        type: reduxTypes.MODIFY_SHOP,
        payload: {modifyName, newItemObject},
    };
};

// reducers
const shopReducer = (state = Array<storeItemType>(), action: { type: any; payload: any; }) => {
    switch (action.type) {
        case reduxTypes.ADD_SHOP:
            const tempList = state
            tempList.push(action.payload)
            return tempList;
        case reduxTypes.DELETE_SHOP:
            return state.filter(element => element.shopName !== action.payload);
        case reduxTypes.MODIFY_SHOP:
            return state.map(element => {
                if (element.shopName === action.payload.modifyName) {
                    return action.payload.newItemObject
                } else {
                    return element
                }
            });
        case reduxTypes.INIT_DEFAULTS:
            return action.payload;
    }
};

// the actual redux store
export const store = createStore(shopReducer);
store.dispatch(initDefaults())

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

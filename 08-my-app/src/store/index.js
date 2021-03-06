import { createStore, combineReducers, applyMiddleware } from 'redux';
import bugsReducer from '../bug-tracker/reducers';
import { spinnerReducer, filterReducer } from '../spinner/reducers';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    bugsData : bugsReducer,
    spinnerData : spinnerReducer,
    filterData : filterReducer
});

function loggerMiddleware(store){
    return function loggerNext(next){
        console.log('logger next -> ', next);
        return function loggerAction(action){
            console.group(JSON.stringify(action));
            console.group('Before');
            console.log(store.getState());
            console.groupEnd();
            next(action);
            console.group('After');
            console.log(store.getState());
            console.groupEnd();
            console.groupEnd();
        }
    }
}

function asyncMiddleware(store){
    return function(next){
        return function(action){
            if (typeof action === 'function'){
                return action(next);
            } else {
                return next(action);
            }
        }
    }
}

function promiseMiddleware(store){
    return function(next){
        return function(action){
            if (action instanceof Promise){
                action.then(function(response){
                    next(response);
                });
            }else {
                return next(action)
            }
        }
    }
}
const appStore = createStore(rootReducer, applyMiddleware(loggerMiddleware, thunk, promiseMiddleware));

export default appStore;

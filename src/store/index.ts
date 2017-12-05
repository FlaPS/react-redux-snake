import {applyMiddleware, compose, createStore, Store} from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducer'
import {GameState} from './state'
import snakeSaga from './snakeSaga'

const REDUX_DEV_TOOLS = '__REDUX_DEVTOOLS_EXTENSION__'

const sagaMiddleware = createSagaMiddleware()

export const configureFrontendStore = () => {
    const store =  createStore(reducer, getFrontEndMeddlewares())
    store['runSaga'] = sagaMiddleware.run
    store['runSaga'](snakeSaga)
    return store
}

const getFrontEndMeddlewares = () =>
    window[REDUX_DEV_TOOLS] ?
        compose(
            applyMiddleware(sagaMiddleware),
            window[REDUX_DEV_TOOLS]()
        )
        :
        compose(
            applyMiddleware(sagaMiddleware)
        )

const store: Store<GameState> = configureFrontendStore() as any as Store<GameState>

export default () => store


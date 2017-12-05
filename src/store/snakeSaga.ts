import bindKeyboard from './bindKeyboard'
import {put, select, takeEvery} from 'redux-saga/effects'
import {isType} from '../utils/fsa'
import actions from './actions'
import {GameState} from './state'
import {delay, takeLatest} from 'redux-saga'
import {makeMove, initGameBoard} from './snakeApi'


function* runGame() {
    const state: GameState = yield select()

    yield put(initGameBoard(state))

    while (true) {
        yield delay(state.settings.timeout)
        yield put(makeMove(yield select()))
    }
}

const isActionToRestart = action =>
    isType(actions.gameOver)(action) ||
    isType(actions.settings)(action) ||
    isType(actions.start)(action)

export default function*() {
    yield takeLatest(isActionToRestart, runGame)
    yield put(actions.start())

    bindKeyboard()
}

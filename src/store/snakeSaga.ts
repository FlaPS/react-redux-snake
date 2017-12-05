import { directionLens } from './optics'
import bindKeyboard from './bindKeyboard'
import {put, select, takeEvery, take, race, call} from 'redux-saga/effects'
import {isType} from '../utils/fsa'
import actions from './actions'
import {GameState} from './state'
import {delay, takeLatest} from 'redux-saga'
import {makeMove, initGameBoard} from './snakeApi'

function* takeOtherDirection() {
    const previousDirection = yield select(directionLens.get)
    while (true) {
        const action = yield take(isType(actions.changeDirection))
        const newDirection = yield select(directionLens.get)

        // direction was changed, or same direction was invoked
        if (previousDirection !== newDirection ||
            newDirection === action.payload
        )
                return
    }

}

function* runGame() {
    const state: GameState = yield select()

    yield put(initGameBoard(state))

    while (true) {

        const {time, press} = yield race({
            delay: delay(state.settings.timeout),
            press: call(takeOtherDirection),
        })
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

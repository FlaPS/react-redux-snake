import { GameState, Direction } from './state'
import { caseReducer } from '../utils/caseReducer'
import gameState from './state'
import actions from './actions'
import { boardLens, directionLens, settingsLens } from './optics'

const ignoreDirection = (prev: Direction, next: Direction) =>
    (prev === Direction.LEFT && next === Direction.RIGHT) ||
    (prev === Direction.RIGHT && next === Direction.LEFT) ||
    (prev === Direction.TOP && next === Direction.BOTTOM) ||
    (prev === Direction.BOTTOM && next === Direction.TOP)

export default caseReducer<GameState>(gameState)
    .merge(actions.board,
        (_, {payload}) =>
            boardLens.modify( s => ({...s, ...payload}))(_)
    )
    .merge(actions.settings,
        (_, {payload}) =>
            settingsLens.modify( s => ({...s, ...payload}))(_)
    )
    .merge(actions.changeDirection,
        (state, {payload}) =>
            directionLens.modify( direction =>
                ignoreDirection(direction, payload)
                    ? direction
                    : payload
            )
            (state)
    )


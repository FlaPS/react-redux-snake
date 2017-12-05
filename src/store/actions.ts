import { actionCreatorFactory } from '../utils/fsa'
import { Direction, Settings, BoardState } from './state'

const factory = actionCreatorFactory('game')

export default {
    changeDirection: factory<Direction>('DIRECTION_CHANGED'),
    tick: factory('TICKED'),
    start: factory('STARTED'),
    gameOver: factory('GAME_OVERED'),

    settings: factory<Partial<Settings>>('SETTINGS_CHANGED'),
    board: factory<Partial<BoardState>>('BOARD_CHANGED'),
}
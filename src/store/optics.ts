import { Lens} from 'monocle-ts'
import { GameState, BoardState, Point } from './state'

export const boardLens = Lens.fromProp<GameState, 'board'>('board')

export const settingsLens = Lens.fromProp<GameState, 'settings'>('settings')

export const directionLens = boardLens.compose(Lens.fromProp<BoardState, 'direction'>('direction'))

const snake = Lens.fromProp<BoardState, 'snake'>('snake')
export const snakeLens = boardLens.compose(snake)

const food = Lens.fromProp<BoardState, 'food'>('food')
export const foodLens = boardLens.compose(food)

export const xLens = Lens.fromProp<Point, 'x'>('x')
export const yLens = Lens.fromProp<Point, 'y'>('y')


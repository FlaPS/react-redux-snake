import {always, any, complement, cond, dec, equals, gt, identity, inc, init, lte, T, until} from 'ramda'
import {settingsLens, xLens, yLens} from './optics'
import {Direction, GameState, Point, Settings} from './state'
import actions from './actions'

const includes = array => value =>
    any(equals(value), array)

const notIncludes = array =>
    complement(includes(array))

const grip = limit => cond([
    [lte(limit), always(0)],
    [gt(0), always(limit - 1)],
    [T, identity],
])

const gripPoint = ({cols, rows}: Settings) => ({x, y}: Point) => ({
    x: grip(cols)(x),
    y: grip(rows)(y),
})

const random = max =>
    Math.floor(Math.random() * max)

const randomPoint = (state: GameState) => () => ({
    x: random(settingsLens.get(state).cols),
    y: random(settingsLens.get(state).rows),
})

const randomEmptyPoint = (state, array) =>
    until(
        notIncludes(array),
        randomPoint(state),
        randomPoint(state)()
    )

const initGameBoard = (state: GameState ) => {
    const food = randomEmptyPoint(state, [])
    const snake = [randomEmptyPoint(state, [food])]
    return actions.board({
        food,
        snake,
        direction: Direction.LEFT,
    })
}

const movePoint = direction => cond([
    [() => equals(Direction.LEFT, direction), xLens.modify(dec)],
    [() => equals(Direction.RIGHT, direction), xLens.modify(inc)],
    [() => equals(Direction.TOP, direction), yLens.modify(dec)],
    [() => equals(Direction.BOTTOM, direction), yLens.modify(inc)],
])

const makeMove = ({settings, board}: GameState) => {

    // find new point of head
    const oldSnake = board.snake
    const snakeHead = oldSnake[0]
    const movedPoint = movePoint(board.direction)(snakeHead)
    const point = gripPoint(settings)(movedPoint)
    const food = board.food

    // check head position
    if (equals(point, food))
        return actions.board({
            snake: [food, ...oldSnake],
            food: randomEmptyPoint({settings, board}, [food, ...oldSnake]),
        })

    else if (includes(oldSnake)(point))
        return actions.gameOver()

    return actions.board({
        snake: [point, ...init(oldSnake)],
    })
}

export {
    initGameBoard,
    makeMove,
}

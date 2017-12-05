export enum Direction {
    LEFT,
    RIGHT,
    TOP,
    BOTTOM,
}

const gameState = {
    board: {
        snake: [] as Point[],
        food:  {x: 0, y: 0} as Point,
        direction: Direction.RIGHT as any as Direction,
    },
    settings: {
        rows: 10,
        cols: 10,
        timeout: 300,
    },
}

export type Point = {
    x: number
    y: number
}

export type BoardState = typeof gameState.board
export type Settings = typeof gameState.settings
export type GameState = typeof gameState

export default gameState

import * as React from 'react'
import Cell, {CellType} from './Cell'
import {BoardState, GameState} from '../store/state'
import {addIndex, any, equals, map, times} from 'ramda'
import styled from 'styled-components'
import props from '../utils/props'

const mapIndexed = addIndex(map)

const Row = styled.div`
    display: flex;
`
type BoardProps = {
    cells: CellType[][]
}

const renderCells = mapIndexed(Cell)

const renderRows = mapIndexed( (cells: CellType[], index: number) =>
    <Row key={String(index)}>
        {renderCells(cells)}
    </Row>
)

const BoardView = (props: BoardProps) =>
    <div>
        {renderRows(props.cells)}
    </div>

const getCellType  = (board: BoardState) => (coord : {x: number , y: number}) => {
    const match = equals(coord)
    if (match(board.food))
        return CellType.FOOD

    const [head, ...tail] =  board.snake || [{x: 0, y: 0}]
    if (match(head))
        return CellType.HEAD

    if (any(match, tail))
        return CellType.SNAKE

    return CellType.EMPTY
}

const mapStateToCells = ({settings, board}: GameState) =>
    times( y =>
        times( x =>
            getCellType(board)({x, y}),
            settings.cols
        ),
        settings.rows
    )


const ConnectedBoard = props(BoardView)
    .connectProp('cells', mapStateToCells)

export default ConnectedBoard

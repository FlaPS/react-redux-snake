import * as React from 'react'
import styled from 'styled-components'
import caseRender from '../utils/caseRender'

const CELL_SIZE = 20

const Cell = styled.div`
    width: ${CELL_SIZE}px;
    height: ${CELL_SIZE}px;
    border: 1px solid grey;
`
const Food = Cell.extend`
    background-color: blue;
`
const Snake = Cell.extend`
    background-color: green;
`
const Head = Cell.extend`
    background-color: lightgreen;
`

export enum CellType {
    EMPTY,
    SNAKE,
    HEAD,
    FOOD
}


const AnyCell = caseRender<{type: CellType}>(Cell)
    .match(props => props.type === CellType.FOOD, Food)
    .match(props => props.type === CellType.HEAD, Head)
    .match(props => props.type === CellType.SNAKE, Snake)

export default (type: CellType, key?: number) =>
    <AnyCell type={type} key={String(key)} />

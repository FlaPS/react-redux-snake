import { Direction } from './state'
import getStore from './index'
import actions from './actions'

const actionsByKey = {
    ArrowDown: actions.changeDirection(Direction.BOTTOM),
    ArrowUp: actions.changeDirection(Direction.TOP),
    ArrowLeft: actions.changeDirection(Direction.LEFT),
    ArrowRight: actions.changeDirection(Direction.RIGHT),
    [' ']: actions.start(),
}

const listener = (event: KeyboardEvent) => {
    if (event.defaultPrevented)
        return // Do nothing if the event was already processed

    const action = actionsByKey[event.key]

    if (action) {
        getStore().dispatch(action)
        event.preventDefault()
    }
}


export default () => {
    window.addEventListener(
        'keydown',
        listener,
        true
    )
    return () =>  window.removeEventListener('keydown', listener)
}

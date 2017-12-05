import { settingsLens } from '../store/optics'
import * as React from 'react'
import { Settings, GameState } from '../store/state'
import props from '../utils/props'
import { DispatchProp } from 'react-redux'
import Input from './Input'
import actions from '../store/actions'

type SettingsViewProps = {
    settings: Settings
} & DispatchProp<GameState>

const bindInput = (props: SettingsViewProps) => (key: keyof Settings) => ({
    value: props.settings[key],
    onChange: value =>
        props.dispatch(
            actions.settings({[key]: value})
        ),
})

const SettingsView = (props: SettingsViewProps) => {
    const getInput = bindInput(props)
    return  <div>
                <Input
                    label='Ширина:'
                    min={4}
                    max={101}
                    {...getInput('cols')}
                />
                <Input
                    label='Высота:'
                    min={4}
                    max={101}
                    {...getInput('rows')}
                />
                <Input
                    label='Частота:'
                    min={9}
                    max={1001}
                    {...getInput('timeout')}
                />
            </div>
}

export default props(SettingsView)
    .connectProp('settings', settingsLens.get)

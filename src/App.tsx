import * as React from 'react'
import {Provider} from 'react-redux'
import getStore from './store/'
import Board from './components/BoardView'
import SettingsView from './components/SettingsView'

export default () =>
    <Provider store={getStore()}>
        <div>
            <SettingsView />
            <Board />
        </div>
    </Provider>

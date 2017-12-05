import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './app'


const rootElement = document.getElementById('app')

export const render = Component =>
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>
        , rootElement
    )

render(App)

declare const module: any
if (module.hot)
    module.hot.accept('./App', () => {
        render(App)
    })


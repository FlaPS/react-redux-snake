import * as React from 'react'
import {omit} from 'ramda'

export type Renderable<P = {}> =
    React.ComponentType<P> | React.ReactNode

const isProps = (props): props is {children?: Renderable<any> } =>
    typeof props !== 'function' && props.children !== undefined

/**
 * TODO:
 * bring memoize here, optimize obejct destruction
 */
export default <P = {}>(
    children: Renderable<P>,
    props?: (P & {children?: Renderable<P> } )
  ) => {
        const omitedProps = props
                ? (children === props.children ? omit(['children'], props) : props)
                : {}
        return typeof children === 'function'
                    ? React.createElement(children as any as React.ComponentType<P>, omitedProps as any)
                    : children
    }

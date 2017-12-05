import { GameState } from '../store/state'
import { Store } from 'redux'
import * as React from 'react'
import {connect} from 'react-redux'
import * as TL from 'typelevel-ts'

/**
 *
 * Utils to propam props
 */
const factory = <State> (store?: Store<State>) => {
    type Selector<P, I = any, O = any> = (state: State, props: P & I) => O

    type PropsMapper<P, I, O extends Partial<P>  = P> = (props: I) => O | O

    type Mapper<P> = {
        key: keyof P
        selector: Selector<P>
    }

    const props = <P, OriginalProps = P>(
        Comp: React.ComponentType<P>,
        stateMappers: Mapper<OriginalProps>[] = [],
        withPropsMappers: PropsMapper<P, OriginalProps>[] = []
        ) => {
        const reduceMappers = (state: State, props?: P) =>
            stateMappers.reduce(
                (out, mapper) =>
                        Object.assign(
                            {},
                            out,
                            {
                                [mapper.key] : mapper.selector(state, out),
                            }
                        )
                    ,
                props
            )

        const Result = reduceMappers.length
            ? connect(reduceMappers)(Comp)
            : Comp

        /**
         * Connect single prop of component to the store
         */
        const connectProp = <I, K extends keyof OriginalProps> (key: K, selector: Selector<OriginalProps, I>) =>
            props<TL.ObjectOmit<P, K> & I, OriginalProps>(
                Comp as any as React.ComponentType<TL.ObjectOmit<P, K> & I>,
                [...stateMappers, {key, selector}],
                withPropsMappers as any as Array<PropsMapper<TL.ObjectOmit<P, K> & I, OriginalProps>>
            )

        /*const withProps = <I = P, O extends Partial<P> = Partial<P>> (mapper: PropsMapper<P, I, O>) =>
            props<TL.ObjectOmit<P, keyof O> & I, OriginalProps>(
                Comp as any as React.ComponentType<TL.ObjectOmit<P, keyof O> & I>,
                stateMappers,
                [...withPropsMappers, mapper] as any as Array<PropsMapper<TL.ObjectOmit<P, keyof O> & I, OriginalProps>
            )
        */

        return Object.assign(
            Result as any as React.ComponentType<P>,
            {
                connectProp,
            /*  withProps, */
            }
        )

    }

    return props
}

export default factory<GameState>()


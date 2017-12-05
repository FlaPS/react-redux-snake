import FSA, {IConsumer, isType} from './fsa'
import {merge} from 'ramda'

export const defaultCaseReducer =
    <S, A>(defaultState: Partial<S>) =>
        (state: Partial<S> = defaultState, action?: A): Partial<S>  =>
            state

export const caseReducer = <S, Actions = void>(
    initialState: Partial<S>,
    reducer?: (state: Partial<S>, action?: Actions) => Partial<S>
    ) => {
        reducer = reducer || defaultCaseReducer<S, Actions>(initialState as S)

        return Object.assign(
            reducer,
            {
                ['merge']: <P, S1>(
                    creator: FSA.ActionCreator<P> | FSA.EmptyActionCreator,
                    child: IConsumer<S1 & S, FSA.FactoryAction<P>>) =>
                        caseReducer<S & S1, Actions & FSA.FactoryAction<P>>(
                                initialState as any as Partial<S & S1>,

                                (   state: S1 & S = initialState as any as S1 & S,
                                    action: Actions & FSA.FactoryAction<P>) => {
                                        creator = creator as FSA.ActionCreator<P>
                                        return isType(creator)(action)
                                            ? (
                                                merge(state, child(state, action)) as any as Partial<S1 & S>
                                            )
                                            : (reducer as any as IConsumer<Partial<S1 & S>, Actions & FSA.FactoryAction<P>>)
                                                (state as any as Partial<S1 & S>, action)

                                }
                        ),
            }
        )
    }

export default caseReducer

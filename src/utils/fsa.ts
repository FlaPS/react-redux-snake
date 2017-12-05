export const factoryDelimeter = '/'

export interface FactoryAction<P> {
    type: string
    payload: P
    error?: boolean
    meta?: {} | any | null
}

export type FactoryAnyAction = FactoryAction<any>


export type ActionSelector<P> = (action: FactoryAction<P>) => action is FactoryAction<P>

export type IConsumer<I, A, O = I> = (state: I, action: A) => O

export const reducerFactory = <I, P, O>(reducer: IConsumer<I, FactoryAction<P>,  O>) =>
    (selector: ActionSelector<P>) =>
        (state: I, action: FactoryAction<P>): O =>
            selector(action) ? reducer(state, action) : state as any as O

export interface Success<P, S> {
    params: P
    result: S
}

export interface Failure<P, E> {
    params: P
    error: E
}

export const isType = <P>(actionCreator: ActionCreator<P> | EmptyActionCreator) =>
    (action: FactoryAnyAction): action is FactoryAction<P> =>
        action.type === actionCreator['type']

export const isTypeOfAny = <P>(actionCreator: Array<ActionCreator<P>>) =>
    (action: FactoryAnyAction): action is FactoryAction<P> =>
        actionCreator.some( creator => creator.type === action.type)

export const isHasCreatorFactory = (acf: any): acf is {factory: ActionCreatorFactory} =>
    acf && acf['factory']

export const isNamespace = (actionFactory: ActionCreatorFactory | {factory: ActionCreatorFactory}) =>
    (action: FactoryAnyAction)  =>
    isHasCreatorFactory(actionFactory)
        ? action.type.startsWith(actionFactory.factory.base)
        : action.type.startsWith(actionFactory.base)

export interface ActionCreator<P> {
    type: string
    example: FactoryAction<P>
    handler: (payload: P) => any
    reduce: <I, A, O>(reducer: IConsumer<I, A, O>) => IConsumer<I, A, O>
    (payload: P, meta?: any | null): FactoryAction<P>
}

export type EmptyActionCreator = (payload?: undefined, meta?: any | null) => FactoryAction<undefined>
    & ActionCreator<undefined> & {type: string}

export interface AsyncActionCreators<P, S, E> {
    type: string
    started: ActionCreator<P>
    done: ActionCreator<Success<P, S>>
    failed: ActionCreator<Failure<P, E>>
}

export interface EmptySuccess<S> {
    result: S
}

export interface EmptyFailure<E> {
    error: E
}

export interface EmptyAsyncActionCreators<S, E> {
    type: string
    started: EmptyActionCreator
    done: ActionCreator<EmptySuccess<S>>
    failed: ActionCreator<EmptyFailure<E>>
}

export interface ActionCreatorFactory {
    (
        type: string,
        commonMeta?: any,
        error?: boolean
    ): EmptyActionCreator

    <P>(
        type: string,
        commonMeta?: any,
        isError?: (payload: P) => boolean | boolean
    ): ActionCreator<P>

    base: string

    async<P, S>(
        type: string,
        commonMeta?: any
    ): AsyncActionCreators<P, S, any>

    async<undefined, S, E>(
        type: string,
        commonMeta?: any
    ): EmptyAsyncActionCreators<S, E>

    async<P, S, E>(
        type: string,
        commonMeta?: any
    ): AsyncActionCreators<P, S, E>
}

declare const process: {
    env: {
        NODE_ENV?: string;
    };
}


export function actionCreatorFactory(
    prefix?: string | null,
    factoryMeta: {} = {},
    defaultIsError = p => p instanceof Error
): ActionCreatorFactory {
    const actionTypes: {[type: string]: boolean} = {}

    const base = prefix ? `${prefix}${factoryDelimeter}` : ''

    function actionCreator <P>(
        type: string,
        commonMeta?: {} | null,
        isError: ((payload: P) => boolean) | boolean = defaultIsError
    ): ActionCreator<P> {

        const fullType = base + type

        if (process.env.NODE_ENV !== 'production') {
            if (actionTypes[fullType])
                throw new Error(`Duplicate action types   : ${fullType}`)

            actionTypes[fullType] = true
        }
        const creator = Object.assign(
            (payload: P, meta?: {} | null) => {
                const action: FactoryAction<P> = {
                    type: fullType,
                    payload,
                }

                if (commonMeta || meta || factoryMeta)
                    action.meta = Object.assign({}, factoryMeta, commonMeta, meta)


                if (isError && (typeof isError === 'boolean' || isError(payload)))
                    action.error = true


                return action
            },
            {
                reduce: <I, O = I>(f: IConsumer<I, FactoryAction<P>, O>): IConsumer<I, FactoryAction<P>, O> => f,
                type: fullType,
                base,
            }
        )

        const reduce = <I, O>(reducer: IConsumer<I, FactoryAction<P>, O>) =>
                reducerFactory(reducer)(isType(creator as any as ActionCreator<P>))

        const handler = (payload: P): any => ({})

        const result = Object.assign(
            creator,
            {example: {} as any as FactoryAction<P>},
            {reduce, handler}
        )

        return result as any as ActionCreator<P>
    }

    function asyncActionCreators<P, S, E>(
        type: string, commonMeta?: {} | null
    ): AsyncActionCreators<P, S, E> {
        return {
            type: base + type,
            started: actionCreator<P>(`${type}_STARTED`, commonMeta, false),
            done: actionCreator<Success<P, S>>(`${type}_DONE`, commonMeta, false),
            failed: actionCreator<Failure<P, E>>(`${type}_FAILED`, commonMeta, true),
        }
    }

    return Object.assign(actionCreator, {async: asyncActionCreators, base}) as any as ActionCreatorFactory
}


export interface ReducerBuilder<InS extends OutS, OutS> {
    case<P>(
        actionCreator: ActionCreator<P> | EmptyActionCreator,
        handler: Handler<InS, OutS, P>
    ): ReducerBuilder<InS, OutS>

    (state: InS, action: FactoryAnyAction): OutS
}

export type Handler<InS extends OutS, OutS, P> = (state: InS, payload: P) => OutS

export function reducerWithInitialState<S>(initialValue: S): ReducerBuilder<S, S> {
    return makeReducer<S, S>([], initialValue)
}

export function reducerWithoutInitialState<S>(): ReducerBuilder<S, S> {
    return makeReducer<S, S>([])
}

export function upcastingReducer<InS extends OutS, OutS>(): ReducerBuilder<InS, OutS> {
    return makeReducer<InS, OutS>([])
}

interface Case<InS extends OutS, OutS, P extends {}> {
    actionCreator: ActionCreator<P>
    handler: Handler<InS, OutS, P>
}

function makeReducer<InS extends OutS, OutS>(
    cases: Array<Case<InS, OutS, any>>,
    initialValue?: InS
): ReducerBuilder<InS, OutS> {
    const reducer = ((state: InS = initialValue as InS, action: FactoryAnyAction): OutS => {
        for (let i = 0, length = cases.length; i < length; i++) {
            const { actionCreator, handler } = cases[i]
            if (isType(actionCreator)(action))
                return Object.assign({}, {state}, {...handler(state, action.payload) as any})

        }
        return state
    }) as ReducerBuilder<InS, OutS>

    reducer.case = <P>(
        actionCreator: ActionCreator<P>,
        handler: Handler<InS, OutS, P>
    ): ReducerBuilder<InS, OutS> => {
        return makeReducer([...cases, { actionCreator, handler }], initialValue)
    }

    return reducer
}


// Get the type in the array object
export type ArrayItem<T> = T extends Array<infer K> ? K : never

// Combine two types
export type Merage<P, T = {}> = P & T

// Declare optional and non-optional parameters
export type RequiredPartial<P, T> = Merage<Required<P>, Partial<T>>

export type IParameters<T> = T extends (...args: infer P) => any ? P : never
export type IReturenTypes<T> = T extends (...args: any[]) => infer P ? P : never
export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
export type IActionsReturn<T, A> = T extends keyof A
  ? A[T] extends Function
    ? IReturenTypes<A[T]>
    : never
  : any
export type PayloadType<T, A> = T extends keyof A
  ? A[T] extends Function
    ? IParameters<A[T]>[1]
    : never
  : any
export type FormatEnum<T, A> = T extends keyof A
  ? A[T] extends Function
    ? T
    : A
  : never

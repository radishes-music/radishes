// Get the type in the array object
export type ArrayItem<T> = T extends Array<infer K> ? K : never

// Combine two types
export type Merage<P, T = {}> = P & T

// Declare optional and non-optional parameters
export type RequiredPartial<P, T> = Merage<Required<P>, Partial<T>>

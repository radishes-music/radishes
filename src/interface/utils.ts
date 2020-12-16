// Get the type in the array object
export type ArrayItem<T> = T extends Array<infer K> ? K : never

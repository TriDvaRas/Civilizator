export function toKeyValue(object: any) {
    const arr: { key: string, value: any }[] = []
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            const value = object[key];
            arr.push({ key, value })
        }
    }
    return arr
}
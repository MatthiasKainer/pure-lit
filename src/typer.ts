import { PurePropertyDeclaration } from "./types";
import { PropertyDeclaration } from "lit-element";

export function toTypedPropertyDeclaration(value: unknown) : PropertyDeclaration {
    if (typeof value === "boolean") return {type: Boolean}
    if (Array.isArray(value)) return {type: Array}
    if (typeof value === "object") return {type: Object}
    return {}
}

export const objectToPurePropertyDeclaration = (object: {[key: string]: unknown}) =>
    Object.entries(object).reduce((result, [key, value]) => {
        result[key] = toTypedPropertyDeclaration(value)
        return result;
    }, {} as PurePropertyDeclaration) as PurePropertyDeclaration
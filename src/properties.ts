import {
  PurePropertyDeclaration,
  DefaultObjectDefinition,
  PureArguments,
  DefaultDefinedPureArguments,
  PropDefinedPureArguments,
} from "./types";
import { PropertyDeclaration, PropertyDeclarations } from "lit";

function toSafeDeclaration(declaration: PurePropertyDeclaration, [key, value]: [string, any]) {
  if (key.toLowerCase() !== key) {
    declaration[key] = {...value, attribute: key.replace(/[A-Z]/g, '-$&').toLowerCase()};
  } else {
    declaration[key] = value;
  }

  return declaration;
}

export function getType(value: unknown) : PropertyDeclaration {
  if (typeof value === "boolean") return {type: Boolean}
  if (Array.isArray(value)) return {type: Array}
  if (typeof value === "object") return {type: Object}
  return {}
}

export const toTypeDeclaration = (object: {[key: string]: unknown}) =>
  Object.entries(object).reduce((result, [key, value]) => {
      return toSafeDeclaration(result, [key, getType(value)])
  }, {} as PurePropertyDeclaration) as PurePropertyDeclaration

export const toPropertyDeclaration = (defaults?: DefaultObjectDefinition) =>
  toTypeDeclaration(defaults || {});

export const toPropertyDeclarationMap = (props?: (PurePropertyDeclaration | string)[]) =>
  (props || []).reduce((declaration: PurePropertyDeclaration, prop) => {
    Object.entries(prop).forEach((entry) => declaration = toSafeDeclaration(declaration, entry));
    return declaration;
  }, {} as PropertyDeclarations);

export const isDefault = <T>(args?: PureArguments<T>): args is DefaultDefinedPureArguments<T> =>
  args !== undefined && <T>(args as DefaultDefinedPureArguments<T>).defaults !== undefined;
export const hasProps = <T>(args?: PureArguments<T>): args is PropDefinedPureArguments<T> =>
  args !== undefined && (args as PropDefinedPureArguments<T>).props !== undefined;

export const toProperties = <T>(args?: PureArguments<T>) =>
  hasProps(args) ? toPropertyDeclarationMap(args.props) : toPropertyDeclaration(args?.defaults);

import { PurePropertyDeclaration, DefaultObjectDefinition, PureArguments, DefaultDefinedPureArguments, PropDefinedPureArguments } from "./types";
import { PropertyDeclarations } from "lit-element";

const isString = (v: string | PurePropertyDeclaration): v is string => {
    return typeof v === "string";
  };
  
  export const toPropertyDeclaration = (defaults?: DefaultObjectDefinition) =>
    toPropertyDeclarationMap(Object.keys(defaults || {}));
  
  export const toPropertyDeclarationMap = (props?: (PurePropertyDeclaration | string)[]) =>
    (props || []).reduce((declaration: PurePropertyDeclaration, prop) => {
      if (isString(prop)) {
        declaration[prop] = {};
      } else {
        Object.entries(prop).forEach(([key, value]) => (declaration[key] = value));
      }
      return declaration;
    }, {} as PropertyDeclarations);
  
  export const isDefault = (args?: PureArguments): args is DefaultDefinedPureArguments =>
    args !== undefined && (args as DefaultDefinedPureArguments).defaults !== undefined;
  export const hasProps = (args?: PureArguments): args is PropDefinedPureArguments =>
    args !== undefined && (args as PropDefinedPureArguments).props !== undefined;
  
  export const toProperties = (args?: PureArguments) =>
    hasProps(args) ? toPropertyDeclarationMap(args.props) : toPropertyDeclaration(args?.defaults);
  
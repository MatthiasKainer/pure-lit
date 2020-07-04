import { LitElement, TemplateResult, PropertyDeclarations } from "lit-element";
import {
  RegisteredElements,
  RenderFunction,
  PurePropertyDeclaration,
  LitElementWithProps,
  DefaultObjectDefinition,
  PureArguments,
  DefaultDefinedPureArguments,
} from "./types";

export const registered: RegisteredElements = {};

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

const isDefault = (args?: PureArguments): args is DefaultDefinedPureArguments =>
  args !== undefined && (args as DefaultDefinedPureArguments).defaults !== undefined;

export const toProperties = (args?: PureArguments) =>
  isDefault(args) ? toPropertyDeclaration(args.defaults) : toPropertyDeclarationMap(args?.props);

export const pureLit = <TProps>(
  name: string,
  render: RenderFunction<TProps>,
  args?: PureArguments
): HTMLElement => {
  if (registered[name]) return registered[name];

  /* istanbul ignore next */
  class RuntimeRepresentation extends LitElement {
    static get properties() {
      return toProperties(args);
    }
    static get styles() {
      return args?.styles;
    }
    connectedCallback() {
      super.connectedCallback();
      if (isDefault(args)) {
        Object.entries(args).forEach(([key, value]) => {
          (this as any)[key] = value
        })
      }
    }
    render(): TemplateResult {
      return render((this as any) as LitElementWithProps<TProps>);
    }
  }

  customElements.define(name, RuntimeRepresentation);

  const element = document.createElement(name);
  registered[name] = element;
  return element;
};

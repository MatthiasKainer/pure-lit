import { LitElement, TemplateResult, PropertyDeclarations } from "lit-element";
import {
  PureArguments,
  RegisteredElements,
  RenderFunction,
  PurePropertyDeclaration,
  LitElementWithProps,
} from "./types";

export const registered: RegisteredElements = {};

const isString = (v: string | PurePropertyDeclaration): v is string => {
  return typeof v === "string";
};

export const toPropertyDeclarationMap = (
  props?: (PurePropertyDeclaration | string)[]
) =>
  (props || []).reduce((declaration: PurePropertyDeclaration, prop) => {
    if (isString(prop)) {
      declaration[prop] = {};
    } else {
      Object.entries(prop).forEach(
        ([key, value]) => (declaration[key] = value)
      );
    }
    return declaration;
  }, {} as PropertyDeclarations);


export const pureLit = <TProps>(
  name: string,
  render: RenderFunction<TProps>,
  args?: PureArguments
): HTMLElement => {
  if (registered[name]) return registered[name];

  /* istanbul ignore next */
  class RuntimeRepresentation extends LitElement {
    static get properties() {
      return toPropertyDeclarationMap(args?.props)
    }
    static get styles() {
      return args?.styles;
    }
    render(): TemplateResult {
      return render(this as any as LitElementWithProps<TProps>);
    }
  }

  customElements.define(name, RuntimeRepresentation);

  const element = document.createElement(name);
  registered[name] = element;
  return element;
};

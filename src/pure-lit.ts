import { LitElement, TemplateResult } from "lit-element";
import {
  RegisteredElements,
  RenderFunction,
  LitElementWithProps,
  PureArguments,
} from "./types";
import { toProperties, isDefault } from "./properties";

export const registered: RegisteredElements = {};

export const pureLit = <TProps>(
  name: string,
  render: RenderFunction<TProps>,
  args?: PureArguments
): LitElementWithProps<TProps> => {
  if (registered[name]) return registered[name];

  class RuntimeRepresentation extends LitElement {
    static get properties() {
      return toProperties(args);
    }
    static get styles() {
      /* istanbul ignore next */
      return args?.styles;
    }
    connectedCallback() {
      super.connectedCallback();
      if (isDefault(args)) {
        Object.entries(args.defaults!).forEach(([key, value]) => {
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
  return element as LitElementWithProps<TProps>;
};

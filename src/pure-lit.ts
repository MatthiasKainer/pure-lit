import { html, LitElement, TemplateResult } from "lit";
import {
  RegisteredElements,
  RenderFunction,
  LitElementWithProps,
  PureArguments,
  AsyncRenderFunction,
} from "./types";
import { toProperties, isDefault } from "./properties";

export const registered: RegisteredElements = {};

export const pureLit = <TProps>(
  name: string,
  render: AsyncRenderFunction<TProps> | RenderFunction<TProps>,
  args?: PureArguments<TProps>
): LitElementWithProps<TProps> => {
  if (registered[name]) return registered[name];

  class RuntimeRepresentation extends LitElement {
    content: TemplateResult = html``;
    static get properties() {
      return toProperties(args);
    }
    static get styles() {
      /* istanbul ignore next */
      return args?.styles;
    }
    constructor() {
      super();
      if (isDefault(args)) {
        Object.entries(args!.defaults!).forEach(([key, value]) => {
          (this as any)[key] = value
        })
      }
    }
    protected async performUpdate(): Promise<unknown> {
      this.content = await Promise.resolve(render((this as any) as LitElementWithProps<TProps>))
        .catch(e => html`<slot name="error">${e}</slot>`);
      return super.performUpdate();
    }
    render(): TemplateResult {
      return this.content;
    }
  }

  customElements.define(name, RuntimeRepresentation);

  const element = document.createElement(name);
  registered[name] = element;
  return element as LitElementWithProps<TProps>;
};

import { html, LitElement } from "lit-element";
import { useState, useReducer } from "lit-element-state-decoupler";
import { pureLit } from "pure-lit";
import { LitElementWithProps } from "pure-lit/types";

type ListProps = { items: string[] };

const add = (state: string) => ({
  update: (payload: string) => payload,
  add: () => state,
});

pureLit(
  "todo-list",
  ({items, dispatchEvent}: LitElementWithProps<ListProps>) => html`<ul>
    ${items.map(
      (el) => html`<li @click=${() => dispatchEvent(new CustomEvent("remove", { detail: el }))}>${el}</li>`
    )}
  </ul>`,
  { defaults: { items: [] } }
);

pureLit("todo-add", (element) => {
  const { publish, getState } = useReducer(element, add, "", {
    dispatchEvent: true,
  });
  const onComplete = () => getState().length > 0 && (publish("add"), publish("update", ""));
  const onUpdate = ({ value }: { value: string }) => publish("update", value);

  return html`
    <input
      type="text"
      name="item"
      .value="${getState()}"
      @input="${(e: InputEvent) => onUpdate(e.target as HTMLInputElement)}"
      @keypress="${(e: KeyboardEvent) => e.key === "Enter" && onComplete()}"
      placeholder="insert new item"
    />
    <button @click=${() => onComplete()}>
      Add Item
    </button>
  `;
});

pureLit(
  "todo-app",
  (element: LitElement) => {
    const { getState, publish } = useState<string[]>(element, []);
    return html`
      <div>
        <todo-add @add=${(e: CustomEvent<string>) => publish([...getState(), e.detail])}></todo-add>
      </div>
      <div>
        <todo-list
          .items=${getState()}
          @remove=${(e: CustomEvent<string>) => publish([...getState().filter((el) => el !== e.detail)])}
        ></todo-list>
      </div>
    `;
  }
);

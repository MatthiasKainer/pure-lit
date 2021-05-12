import { pureLit, LitElementWithProps } from ".";
import { html, css } from "lit";
import {screen} from 'testing-library__dom';

type Props = { val: boolean, string: string };

const testComponent = pureLit(
  "my-component",
  (el: LitElementWithProps<Props>) => html`<p>Val is ${el.val} ${el.string}!</p>`,
  {
    styles: [
      css`
        :host {
        }
      `,
    ],
    defaults: { val: false, string: "bla" }
  }
);

describe("pure-lit boolean attributes default", () => {
  beforeEach(async () => {
    document.body.appendChild(testComponent);
  });

  afterEach(() => {
    document.body.removeChild(testComponent);
  });

  it("should have the correct default value", () => {
      expect(screen.getByText(/Val is false/gi)).toBeDefined()
  })

  it("should update the attribute if it changes", async () => {
      testComponent.val = true
      await testComponent.updateComplete
      expect(screen.getByText(/Val is true/gi)).toBeDefined()
  })
});

describe("pure-lit boolean attributes set explicitly", () => {
  beforeEach(async () => {
    document.body.insertAdjacentHTML( 'beforeend', "<my-component val string=\"whatever\"></my-component>" )
  });

  afterEach(() => {
    document.body.removeChild(document.body.querySelector("my-component")!);
  });

  it("should have the correct default value", () => {
      expect(screen.getByText(/Val is true/gi)).toBeDefined()
  })
  it("should have the string in there", () => {
      expect(screen.getByText(/whatever/gi)).toBeDefined()
  })
});

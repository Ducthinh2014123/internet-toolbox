// Minimal ambient type declaration for the "jsbarcode" package. The published
// package does not ship its own types and there is no guarantee a matching
// @types/jsbarcode version is resolvable in every environment, so we declare
// just the shape this project actually uses.
declare module "jsbarcode" {
  interface JsBarcodeOptions {
    format?: string;
    width?: number;
    height?: number;
    displayValue?: boolean;
    text?: string;
    fontOptions?: string;
    font?: string;
    textAlign?: string;
    textPosition?: string;
    textMargin?: number;
    fontSize?: number;
    background?: string;
    lineColor?: string;
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    flat?: boolean;
    valid?: (valid: boolean) => void;
  }

  function JsBarcode(
    element: HTMLCanvasElement | SVGElement | string,
    text: string,
    options?: JsBarcodeOptions,
  ): void;

  export = JsBarcode;
}

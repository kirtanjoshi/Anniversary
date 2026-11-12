// Minimal typings for the parts of page-flip (StPageFlip) we use; the package ships none.
declare module "page-flip" {
  export class PageFlip {
    constructor(root: HTMLElement, settings: Record<string, unknown>);
    loadFromHTML(items: HTMLElement[]): void;
    on(event: string, cb: (e: { data: unknown }) => void): this;
    flipNext(): void;
    flipPrev(): void;
    flip(page: number): void;
    getPageCount(): number;
    getUI(): { destroy(): void };
  }
}

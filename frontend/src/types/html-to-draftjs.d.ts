declare module 'html-to-draftjs' {
  interface ContentBlock {
    key: string;
    type: string;
    text: string;
    characterList: any[];
    depth: number;
    data: any;
  }

  interface EntityMap {
    [key: string]: any;
  }

  interface HtmlToDraftResult {
    contentBlocks: ContentBlock[];
    entityMap: EntityMap;
  }

  function htmlToDraft(html: string): HtmlToDraftResult;

  export default htmlToDraft;
}
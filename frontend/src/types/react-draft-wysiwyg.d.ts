declare module 'react-draft-wysiwyg' {
  export const Editor: any;
}

declare module 'draft-js' {
  export const EditorState: any;
  export const convertToRaw: any;
  export const ContentState: any;
  export const convertFromHTML: any;
}

declare module 'draftjs-to-html' {
  const draftToHtml: any;
  export default draftToHtml;
}
export default interface UploadedFile {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
    raw: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    raw: string;
    rendered: string;
  };
  author: 285;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: {
    spay_email: string;
  };
  permalink_template: string;
  generated_slug: string;
  acf: [];
  description: {
    raw: string;
    rendered: string;
  };
  caption: {
    raw: string;
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    sizes: {
      full: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
      medium: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
      large: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
      thumbnail: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  post: null;
  source_url: string;
  missing_image_sizes: any[];
  _links: {
    self: [
      {
        href: string;
      }
    ];
    collection: [
      {
        href: string;
      }
    ];
    about: [
      {
        href: string;
      }
    ];
    author: [
      {
        embeddable: true;
        href: string;
      }
    ];
    replies: [
      {
        embeddable: true;
        href: string;
      }
    ];
    'wp:action-unfiltered-html': [
      {
        href: string;
      }
    ];
    'wp:action-assign-author': [
      {
        href: string;
      }
    ];
    curies: [
      {
        name: string;
        href: string;
        templated: true;
      }
    ];
  };
}

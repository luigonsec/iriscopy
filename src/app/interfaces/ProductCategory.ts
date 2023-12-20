interface YoastHeadJson {
  title: string;
  robots: {
    index: string;
    follow: string;
  };
  og_locale: string;
  og_type: string;
  og_title: string;
  og_url: string;
  og_site_name: string;
  twitter_card: string;
  schema: {
    '@context': string;
    '@graph': Array<{
      '@type': string;
      '@id': string;
      url?: string;
      name?: string;
      isPartOf?: {
        '@id': string;
      };
      breadcrumb?: {
        '@id': string;
      };
      inLanguage?: string;
      itemListElement?: Array<{
        '@type': string;
        position: number;
        name: string;
        item?: string;
      }>;
      description?: string;
      publisher?: {
        '@id': string;
      };
      potentialAction?: Array<{
        '@type': string;
        target: {
          '@type': string;
          urlTemplate: string;
        };
        'query-input': string;
      }>;
      logo?: {
        '@type': string;
        inLanguage: string;
        '@id': string;
        url: string;
        contentUrl: string;
        width: number;
        height: number;
        caption: string;
      };
      image?: {
        '@id': string;
      };
      sameAs?: string[];
    }>;
  };
}

export default interface ProductCategory {
  id: number;
  active: boolean;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: null; // Si se espera otro tipo de dato, ajustar según sea necesario
  menu_order: number;
  count: number;
  yoast_head: string;
  yoast_head_json: YoastHeadJson;
  _links: {
    self: Array<{
      href: string;
    }>;
    collection: Array<{
      href: string;
    }>;
    up: Array<{
      href: string;
    }>;
  };
}

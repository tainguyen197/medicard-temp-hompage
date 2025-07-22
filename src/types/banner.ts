export interface Banner {
    id: string;
    type: string;
    link?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    image?: {
      id: string;
      url: string;
      filename: string;
    };
    imageEn?: {
      id: string;
      url: string;
      filename: string;
    };
  }
export interface Equipment {
    id: string;
    name: string;
    nameEn?: string;
    description: string;
    descriptionEn?: string;
    status: string;
    showOnHomepage: boolean;
    order: number;
    image?: {
      url: string;
    };
    imageEn?: {
      url: string;
    };
    createdAt: string;
    updatedAt: string;
  }
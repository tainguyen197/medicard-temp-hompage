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
      fileName: string;
      fileSize: number;
      fileType: string;
      originalName: string;
      uploadedById?: string;
      createdAt: string;
    };
    imageEn?: {
      id: string;
      url: string;
      fileName: string;
      fileSize: number;
      fileType: string;
      originalName: string;
      uploadedById?: string;
      createdAt: string;
    };
  }
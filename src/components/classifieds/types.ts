export interface Classified {
  contactInfo: any;
  phoneNumber: any;
  imageUrl: any;
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  email: string | null;
  phone_number: string | null;
  image_url: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string | null;
  postedBy?: string; // Added field to store the username or email of who posted
}

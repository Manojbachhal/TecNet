
export interface Classified {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  contactInfo: string | null;
  imageUrl: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string | null;
  postedBy?: string; // Added field to store the username or email of who posted
}

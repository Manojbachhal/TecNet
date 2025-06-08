
import { ReportData } from '../ReportListingDialog';

export interface ListingItem {
  id: string;
  title: string;
  price: number;
  location: string;
  condition: string;
  sellerName: string;
  sellerRating: number;
  images: string[];
  description: string;
  postedDate: string;
  favorite?: boolean;
  firearmId?: string;
  // Ballistic properties
  bulletWeight?: number;
  muzzleVelocity?: number;
  ballisticCoefficient?: number;
  reported?: boolean;
}

export interface TradingItemProps {
  item: ListingItem;
  onContact: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => Promise<boolean>;
  onReport?: (reportData: ReportData) => void;
  isOwner?: boolean;
}

export interface TradingListingRow {
  id: string;
  title: string;
  price: number;
  location: string | null;
  condition: string | null;
  seller_name: string | null;
  seller_rating: number | null;
  created_at: string;
  image_url: string | null;
  description: string | null;
  firearm_id: string | null;
  status: string;
  owner_id: string;
  listing_type?: string;
  reported?: boolean;
}

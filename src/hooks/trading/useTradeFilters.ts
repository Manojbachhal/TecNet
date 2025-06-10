import { useState } from "react";
import { ListingItem } from "@/components/trading/types/tradingTypes";

export const useTradeFilters = (listings: ListingItem[], activeTab: string, session: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");

  // Filter and sort listings
  const getFilteredListings = () => {
    return listings
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesTab =
          activeTab === "all" ||
          (activeTab === "sold" && item.status == "sold") ||
          (activeTab === "favorites" && item.favorite) ||
          (activeTab === "my-listings" &&
            session &&
            item.sellerName === session.user.email?.split("@")[0]);

        const matchesPriceRange =
          priceRange === "all" ||
          (priceRange === "under500" && item.price < 500) ||
          (priceRange === "500to1000" && item.price >= 500 && item.price <= 1000) ||
          (priceRange === "over1000" && item.price > 1000);

        return matchesSearch && matchesTab && matchesPriceRange;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            // Convert relative time strings to comparable values
            const getTimeValue = (date: string) => {
              if (date === "Just now") return Number.MAX_SAFE_INTEGER;
              if (date.includes("minute")) return parseInt(date) * 60;
              if (date.includes("hour")) return parseInt(date) * 3600;
              if (date.includes("day")) return parseInt(date) * 86400;
              if (date.includes("week")) return parseInt(date) * 604800;
              if (date.includes("month")) return parseInt(date) * 2592000;
              return 0;
            };
            return getTimeValue(b.postedDate) - getTimeValue(a.postedDate);
          case "price-high":
            return b.price - a.price;
          case "price-low":
            return a.price - b.price;
          default:
            return 0;
        }
      });
  };

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    getFilteredListings,
  };
};

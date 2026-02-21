"use client";

import { useStackBuilder } from "@/store/stackBuilder";
import { Plus, Check } from "lucide-react";

export function AddToStackButton({ item }: { item: any }) {
  const { items, addItem, removeItem, hasItem } = useStackBuilder();
  const isAdded = hasItem(item.id);

  const toggleStack = () => {
    if (isAdded) {
      removeItem(item.id);
    } else {
      addItem({
        id: item.id,
        name: item.title,
        slug: item.slug,
        installCommand: item.install_hint,
        category: item.type,
      });
    }
  };

  return (
    <button
      onClick={toggleStack}
      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded font-bold text-sm transition-colors ${
        isAdded
          ? "bg-dark-card border border-dark-border text-white hover:border-red-500 hover:text-red-500"
          : "bg-accent-green hover:bg-accent-green-hover text-black"
      }`}
    >
      {isAdded ? (
        <>
          <Check size={16} /> Added to Stack (Click to Remove)
        </>
      ) : (
        <>
          <Plus size={16} /> Add to Stack
        </>
      )}
    </button>
  );
}

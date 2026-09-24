import React from 'react';
import { CATEGORIES } from '../data/dairyProducts';

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  productCount
}) {
  return (
    <div className="cat-bar">
      <div className="cat-bar-inner">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              className={`cat-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}

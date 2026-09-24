import React from 'react';
import { CATEGORIES_WITH_ICONS } from '../data/dairyProducts';

export default function CategoryStories({
  selectedCategory,
  onSelectCategory
}) {
  return (
    <div className="cred-stories-wrap">
      <div className="cred-stories-inner">
        {CATEGORIES_WITH_ICONS.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              className={`cred-story-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.name)}
            >
              <div className="cred-story-circle">
                <span>{cat.icon}</span>
              </div>
              <span className="cred-story-label">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

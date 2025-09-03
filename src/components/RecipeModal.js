import React from 'react';
import '../styles/RecipeModal.css';

const RecipeModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{recipe.title}</h2>
        <div className="modal-body">
          <div className="modal-image-container">
            <img 
              src={recipe.image || 'https://via.placeholder.com/500x300?text=No+Image'} 
              alt={recipe.title} 
              className="modal-image"
            />
          </div>
          <div className="recipe-details">
            <h3>Ingredients</h3>
            <ul className="ingredients-list">
              {recipe.extendedIngredients?.map((ingredient, index) => (
                <li key={index}>{ingredient.original}</li>
              )) || <li>No ingredients information available</li>}
            </ul>
            <h3>Instructions</h3>
            <div className="instructions">
              {recipe.instructions ? (
                <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
              ) : (
                <p>No instructions available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;

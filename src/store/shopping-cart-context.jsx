import { useState, createContext, useReducer } from 'react';

import { DUMMY_PRODUCTS } from '../dummy-products';

export const CartContext = createContext({
  items: [],
  addItem: id => {},
  updateItemQuantity: (id, amount) => {},
  clear: () => {},
});

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const updatedItems = [...state];

      const existingCartItemIndex = updatedItems.findIndex(
        cartItem => cartItem.id === action.id
      );

      if (existingCartItemIndex !== -1) {
        const existingCartItem = { ...updatedItems[existingCartItemIndex] };
        existingCartItem.quantity += 1;
        updatedItems[existingCartItemIndex] = existingCartItem;
      } else {
        const product = DUMMY_PRODUCTS.find(
          product => product.id === action.id
        );
        updatedItems.push({
          id: action.id,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return updatedItems;
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = [...state];
      const updatedItemIndex = updatedItems.findIndex(
        item => item.id === action.id
      );

      const updatedItem = { ...updatedItems[updatedItemIndex] };
      updatedItem.quantity += action.amount;
      updatedItems[updatedItemIndex] = updatedItem;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      }

      return updatedItems;
    }

    case 'CLEAR': {
      return [];
    }
  }

  return state;
}

const CartProvider = props => {
  const [cartState, dispatch] = useReducer(cartReducer, []);

  const addItemToCart = id => {
    dispatch({ type: 'ADD_ITEM', id });
  };

  const updateCartItemQuantity = (id, amount) => {
    dispatch({ type: 'UPDATE_QUANTITY', id, amount });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR' });
  };

  return (
    <CartContext.Provider
      value={{
        items: cartState,
        addItem: addItemToCart,
        updateItemQuantity: updateCartItemQuantity,
        clear: clearCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;

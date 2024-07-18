import { AnimatePresence, motion } from "framer-motion";
import { useEffect, createContext, useState, useCallback } from "react";
import PersonaComponent from "./components/Persona";
import WebsocketComponent from "./components/WebsocketComponent";
import ItemSection from "./components/ItemSection"
import friesImg from "./assets/fries.png";
import waterImg from "./assets/bottled_water.png";
import chocolateMilkshakeImg from "./assets/chocolate_shake.png";
import strawberryMilkshakeImg from "./assets/strawberry_shake.png";
import vanillaMilkshakeImg from "./assets/vanilla_shake.png";
import tatersImg from "./assets/taters.png";
import burgerImg from "./assets/hamburger.png";
import doubleBurgerImg from "./assets/double_cheeseburger.png";
import hotdogImg from "./assets/hot dog.png";
import drinkImg from "./assets/drink.png";
import spriteImg from "./assets/sprite.png";

const itemsMap = {
  mains: {
    classic: { name: 'Classic Burger', image: burgerImg, price: 5.99 },
    cheese: { name: 'Cheese Burger', image: burgerImg, price: 6.99 },
    veggie: { name: 'Veggie Burger', image: burgerImg, price: 6.99 },
    bacon: { name: 'Bacon Burger', image: burgerImg, price: 7.99 },
    double_classic: { name: 'Double Classic Burger', image: doubleBurgerImg, price: 8.99 },
    double_cheese: { name: 'Double Cheese Burger', image: doubleBurgerImg, price: 9.99 },
    double_veggie: { name: 'Double Veggie Burger', image: doubleBurgerImg, price: 9.99 },
    double_bacon: { name: 'Double Bacon Burger', image: doubleBurgerImg, price: 10.99 },
    hot_dog: { name: 'Hot Dog', image: hotdogImg, price: 4.99 },
  },
  sides: {
    fries: {
      small: { name: 'Small Fries', image: friesImg, price: 2.99 },
      medium: { name: 'Medium Fries', image: friesImg, price: 3.99 },
      large: { name: 'Large Fries', image: friesImg, price: 4.99 },
    },
    taters: { name: 'Taters', image: tatersImg, price: 3.99 },
  },
  drinks: {
    cola: { name: 'Cola', image: drinkImg, price: 1.99 },
    diet_cola: { name: 'Diet Cola', image: drinkImg, price: 1.99 },
    sprite: { name: 'Sprite', image: spriteImg, price: 1.99 },
    water: { name: 'Water', image: waterImg, price: 1.49 },
    chocolate_milkshake: { name: 'Chocolate Milkshake', image: chocolateMilkshakeImg, price: 3.99 },
    strawberry_milkshake: { name: 'Strawberry Milkshake', image: strawberryMilkshakeImg, price: 3.99 },
    vanilla_milkshake: { name: 'Vanilla Milkshake', image: vanillaMilkshakeImg, price: 3.99 },
  },
};

// Create context
export const OrderContext = createContext();

function App() {
  const usePopulatedInitialState = false; // Flag to enable/disable populated initial state
  // const usePopulatedInitialState = true; // Flag to enable/disable populated initial state

  const initialMains = usePopulatedInitialState
    ? [
        { ...itemsMap.mains.classic, id: 'classic', quantity: 1 },
        { ...itemsMap.mains.cheese, id: 'cheese', quantity: 2 },
        { ...itemsMap.mains.veggie, id: 'veggie', quantity: 0 },
        { ...itemsMap.mains.bacon, id: 'bacon', quantity: 1 },
        { ...itemsMap.mains.double_classic, id: 'double_classic', quantity: 0 },
        { ...itemsMap.mains.double_cheese, id: 'double_cheese', quantity: 0 },
        { ...itemsMap.mains.double_veggie, id: 'double_veggie', quantity: 0 },
        { ...itemsMap.mains.double_bacon, id: 'double_bacon', quantity: 0 },
        { ...itemsMap.mains.hot_dog, id: 'hot_dog', quantity: 1 }
      ]
    : [
        { ...itemsMap.mains.classic, id: 'classic', quantity: 0 },
        { ...itemsMap.mains.cheese, id: 'cheese', quantity: 0 },
        { ...itemsMap.mains.veggie, id: 'veggie', quantity: 0 },
        { ...itemsMap.mains.bacon, id: 'bacon', quantity: 0 },
        { ...itemsMap.mains.double_classic, id: 'double_classic', quantity: 0 },
        { ...itemsMap.mains.double_cheese, id: 'double_cheese', quantity: 0 },
        { ...itemsMap.mains.double_veggie, id: 'double_veggie', quantity: 0 },
        { ...itemsMap.mains.double_bacon, id: 'double_bacon', quantity: 0 },
        { ...itemsMap.mains.hot_dog, id: 'hot_dog', quantity: 0 }
      ];

  const initialSides = usePopulatedInitialState
    ? [
        { ...itemsMap.sides.fries.small, id: 'fries', size: 'small', quantity: 1 },
        { ...itemsMap.sides.fries.medium, id: 'fries', size: 'medium', quantity: 2 },
        { ...itemsMap.sides.fries.large, id: 'fries', size: 'large', quantity: 0 },
        { ...itemsMap.sides.taters, id: 'taters', size: 'medium', quantity: 0 }
      ]
    : [
        { ...itemsMap.sides.fries.small, id: 'fries', size: 'small', quantity: 0 },
        { ...itemsMap.sides.fries.medium, id: 'fries', size: 'medium', quantity: 0 },
        { ...itemsMap.sides.fries.large, id: 'fries', size: 'large', quantity: 0 },
        { ...itemsMap.sides.taters, id: 'taters', size: 'medium', quantity: 0 }
      ];

  const initialDrinks = usePopulatedInitialState
    ? [
        { ...itemsMap.drinks.cola, id: 'cola', size: 'medium', quantity: 2 },
        { ...itemsMap.drinks.diet_cola, id: 'diet_cola', size: 'medium', quantity: 1 },
        { ...itemsMap.drinks.sprite, id: 'sprite', size: 'medium', quantity: 0 },
        { ...itemsMap.drinks.water, id: 'water', size: 'medium', quantity: 1 },
        { ...itemsMap.drinks.chocolate_milkshake, id: 'chocolate_milkshake', size: 'medium', quantity: 0 },
        { ...itemsMap.drinks.strawberry_milkshake, id: 'strawberry_milkshake', size: 'medium', quantity: 0 },
        { ...itemsMap.drinks.vanilla_milkshake, id: 'vanilla_milkshake', size: 'medium', quantity: 0 }
      ]
    : [
        { ...itemsMap.drinks.cola, id: 'cola', size: 'medium', quantity: 0 },
        { ...itemsMap.drinks.diet_cola, id: 'diet_cola', size: 'medium', quantity: 0 },
        { ...itemsMap.drinks.sprite, id: 'sprite', size: 'medium', quantity: 0 },
        { ...itemsMap.drinks.water, id: 'water', size: 'medium', quantity: 0 },
        { ...itemsMap.drinks.chocolate_milkshake, id: 'chocolate_milkshake', size: 'medium', quantity: 0 },
        { ...itemsMap.drinks.strawberry_milkshake, id: 'strawberry_milkshake', size: 'medium', quantity: 0 },
        { ...itemsMap.drinks.vanilla_milkshake, id: 'vanilla_milkshake', size: 'medium', quantity: 0 }
      ];
  const [mains, setMains] = useState(initialMains);
  const [sides, setSides] = useState(initialSides);
  const [drinks, setDrinks] = useState(initialDrinks);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPersonaClientStarted, setIsPersonaClientStarted] = useState(false);

  const updateItemQuantity = (items, setItems, itemId, size, quantity) => {
    const newItems = [...items];
    const itemIndex = newItems.findIndex(item => item.id === itemId && (size ? item.size === size : true));
    if (itemIndex !== -1) {
      if (quantity === 0) {
        newItems[itemIndex].quantity = 0;
      } else {
        newItems[itemIndex].quantity = Math.max(0, newItems[itemIndex].quantity + quantity);
      }
      setItems(newItems);
    }
  };

  const handleAddMains = (main_type, quantity) => {
    updateItemQuantity(mains, setMains, main_type, null, quantity);
  };

  const handleSubtractMains = (main_type, quantity) => {
    updateItemQuantity(mains, setMains, main_type, null, -quantity);
  };

  const handleAddSides = (side_type, size, quantity) => {
    updateItemQuantity(sides, setSides, side_type, size, quantity);
  };

  const handleSubtractSides = (side_type, size, quantity) => {
    updateItemQuantity(sides, setSides, side_type, size, -quantity);
  };

  const handleAddDrinks = (drink_type, size, quantity) => {
    updateItemQuantity(drinks, setDrinks, drink_type, size, quantity);
  };

  const handleSubtractDrinks = (drink_type, size, quantity) => {
    updateItemQuantity(drinks, setDrinks, drink_type, size, -quantity);
  };
  const calculateTotalPrice = useCallback(() => {
    const mainTotal = mains.reduce((total, item) => total + item.quantity * item.price, 0);
    const sidesTotal = sides.reduce((total, item) => total + item.quantity * item.price, 0);
    const drinksTotal = drinks.reduce((total, item) => total + item.quantity * item.price, 0);
    return mainTotal + sidesTotal + drinksTotal;
  }, [mains, sides, drinks]);

  useEffect(() => {
    const newTotalPrice = calculateTotalPrice();
    setTotalPrice(newTotalPrice);
  }, [mains, sides, drinks, calculateTotalPrice]);

  const initializePersonaClient = useCallback(() => {
    console.log('Persona Client initialized');
    setIsPersonaClientStarted(true);
  }, []);

  const handleStartPersonaClient = useCallback(() => {
    if (!isPersonaClientStarted) {
      initializePersonaClient();
    }
  }, [isPersonaClientStarted, initializePersonaClient]);

  const value = {
    mains,
    setMains,
    sides,
    setSides,
    drinks,
    setDrinks,
    totalPrice,
    handleAddMains,
    handleSubtractMains,
    handleAddSides,
    handleSubtractSides,
    handleAddDrinks,
    handleSubtractDrinks,
    totalPrice,
    isPersonaClientStarted
  }
  console.log('starting up...')
  return (
    <OrderContext.Provider value={value}>
      <div className="app">
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            fontFamily: 'Roobert, sans-serif',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            Sindarin.
          </span>
          <span style={{
            fontFamily: 'cursive',
            fontSize: '28px',
            fontStyle: 'italic',
            color: '#555',
            transform: 'rotate(-5deg) translateY(-2px)',
            display: 'inline-block'
          }}>
            Burgers!
          </span>
        </div>
        <motion.button
          onClick={handleStartPersonaClient}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
            padding: "12px 24px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            color: "#333"
          }}
        >
          {isPersonaClientStarted ? "Persona Client Started" : "Start Persona Client"}
        </motion.button>
        <PersonaComponent init={isPersonaClientStarted}/>
        <WebsocketComponent />
        <div style={{ marginTop: '80px' }}>
          { mains.some(item => item.quantity > 0) ? (
            <div className="image-container">
              <AnimatePresence>
                <ItemSection type={'mains'} />
              </AnimatePresence>
            </div>
          ) : null}
          { sides.some(item => item.quantity > 0) ? (
            <div className="image-container">
              <AnimatePresence>
                <ItemSection type={'sides'} />
              </AnimatePresence>
            </div>
          ) : null}
          { drinks.some(item => item.quantity > 0) ? (
            <div className="image-container">
              <AnimatePresence>
                <ItemSection type={'drinks'} />
              </AnimatePresence>
            </div>
          ) : null}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2 style={{ 
            margin: 0,
            fontSize: "18px", 
            fontWeight: "600",
            color: "#333"
          }}>
            Total Price: $
            <motion.span
              key={totalPrice}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {totalPrice.toFixed(2)}
            </motion.span>
          </h2>
        </motion.div>
      </div>
    </OrderContext.Provider>
  )
}
export default App

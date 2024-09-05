# Sindarin Burgers: HackAI Project Guide

Welcome to the Sindarin Burgers project for HackAI! In this workshop, you'll enhance a voice-controlled AI ordering system for a burger restaurant using React and the Sindarin AI platform.

## Project Goals

- Specify drink sizes
- Add and remove toppings from burgers (including Gluten-free options)

## Prerequisites

- Basic knowledge of React and JavaScript
- Node.js and npm installed on your computer
- A code editor (e.g., Visual Studio Code)
- A Sindarin account (you'll create this during setup)

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/19bmiles/sindarin-burgers-hackai.git
   cd sindarin-burgers-hackai
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a Sindarin account:

   - Go to [[Sindarin's website]](https://www.sindarin.tech/)
   - Sign up for an account
   - Create a new project and obtain your API key

4. Update the API key:

   - Open `src/components/Persona.jsx`
   - Create a .env file and create an ENV variable called "VITE_SINDARIN_API_KEY"
   - Set the env variables value to your Sindarin API key

5. Start the development server:
   ```
   npm run dev
   ```

## Understanding Sindarin's AI Persona

Sindarin's AI platform creates a conversational AI agent (or "persona") that can understand and respond to user input. This section will help you understand how the different components work together in your Sindarin Burgers project.

### Key Components

1. **`prompt.js`**: This file contains the initial instructions for the AI, setting its role and behavior. It defines the persona's personality, knowledge base, and general guidelines for interaction.

2. **`actions.js`**: This file defines the specific actions the AI can take, which correspond to functions in your React app. Actions are structured JSON objects that the Persona can emit during conversation, to be handled by your application.

3. **`Persona.jsx`**: This React component handles the communication between your app and the Sindarin AI service. It initializes the Sindarin client, manages the conversation state, and processes actions emitted by the AI.

4. **`App.jsx`**: The main component of your application, which uses the OrderContext to manage the overall state of the order and provides methods for updating it.

### How It Works

1. The AI uses the initial prompt from `prompt.js` and available actions from `actions.js` to generate appropriate responses and trigger actions based on user input.

2. When a user interacts with the app (e.g., by speaking or typing), the input is sent to the Sindarin AI service.

3. The AI processes the input, considering its prompt and available actions, and generates a response.

4. If the AI determines an action should be taken, it emits an action object along with its response.

5. The `handleAction` function in `Persona.jsx` receives this action and updates the app's state accordingly, using the methods provided by the OrderContext.

6. The updated state triggers a re-render of the relevant components, reflecting the changes in the UI.

### Action Structure

Actions in Sindarin are defined using a specific schema. Here's a basic example of an action object:

```javascript
"update_order": {
  "_description": "When items should be added to or removed from the order",
  "type": "object",
  "properties": {
    "mains": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "main_type": {
            "type": "string",
            "enum": ["classic", "cheese", "veggie", "bacon", "double_classic", "double_cheese", "double_veggie", "double_bacon", "hot_dog"]
          },
          "quantity": {
            "type": "integer"
          }
        },
        "required": ["main_type", "quantity"]
      }
    },
    // Similar structures for "sides" and "drinks"
  }
}
```

This structure tells the AI what information it needs to provide when updating an order, and allows your app to process these updates consistently.

### Customizing the AI Persona

You can customize how the AI interacts with users and what it's capable of doing within your app by modifying:

1. The prompt in `prompt.js` to change the AI's personality or knowledge base.
2. The actions in `actions.js` to add new capabilities or modify existing ones.
3. The `handleAction` function in `Persona.jsx` to change how actions are processed in your app.

### Advanced Features

Sindarin offers additional features that you can explore to enhance your AI persona:

1. **Scenarios**: These provide specific information in particular conversational contexts, allowing for more dynamic and context-aware responses.

2. **Webhooks**: You can configure actions to make API calls to external services, allowing your AI to fetch or send data to other systems.

3. **State Management**: Some actions can be configured to update the conversation state, allowing the AI to remember information across multiple turns of the conversation.

By understanding these components and how they interact, you'll be better equipped to modify and extend your Sindarin Burgers application.

## Implementation Guide

### 1. Adding More Drink Sizes

In this section, we'll enhance the drink ordering system by allowing customers to specify the size of their drinks. This feature improves the user experience by providing more options and customization for drink orders. There already is a reference to drinks sizes in `actions.js` and in the `handleAction` function in `Persona.jsx`. So our changes here should be fairly easy.

Update `src/App.jsx`:

1. Modify the `itemsMap` for drinks to include sizes:

```javascript
drinks: {
  cola: {
    small: { name: 'Small Cola', image: drinkImg, price: 1.99 },
    medium: { name: 'Medium Cola', image: drinkImg, price: 2.49 },
    large: { name: 'Large Cola', image: drinkImg, price: 2.99 }
  },
  diet_cola: {
    small: { name: 'Small Diet Cola', image: drinkImg, price: 1.99 },
    medium: { name: 'Medium Diet Cola', image: drinkImg, price: 2.49 },
    large: { name: 'Large Diet Cola', image: drinkImg, price: 2.99 }
  },
  sprite: {
    small: { name: 'Small Sprite', image: spriteImg, price: 1.99 },
    medium: { name: 'Medium Sprite', image: spriteImg, price: 2.49 },
    large: { name: 'Large Sprite', image: spriteImg, price: 2.99 }
  },
  water: {
    small: { name: 'Small Water', image: waterImg, price: 1.49 },
    medium: { name: 'Medium Water', image: waterImg, price: 1.99 },
    large: { name: 'Large Water', image: waterImg, price: 2.49 }
  },
  chocolate_milkshake: {
    small: { name: 'Small Chocolate Milkshake', image: chocolateMilkshakeImg, price: 3.99 },
    medium: { name: 'Medium Chocolate Milkshake', image: chocolateMilkshakeImg, price: 4.99 },
    large: { name: 'Large Chocolate Milkshake', image: chocolateMilkshakeImg, price: 5.99 }
  },
  strawberry_milkshake: {
    small: { name: 'Small Strawberry Milkshake', image: strawberryMilkshakeImg, price: 3.99 },
    medium: { name: 'Medium Strawberry Milkshake', image: strawberryMilkshakeImg, price: 4.99 },
    large: { name: 'Large Strawberry Milkshake', image: strawberryMilkshakeImg, price: 5.99 }
  },
  vanilla_milkshake: {
    small: { name: 'Small Vanilla Milkshake', image: vanillaMilkshakeImg, price: 3.99 },
    medium: { name: 'Medium Vanilla Milkshake', image: vanillaMilkshakeImg, price: 4.99 },
    large: { name: 'Large Vanilla Milkshake', image: vanillaMilkshakeImg, price: 5.99 }
  },
},
```

2. Update the `initialDrinks` state to match the new structure:

```javascript
const initialDrinks = Object.entries(itemsMap.drinks).flatMap(([drinkType, sizes]) =>
  Object.entries(sizes).map(([size, details]) => ({
    ...details,
    id: drinkType,
    size,
    quantity: 0
  }))
);
```

Update `src/components/ItemSection.jsx`:

3. Modify the key for the `motion.div` to include the size:

```jsx
<motion.div
  className="image-card"
  key={`${item.id}-${item.size || ''}`}
  // ... rest of the motion.div properties
>
  {/* ... rest of the component code */}
</motion.div>
```

#### Testing Your Changes
1. Start your development server (`npm run dev`).
2. Open the application in your browser.
3. Try ordering drinks with different sizes using voice commands or text input.
4. Verify that the order summary correctly displays the drink sizes and updates the total price accordingly.

#### Common Pitfalls
- Ensure that all drink types in the `itemsMap` have small, medium, and large sizes defined.
- Check that the `initialDrinks` state is correctly set using the new structure.
- Verify that the AI model is trained to recognize and process size-related commands for drinks.

### 2. Implementing Toppings and Gluten-Free Options

In this section, we'll add the ability to customize main items with toppings, including a gluten-free bun option. This feature allows customers to personalize their orders and cater to dietary restrictions.

Update `src/App.jsx`:

1. Add toppings to the `itemsMap`:

```javascript
mains: {
  // ... existing main items ...
  toppings: {
    lettuce: { name: 'Lettuce', price: 0.50 },
    tomato: { name: 'Tomato', price: 0.50 },
    cheese: { name: 'Cheese', price: 1.00 },
    bacon: { name: 'Bacon', price: 1.50 },
    gluten_free_bun: { name: 'Gluten-Free Bun', price: 2.00 },
  },
},
```

2. Modify the initial state for mains to include toppings:

```javascript
const [mains, setMains] = useState(initialMains.map(main => ({
  ...main,
  toppings: []
})));
```

3. Add new functions to handle toppings:

```javascript
const findMainByType = (main_type) => {
  return mains.find(main => main.id === main_type);
};

const getOrderState = () => {
  return {
    mains: mains.filter(item => item.quantity > 0),
    sides: sides.filter(item => item.quantity > 0),
    drinks: drinks.filter(item => item.quantity > 0)
  };
};

const updateMainsState = (updates) => {
  setMains(prevMains => {
    return prevMains.map(main => {
      const update = updates.find(u => u.id === main.id);
      if (update) {
        return {
          ...main,
          quantity: update.quantity !== undefined ? update.quantity : main.quantity,
          toppings: update.toppings !== undefined ? update.toppings : main.toppings
        };
      }
      return main;
    });
  });
};
```

4. Update `handleAddMains` and `handleSubtractMains`:

```javascript
const handleAddMains = (main_type, quantity) => {
  updateMainsState([{ id: main_type, quantity }]);
};

const handleSubtractMains = (main_type, quantity) => {
  const currentMain = findMainByType(main_type);
  if (currentMain) {
    updateMainsState([{ id: main_type, quantity: Math.max(0, currentMain.quantity - quantity) }]);
  }
};
```

5. Update `calculateTotalPrice` to include toppings:

```javascript
const calculateTotalPrice = useCallback(() => {
  const mainTotal = mains.reduce((total, item) => {
    let itemTotal = item.quantity * item.price;
    itemTotal += item.toppings.reduce((toppingTotal, topping) => 
      toppingTotal + itemsMap.mains.toppings[topping].price, 0);
    return total + itemTotal;
  }, 0);
  const sidesTotal = sides.reduce((total, item) => total + item.quantity * item.price, 0);
  const drinksTotal = drinks.reduce((total, item) => total + item.quantity * item.price, 0);
  return mainTotal + sidesTotal + drinksTotal;
}, [mains, sides, drinks]);
```

6. Add the new functions to the OrderContext:

```javascript
const value = {
  // ... existing values ...
  findMainByType,
  getOrderState,
  updateMainsState,
};
```

Update `src/components/ItemSection.jsx`:

Add a section to display toppings right after the "in cart" paragraph:

```jsx
<p style={{ 
  margin: 0, 
  fontSize: "14px", 
  color: "#666",
  display: "flex",
  alignItems: "center",
}}>
  <span style={{
    background: "#f0f0f0",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "8px",
    fontWeight: "bold",
    color: "#333"
  }}>
    {item.quantity}
  </span>
  in cart
</p>
{item.toppings && item.toppings.length > 0 && (
  <p style={{ 
    margin: "4px 0 0 0", 
    fontSize: "12px", 
    color: "#666",
  }}>
    Toppings: {item.toppings.join(', ')}
  </p>
)}
```

Update `src/components/Persona.jsx`:

1. Update the context import to include the new functions:

```javascript
const { 
  mains, 
  sides, 
  drinks,
  totalPrice,
  handleAddMains,
  handleSubtractMains,
  handleAddSides,
  handleSubtractSides,
  handleAddDrinks,
  handleSubtractDrinks,
  updateMainsState,
  findMainByType,
  getOrderState,
  isPersonaClientStarted,
} = useContext(OrderContext);
```

2. Modify the `handleAction` function to process toppings:

```javascript
const handleAction = useCallback((action) => {
  console.log('actions emitted', action);
  
  const update_order = action.update_order || action;

  if (update_order.mains) {
    update_order.mains.forEach(main => {
      if (main.quantity !== undefined) {
        if (main.quantity >= 0) {
          handleAddMains(main.main_type, main.quantity);
        } else {
          handleSubtractMains(main.main_type, Math.abs(main.quantity));
        }
      }
      
      if (main.toppings) {
        const currentMain = findMainByType(main.main_type);
        if (currentMain) {
          const newToppings = [...currentMain.toppings];
          main.toppings.forEach(topping => {
            if (topping.action === 'add' && !newToppings.includes(topping.topping)) {
              newToppings.push(topping.topping);
            } else if (topping.action === 'remove') {
              const index = newToppings.indexOf(topping.topping);
              if (index > -1) {
                newToppings.splice(index, 1);
              }
            }
          });
          updateMainsState([{ id: main.main_type, toppings: newToppings }]);
        }
      }
    });
  }

  // ... rest of the function ...
}, [handleAddMains, handleSubtractMains, updateMainsState, handleAddSides, handleSubtractSides, 
    handleAddDrinks, handleSubtractDrinks, findMainByType, getOrderState]);
```

Update `src/persona/actions.js`:

Add toppings to the mains schema:

```javascript
"mains": {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "main_type": {
        "type": "string",
        "enum": ["classic", "cheese", "veggie", "bacon", "double_classic", "double_cheese", "double_veggie", "double_bacon"]
      },
      "quantity": {
        "type": "integer"
      },
      "toppings": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "topping": {
              "type": "string",
              "enum": ["lettuce", "tomato", "cheese", "bacon", "gluten_free_bun"]
            },
            "action": {
              "type": "string",
              "enum": ["add", "remove"]
            }
          },
          "required": ["topping", "action"]
        }
      }
    },
    "required": ["main_type", "quantity"]
  }
}
```

#### Testing Your Changes
1. Start your development server (`npm run dev`).
2. Open the application in your browser.
3. Try ordering main items with different toppings, including the gluten-free bun option.
4. Verify that the order summary correctly displays the added toppings and updates the total price accordingly.
5. Test adding and removing toppings from existing items in the order.

#### Common Pitfalls
- Ensure that the `toppings` array is properly initialized for each main item.
- Verify that the price calculation for toppings is correct in the `calculateTotalPrice` function.
- Check for potential issues with duplicate toppings being added.
- Make sure the AI model is trained to recognize and process topping-related commands, including both additions and removals.
- Test edge cases, such as trying to add toppings to items that aren't in the order, or removing non-existent toppings.

## Testing and Debugging

1. Run the application:

   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

3. Test the new features:

   - Try adding and removing toppings
   - Order drinks with different sizes
   - Add gluten-free options to your order

4. Use the browser console to debug any issues (press F12 to open developer tools).

### Troubleshooting Tips:

- If the AI isn't responding to your commands, check the Sindarin API key in `Persona.jsx`.
- If state updates aren't reflecting in the UI, ensure you're using the correct update functions from the OrderContext.
- For any React-related errors, check the console for detailed error messages and component stack traces.

## Optional Extensions

If you finish early or want to challenge yourself further, try implementing these features:

1. Add a "Meal Deal" option that bundles a main, side, and drink at a discounted price.
2. Implement a loyalty points system where users earn points for their orders.
3. Create a voice-activated "Reorder Previous Meal" feature.

Happy coding!

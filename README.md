# Sindarin Burgers: HackAI Project Guide

Welcome to the Sindarin Burgers project for HackAI! In this workshop, you'll enhance a voice-controlled AI ordering system for a burger restaurant using React and the Sindarin AI platform.

## Project Goals

- Specify drink sizes
- Handle dietary restrictions (e.g., gluten-free options)
- Add and remove toppings from burgers

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

   - Go to [Sindarin's website]
   - Sign up for an account
   - Create a new project and obtain your API key

4. Update the API key:

   - Open `src/components/Persona.jsx`
   - Replace `"d4e5875d-0e08-4996-b04e-c40f7a661b17"` with your Sindarin API key

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

In this section, we'll enhance the drink ordering system by allowing customers to specify the size of their drinks. This feature improves the user experience by providing more options and customization for drink orders.

Update `src/persona/actions.js`:

```javascript
"drinks": {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "drink_type": {
        "type": "string",
        "enum": ["cola", "diet_cola", "sprite", "water", "chocolate_milkshake", "strawberry_milkshake", "vanilla_milkshake"]
      },
      "size": {
        "type": "string",
        "enum": ["small", "medium", "large"]
      },
      "quantity": {
        "type": "integer"
      }
    },
    "required": ["drink_type", "size", "quantity"]
  }
}
```

Update `src/App.jsx`:

```javascript
// Modify itemsMap to include different sizes for drinks
drinks: {
  cola: {
    small: { name: 'Small Cola', image: drinkImg, price: 1.99 },
    medium: { name: 'Medium Cola', image: drinkImg, price: 2.49 },
    large: { name: 'Large Cola', image: drinkImg, price: 2.99 }
  },
  // ... repeat for other drink types ...
},

// Update handleAddDrinks and handleSubtractDrinks functions to handle sizes
const handleAddDrinks = (drink_type, size, quantity) => {
  // This function now takes a 'size' parameter
  updateItemQuantity(drinks, setDrinks, drink_type, size, quantity);
};

const handleSubtractDrinks = (drink_type, size, quantity) => {
  // This function now takes a 'size' parameter
  updateItemQuantity(drinks, setDrinks, drink_type, size, -quantity);
};
```

#### Testing Your Changes

1. Start your development server (`npm run dev`).
2. Open the application in your browser.
3. Try ordering drinks with different sizes using voice commands or text input.
4. Verify that the order summary correctly displays the drink sizes and updates the total price accordingly.

#### Common Pitfalls

- Ensure that the `size` parameter is correctly passed through all relevant functions.
- Check that the pricing for different sizes is correctly defined in the `itemsMap`.
- Verify that the AI model is trained to recognize and process size-related commands for drinks.

### 2. Adding Gluten-Free Options

Next, we'll add gluten-free options for our main items. This feature caters to customers with gluten sensitivities or celiac disease, making our menu more inclusive.

Update `src/App.jsx`:

```javascript
// Add gluten-free option to itemsMap
mains: {
  // ... existing main items ...
  gluten_free_bun: { name: 'Gluten-Free Bun', price: 1.50 },
},

// Add new function to handle gluten-free options
const handleGlutenFreeOption = (mainId, isGlutenFree) => {
  const currentMain = findMainByType(mainId);
  if (currentMain && currentMain.quantity > 0) {
    // Update the state of the specific main item
    updateMainsState([{
      id: mainId,
      isGlutenFree: isGlutenFree
    }]);
  }
};

// Update calculateTotalPrice function to include gluten-free pricing
const calculateTotalPrice = useCallback(() => {
  const mainTotal = mains.reduce((total, item) => {
    let itemTotal = item.quantity * item.price;
    // Add the price of the gluten-free bun if the option is selected
    if (item.isGlutenFree) {
      itemTotal += itemsMap.mains.gluten_free_bun.price * item.quantity;
    }
    return total + itemTotal;
  }, 0);
  // ... rest of the function ...
}, [mains, sides, drinks]);
```

Update `src/persona/actions.js`:

```javascript
"mains": {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      // ... existing properties ...
      "isGlutenFree": {
        "type": "boolean"
      }
    },
    "required": ["main_type", "quantity"]
  }
}
```

Update `src/components/Persona.jsx`:

```javascript
// Modify handleAction function to process gluten-free options
if (main.isGlutenFree !== undefined) {
  updateMainsState([{ id: main.main_type, isGlutenFree: main.isGlutenFree }]);
}
```

Update `src/components/ItemSection.jsx`:

```jsx
{
  item.isGlutenFree && (
    <p
      style={{
        margin: "4px 0 0 0",
        fontSize: "12px",
        color: "#666",
        fontWeight: "bold",
      }}
    >
      Gluten-Free
    </p>
  );
}
```

#### Testing Your Changes

1. Run the application and open it in your browser.
2. Try ordering a main item with a gluten-free bun using voice commands or text input.
3. Check that the order summary correctly displays the gluten-free option and updates the total price.
4. Verify that you can add and remove the gluten-free option for different main items.

#### Common Pitfalls

- Ensure that the `isGlutenFree` property is correctly initialized for all main items.
- Verify that the price calculation for gluten-free options is correct in the `calculateTotalPrice` function.
- Check that the AI model is trained to recognize and process gluten-free related commands.

### 3. Adding and Removing Toppings

Lastly, we'll implement the ability to add and remove toppings from main items. This feature allows for greater customization of orders, enhancing the overall user experience.

Update `src/App.jsx`:

```javascript
// Add toppings to itemsMap
mains: {
  // ... existing main items ...
  toppings: {
    lettuce: { name: 'Lettuce', price: 0.50 },
    tomato: { name: 'Tomato', price: 0.50 },
    cheese: { name: 'Cheese', price: 1.00 },
    bacon: { name: 'Bacon', price: 1.50 },
  },
},

// Add new functions to handle toppings
const handleAddTopping = (mainId, topping) => {
  const currentMain = findMainByType(mainId);
  if (currentMain && currentMain.quantity > 0) {
    // Add the topping if it's not already present
    updateMainsState([{
      id: mainId,
      toppings: [...new Set([...currentMain.toppings, topping])]
    }]);
  }
};

const handleRemoveTopping = (mainId, topping) => {
  const currentMain = findMainByType(mainId);
  if (currentMain && currentMain.quantity > 0) {
    // Remove the specified topping
    updateMainsState([{
      id: mainId,
      toppings: currentMain.toppings.filter(t => t !== topping)
    }]);
  }
};

// Update calculateTotalPrice function to include topping prices
const calculateTotalPrice = useCallback(() => {
  const mainTotal = mains.reduce((total, item) => {
    let itemTotal = item.quantity * item.price;
    // Add the price of each topping
    itemTotal += item.toppings.reduce((toppingTotal, topping) =>
      toppingTotal + itemsMap.mains.toppings[topping].price, 0);
    // ... (gluten-free calculation) ...
    return total + itemTotal;
  }, 0);
  // ... rest of the function ...
}, [mains, sides, drinks]);
```

Update `src/components/Persona.jsx`:

```javascript
// Modify handleAction function to process toppings
if (main.toppings) {
  const currentMain = findMainByType(main.main_type);
  if (currentMain) {
    const newToppings = [...currentMain.toppings];
    main.toppings.forEach((topping) => {
      if (topping.action === "add" && !newToppings.includes(topping.topping)) {
        newToppings.push(topping.topping);
      } else if (topping.action === "remove") {
        const index = newToppings.indexOf(topping.topping);
        if (index > -1) {
          newToppings.splice(index, 1);
        }
      }
    });
    updateMainsState([{ id: main.main_type, toppings: newToppings }]);
  }
}
```

Update `src/components/ItemSection.jsx`:

```jsx
{
  item.toppings && item.toppings.length > 0 && (
    <p
      style={{
        margin: "4px 0 0 0",
        fontSize: "12px",
        color: "#666",
      }}
    >
      Toppings: {item.toppings.join(", ")}
    </p>
  );
}
```

#### Testing Your Changes

1. Start your development server and open the application in your browser.
2. Try adding different toppings to a main item using voice commands or text input.
3. Attempt to remove toppings from an item that already has toppings.
4. Verify that the order summary correctly displays the added toppings and updates the total price.
5. Check that you can add and remove multiple toppings from different main items.

#### Common Pitfalls

- Ensure that the `toppings` array is properly initialized for each main item.
- Verify that the price calculation for toppings is correct in the `calculateTotalPrice` function.
- Check for potential issues with duplicate toppings being added.
- Make sure the AI model is trained to recognize and process topping-related commands, including both additions and removals.

Remember to test each feature thoroughly as you implement it. If you encounter any issues, refer back to the code and ensure all components are correctly updated and connected.

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

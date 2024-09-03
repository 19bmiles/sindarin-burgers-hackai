import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { OrderContext } from "../App";
import PersonaClientSDK from "@sindarin/persona";
import personaConfig from '../persona/index';

const PersonaComponent = ({ init }) => {
  console.log('rendering PersonaComponent')
  const [personaClient, setPersonaClient] = useState(null);
  const [isClientLoaded, setClientLoaded] = useState(false);
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
    isPersonaClientStarted
  } = useContext(OrderContext);

  const actionHandlerRef = useRef(null);
  const initCalledRef = useRef(false);

  const initPersonaClient = useCallback(async () => {
    if (initCalledRef.current) return;
    initCalledRef.current = true;

    console.log("init persona client");
    const apiKey = import.meta.env.VITE_SINDARIN_API_KEY;
    const client = new PersonaClientSDK(apiKey);
    setPersonaClient(client);

    try {
      await client.init({
        userId: '123',
        personaConfig,
        options: {
          streamTranscripts: true,
          shouldNotSaveConversation: false
        }
      });
      console.log("personaClient initialized");
      setClientLoaded(true);
    } catch (error) {
      console.error("Error initializing personaClient:", error);
    }
  }, []);

  useEffect(() => {
    if (init && !isClientLoaded) {
      initPersonaClient();
    }
  }, [init, isClientLoaded, initPersonaClient]);

  useEffect(() => {
    if (isPersonaClientStarted && !isClientLoaded) {
      initPersonaClient();
    }
  }, [isPersonaClientStarted, isClientLoaded]);

  useEffect(() => {
    if (isClientLoaded) {
      console.log("personaClient is loaded", { mains, sides, drinks });
      personaClient.updateState({
        mains,
        sides,
        drinks,
        totalPrice
      });
    }
  }, [isClientLoaded, mains, sides, drinks, totalPrice]);

  const handleAction = useCallback((action) => {
    console.log('actions emitted', action);
    
    const { update_order } = action;

    if (update_order) {
      if (update_order.mains) {
        update_order.mains.forEach(main => {
          if (main.quantity > 0) {
            handleAddMains(main.main_type, main.quantity);
          } else {
            handleSubtractMains(main.main_type, Math.abs(main.quantity));
          }
        });
      }

      if (update_order.sides) {
        update_order.sides.forEach(side => {
          if (side.quantity > 0) {
            handleAddSides(side.side_type, side.size, side.quantity);
          } else {
            handleSubtractSides(side.side_type, side.size, Math.abs(side.quantity));
          }
        });
      }

      if (update_order.drinks) {
        update_order.drinks.forEach(drink => {
          if (drink.quantity > 0) {
            handleAddDrinks(drink.drink_type, drink.size, drink.quantity);
          } else {
            handleSubtractDrinks(drink.drink_type, drink.size, Math.abs(drink.quantity));
          }
        });
      }
    }
  }, [handleAddMains, handleSubtractMains, handleAddSides, handleSubtractSides, handleAddDrinks, handleSubtractDrinks]);
  useEffect(() => {
    if (isClientLoaded && !actionHandlerRef.current) {
      actionHandlerRef.current = handleAction;
      personaClient.on("action", actionHandlerRef.current);
    }
  }, [isClientLoaded, handleAction, personaClient]);

  return null;
}

export default PersonaComponent;

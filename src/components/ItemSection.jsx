import { useContext } from "react"
import { OrderContext } from "../App"
import { AnimatePresence, motion } from "framer-motion";

const ItemSection = ({ type }) => {
  const { mains, sides, drinks } = useContext(OrderContext);

  const items = type === 'mains' ? mains : type === 'sides' ? sides : drinks;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          marginBottom: '32px',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <h3 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '16px',
          color: '#333',
          textTransform: 'capitalize',
          textAlign: 'left',
          paddingLeft: '16px',
        }}>
          {type}
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '24px',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {items.filter(item => item.quantity > 0).map(item => (
            <motion.div
              className="image-card"
              key={`${item.id}-${item.size || ''}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "16px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "16px",
                width: "100%",
                maxWidth: "200px",
                margin: "0 auto",
              }}
            >
              <div className="image-part" style={{ marginRight: "34px" }}>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </div>
              <div className="info-part" style={{ textAlign: "left", flex: 1 }}>
                <h2 style={{ 
                  margin: "0 0 8px 0", 
                  fontSize: "16px", 
                  fontWeight: "600",
                  color: "#333"
                }}>
                  {item.name}
                </h2>
                <p style={{ 
                  margin: "0 0 8px 0", 
                  fontSize: "14px", 
                  color: "#666",
                  fontWeight: "500"
                }}>
                  <span style={{
                    background: "#f0f0f0",
                    borderRadius: "12px",
                    padding: "4px 8px",
                    color: "#333"
                  }}>
                    ${item.price.toFixed(2)} / ea
                  </span>
                </p>
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
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ItemSection
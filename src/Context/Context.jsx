
import axios from "../axios";
import {
    useState,
    useEffect,
    useCallback,
    createContext
} from "react";

const AppContext = createContext({
    data: [],
    isError: "",
    cart: [],
    addToCart: () => {},
    removeFromCart: () => {},
    refreshData: () => {},
    updateStockQuantity: () => {},
    clearCart: () => {}
});

export const AppProvider = ({ children }) => {

    const [data, setData] = useState([]);
    const [isError, setIsError] = useState("");

    const [cart, setCart] = useState(
        () => JSON.parse(localStorage.getItem("cart")) || []
    );

    // Fetch products
    const refreshData = useCallback(async () => {
        try {
            const response = await axios.get("/products");
            setData(response.data);
            setIsError("");
        } catch (error) {
            setIsError(error.message);
        }
    }, []);

    // Add product to cart
    const addToCart = (product) => {
        setCart((previousCart) => {
            const existingProduct = previousCart.find(
                (item) => item.id === product.id
            );

            if (existingProduct) {
                return previousCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...previousCart, { ...product, quantity: 1 }];
        });
    };

    // Remove product from cart
    const removeFromCart = (productId) => {
        setCart((previousCart) =>
            previousCart.filter((item) => item.id !== productId)
        );
    };

    // Clear cart
    const clearCart = () => {
        setCart([]);
    };

    // Fetch products once when provider mounts
    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // Keep cart synchronized with localStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    return (
        <AppContext.Provider
            value={{
                data,
                isError,
                cart,
                addToCart,
                removeFromCart,
                refreshData,
                clearCart
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;

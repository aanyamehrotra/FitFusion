import { createContext, useState, useContext } from 'react';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Loading...');

    const showLoader = (message = 'Loading...') => {
        setLoadingMessage(message);
        setLoading(true);
    };

    const hideLoader = () => {
        setLoading(false);
        setLoadingMessage('Loading...');
    };

    return (
        <LoaderContext.Provider value={{ loading, loadingMessage, showLoader, hideLoader }}>
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within LoaderProvider');
    }
    return context;
};

export default LoaderContext;


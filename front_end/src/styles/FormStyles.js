const Button = ({ children, className, onClick }) => {
    return (
        <button
            className={`bg-blue-500 text-white px-4 py-2 rounded ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;

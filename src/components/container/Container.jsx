import React from 'react';

function Container({
    children,
    size = 'default',
    padding = true,
    className = '',
    fluid = false,
    as: Component = 'div',
    theme = 'light', // Add theme prop to control container theme
}) {
    const sizes = {
        sm: 'max-w-4xl',
        default: 'max-w-7xl',
        lg: 'max-w-8xl',
        fluid: 'max-w-full',
    };

    const paddingClasses = {
        x: padding ? 'px-4 sm:px-6 lg:px-8' : '',
        y: padding ? 'py-2 sm:py-3 lg:py-6' : '',
    };

    const themeClasses = {
        default: 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white shadow-lg rounded-lg', 
        teal: 'bg-gradient-to-r from-teal-900 via-teal-800 to-teal-700 text-white shadow-lg rounded-lg', 
        modernDark: 'bg-gray-900 text-gray-100 shadow-md rounded-xl',
        light: 'bg-[#58656a] text-gray-800 shadow-sm rounded-lg',
        customGray: 'bg-gradient-to-r from-[#485256] via-[#58656a] to-[#6b787e] text-white shadow-lg rounded-lg'
    };
    

    return (
        <Component
            className={`w-full mx-auto ${fluid ? sizes.fluid : sizes[size]} ${paddingClasses.x} ${paddingClasses.y} ${themeClasses[theme]} ${className} `}
        >
            {children}
        </Component>
    );
}

export default Container;

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Logo({ width = '60px', link = '/', className = '', asPlainImage = false }) {
    const imageElement = (
        <img
            src={logo}
            alt="AI Medical System Logo"
            className={`w-auto max-w-[120px] sm:max-w-[150px] md:max-w-[180px] transition-transform duration-300 transform hover:scale-110 hover:shadow-lg ${className}`}
            style={{ width }}
        />
    );

    // Return just the image if asPlainImage is true
    if (asPlainImage) {
        return imageElement;
    }

    // Otherwise wrap it in a Link
    return (
        <Link to={link} className="flex items-center">
            {imageElement}
        </Link>
    );
}

export default Logo;
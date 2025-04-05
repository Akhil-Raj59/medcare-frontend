import React from "react";
import { Link } from "react-router-dom";

// Function to get the preview URL of the image
const getPreviewUrl = (imageId) => {
    return imageId ? `https://your-backend-url.com/images/${imageId}` : "/placeholder.jpg";
};

function PreviewCard({ id, title, image, description }) {
    return (
        <Link 
            to={`/preview/${id}`} 
            className="
                block 
                w-full 
                group 
                transition-all 
                duration-300 
                transform 
                hover:scale-105 
                focus:scale-105
                hover:z-10
                focus:z-10
            "
        >
            <div 
                className="
                    bg-gray-900 
                    border 
                    border-gray-800 
                    rounded-xl 
                    overflow-hidden 
                    shadow-dark-glow 
                    p-4 
                    transition-all 
                    duration-300 
                    group-hover:shadow-dark-intense
                    group-focus:shadow-dark-intense
                    hover:border-blue-500
                    focus:border-blue-500
                "
            >
                {/* Image Preview */}
                <div className="w-full flex justify-center mb-4 overflow-hidden rounded-lg">
                    <img
                        src={getPreviewUrl(image)}
                        alt={title}
                        className="
                            rounded-lg 
                            w-full 
                            h-auto 
                            max-h-48 
                            object-cover 
                            transition-transform 
                            duration-300 
                            group-hover:scale-110 
                            group-focus:scale-110
                        "
                    />
                </div>

                {/* Title */}
                <h2 
                    className="
                        text-lg 
                        sm:text-xl 
                        font-semibold 
                        text-gray-300 
                        line-clamp-2 
                        group-hover:text-blue-400 
                        group-focus:text-blue-400 
                        transition-colors 
                        duration-300
                    "
                >
                    {title}
                </h2>

                {/* Description Preview */}
                {description && (
                    <p className="
                        mt-2 
                        text-sm 
                        text-gray-400 
                        line-clamp-2 
                        transition-all 
                        duration-300 
                        group-hover:text-gray-300 
                        group-focus:text-gray-300
                    ">
                        {description}
                    </p>
                )}
            </div>
        </Link>
    );
}

export default React.memo(PreviewCard);

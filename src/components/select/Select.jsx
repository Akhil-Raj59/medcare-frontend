import React from 'react';
import { useId } from 'react';

const Select = React.forwardRef(
    ({ options, label, className = "", error, disabled, required, ...props }, ref) => {
        const id = useId();

        return (
            <div className={`w-full ${className}`}>
                {label && (
                    <label htmlFor={id} className={`
                        block text-sm font-medium text-gray-700 mb-1 
                        ${required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}
                    `}>
                        {label}
                    </label>
                )}

                <select
                    {...props}
                    ref={ref}
                    id={id}
                    disabled={disabled}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`px-4 py-2 rounded-lg w-full bg-gray-50 text-gray-800 border 
                        ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#2196f3]'}
                        ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'hover:border-gray-400'}
                        outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-[#2196f3]/30 transition-all duration-200`}
                >
                    <option value="" disabled selected hidden>-- Select an option --</option>
                    {options?.map((option) => (
                        <option key={option} value={option} className="text-gray-800">
                            {option}
                        </option>
                    ))}
                </select>

                {error && (
                    <p id={`${id}-error`} className="mt-1 text-xs text-red-500 animate-pulse">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";

export default Select;
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface BoardSizeDropdownProps {
  onSizeChange: (size: number) => void;
  currentSize: number;
}

const BoardSizeDropdown: React.FC<BoardSizeDropdownProps> = ({ onSizeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSizeChange = (size: number) => {
    onSizeChange(size);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={toggleDropdown}
        className="px-3 py-1 text-sm cursor-pointer bg-[#620d91] text-white rounded transition-colors duration-300 hover:bg-[#7c27ab]"
      >
        Board Size
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-pink-600 shadow-lg rounded">
          {[24, 32, 40, 48].map((size) => (
            <a
              key={size}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSizeChange(size);
              }}
              className="block text-white no-underline px-4 py-2 hover:bg-pink-500 text-sm"
            >
              {size}x{size}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardSizeDropdown;
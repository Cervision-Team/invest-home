import React from 'react';
import ReactDOM from 'react-dom';

const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });

  const updateDropdownPosition = React.useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    let rafId = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateDropdownPosition);
    };

    scheduleUpdate();
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('scroll', scheduleUpdate, true);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate, true);
    };
  }, [isOpen, updateDropdownPosition]);

  const selectedOption = options.find(o => o.id === value);

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          className="w-full px-4 py-3 bg-white border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-[#02836F]/20 focus:border-[#02836F] transition-all duration-200 text-sm font-medium text-left cursor-pointer flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={!selectedOption ? 'text-gray-400' : 'text-gray-900'}>
            {selectedOption ? selectedOption.name : placeholder}
          </span>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {isOpen && ReactDOM.createPortal(
        <div 
          ref={dropdownRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 99999
          }}
        >
          <div
            className="px-4 py-3 text-sm text-gray-400 cursor-pointer hover:bg-primary hover:text-white border-b border-gray-100 transition-colors"
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
          >
            {placeholder}
          </div>
          {options.map((option, index) => (
            <div
              key={option.id}
              className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                index !== options.length - 1 ? 'border-b border-gray-100' : ''
              } ${
                value === option.id 
                  ? 'bg-[#02836F]/10 text-[#02836F] font-medium hover:bg-primary hover:text-white' 
                  : 'text-gray-900 hover:bg-primary hover:text-white'
              }`}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
            >
              {option.name}
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

export default CustomSelect;
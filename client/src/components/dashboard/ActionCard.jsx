import React from "react";
import { ChevronRight } from "lucide-react";

/**
 * Reusable ActionCard Component
 * Used for quick action buttons in dashboard
 *
 * @param {Object} props
 * @param {ReactNode} props.icon - Icon component
 * @param {string} props.title - Action title
 * @param {string} props.description - Optional description
 * @param {Function} props.onClick - Click handler
 * @param {number} props.badge - Optional notification badge count
 * @param {boolean} props.disabled - Disable the card
 * @param {boolean} props.comingSoon - Show "Coming Soon" badge
 * @param {string} props.variant - Color variant: 'primary' | 'success' | 'warning' | 'danger'
 */
const ActionCard = ({
  icon,
  title,
  description,
  onClick,
  badge,
  disabled = false,
  comingSoon = false,
  variant = "primary",
}) => {
  const variants = {
    primary: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    success:
      "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    warning:
      "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    danger: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        relative bg-gradient-to-br ${variants[variant]} 
        text-white p-5 rounded-xl 
        transition-all duration-300
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105 hover:shadow-xl"}
      `}
    >
      {/* Coming Soon Badge */}
      {comingSoon && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
          Soon
        </div>
      )}

      {/* Notification Badge */}
      {badge > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
          {badge > 99 ? "99+" : badge}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-lg">
            {React.cloneElement(icon, { size: 24 })}
          </div>
          <div>
            <p className="font-semibold text-base">{title}</p>
            {description && (
              <p className="text-xs text-white/80 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {!disabled && <ChevronRight className="opacity-70" size={20} />}
      </div>
    </div>
  );
};

export default ActionCard;

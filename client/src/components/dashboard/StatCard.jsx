import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Reusable StatCard Component
 * Used for displaying KPI metrics on dashboard
 *
 * @param {Object} props
 * @param {ReactNode} props.icon - Icon component (from lucide-react)
 * @param {string} props.title - Card title
 * @param {string} props.description - Card subtitle/description
 * @param {number|string} props.value - Stat value to display
 * @param {string} props.route - Navigation path on click
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.loading - Show loading state
 * @param {string} props.iconColor - Tailwind color class for icon (e.g., "text-blue-500")
 */
const StatCard = ({
  icon,
  title,
  description,
  value,
  route,
  onClick,
  loading = false,
  iconColor = "text-blue-500",
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
          {React.cloneElement(icon, { className: iconColor })}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-700 dark:text-slate-200">
            {title}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center mt-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : (
        <p className="text-3xl font-bold mt-4 text-slate-800 dark:text-white">
          {value}
        </p>
      )}
    </div>
  );
};

export default StatCard;

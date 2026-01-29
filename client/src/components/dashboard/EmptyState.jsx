import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * Reusable EmptyState Component
 * Displays when there's no data to show
 *
 * @param {Object} props
 * @param {ReactNode} props.icon - Custom icon (optional)
 * @param {string} props.title - Main heading
 * @param {string} props.message - Description text
 * @param {string} props.actionLabel - CTA button text (optional)
 * @param {Function} props.onAction - CTA button click handler (optional)
 * @param {string} props.secondaryLabel - Secondary link text (optional)
 * @param {Function} props.onSecondary - Secondary link click handler (optional)
 */
const EmptyState = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}) => {
  const IconComponent = icon || (
    <AlertCircle className="w-16 h-16 text-slate-400" />
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
      {/* Icon */}
      <div className="mb-4 opacity-50">
        {React.isValidElement(IconComponent)
          ? IconComponent
          : React.cloneElement(icon, { className: "w-16 h-16 text-slate-400" })}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
        {message}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            {actionLabel}
          </button>
        )}
        {secondaryLabel && onSecondary && (
          <button
            onClick={onSecondary}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;

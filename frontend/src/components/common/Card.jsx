const Card = ({ title, subtitle, actions, children, className = '', padded = true }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-card ${className}`}>
    {(title || actions) && (
      <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
        <div>
          {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    )}
    <div className={padded ? 'p-5' : ''}>{children}</div>
  </div>
);

export default Card;

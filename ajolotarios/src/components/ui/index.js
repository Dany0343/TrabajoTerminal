// components/ui/button.jsx
export const Button = ({ children, className, size, variant, ...props }) => {
    const sizeClasses = {
      sm: 'px-2.5 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-2.5 text-lg',
      icon: 'p-2',
    };
  
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      outline: 'border border-gray-300 hover:bg-gray-100',
      ghost: 'bg-transparent hover:bg-gray-100',
    };
  
    const classes = `${sizeClasses[size]} ${variantClasses[variant]} rounded transition-colors ${className}`;
  
    return (
      <button className={classes} {...props}>
        {children}
      </button>
    );
  };
  
  // components/ui/card.jsx
  export const Card = ({ children, className }) => {
    return <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>;
  };
  
  export const CardHeader = ({ children, className }) => {
    return <div className={`p-4 ${className}`}>{children}</div>;
  };
  
  export const CardTitle = ({ children, className }) => {
    return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
  };
  
  export const CardDescription = ({ children, className }) => {
    return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
  };
  
  export const CardContent = ({ children, className }) => {
    return <div className={`p-4 ${className}`}>{children}</div>;
  };
  
  // components/ui/input.jsx
  export const Input = ({ className, ...props }) => {
    return <input className={`border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${className}`} {...props} />;
  };
  
  // components/ui/dropdown-menu.jsx
  export const DropdownMenu = ({ children }) => {
    return <div className="relative">{children}</div>;
  };
  
  export const DropdownMenuTrigger = ({ children, asChild }) => {
    const Comp = asChild ? React.Children.only(children) : 'button';
    return <Comp className="focus:outline-none">{children}</Comp>;
  };
  
  export const DropdownMenuContent = ({ align = 'start', children, className }) => {
    const alignmentClasses = {
      start: 'left-0',
      end: 'right-0',
    };
  
    return (
      <div className={`absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 ${alignmentClasses[align]} ${className}`}>
        <div className="py-1">{children}</div>
      </div>
    );
  };
  
  export const DropdownMenuItem = ({ children, className, ...props }) => {
    return (
      <a
        href="#"
        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  };
  
  export const DropdownMenuSeparator = ({ className }) => {
    return <div className={`border-b border-gray-200 ${className}`} />;
  };
  
  export const DropdownMenuLabel = ({ children, className }) => {
    return (
      <div className={`px-4 py-2 text-sm font-semibold text-gray-900 ${className}`}>
        {children}
      </div>
    );
  };
  
  // components/ui/table.jsx
  export const Table = ({ children, className }) => {
    return <div className={`overflow-x-auto ${className}`}>{children}</div>;
  };
  
  export const TableHeader = ({ children, className }) => {
    return <thead className={`bg-gray-100 ${className}`}>{children}</thead>;
  };
  
  export const TableBody = ({ children, className }) => {
    return <tbody className={className}>{children}</tbody>;
  };
  
  export const TableRow = ({ children, className }) => {
    return <tr className={`border-b ${className}`}>{children}</tr>;
  };
  
  export const TableHead = ({ children, className }) => {
    return (
      <th scope="col" className={`px-6 py-4 text-left font-medium text-gray-500 ${className}`}>
        {children}
      </th>
    );
  };
  
  export const TableCell = ({ children, className }) => {
    return <td className={`px-6 py-4 ${className}`}>{children}</td>;
  };
  
  // components/ui/badge.jsx
  export const Badge = ({ children, variant, className }) => {
    const variantClasses = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    };
  
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
      >
        {children}
      </span>
    );
  };
import { forwardRef } from 'react';

/**
 * Usage with React Hook Form:
 *   <Input label="Full Name" error={errors.fullName} {...register('fullName', required('Full name'))} />
 *   <Input as="select" label="Department" error={errors.department} {...register('department')}>
 *     <option value="">Select department</option>...
 *   </Input>
 */
const Input = forwardRef(
  ({ label, error, as = 'input', className = '', children, hint, ...rest }, ref) => {
    const baseClasses = `block w-full rounded-md border px-3 py-2 text-sm shadow-sm
      focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
      disabled:bg-gray-100 disabled:text-gray-500
      ${error ? 'border-red-400' : 'border-gray-300'}`;

    const Element = as;

    return (
      <div className={className}>
        {label && <label className="form-label">{label}</label>}
        <Element ref={ref} className={baseClasses} {...rest}>
          {children}
        </Element>
        {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        {error && <p className="form-error">{error.message || 'This field is invalid'}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

import cdcLogo from '../assets/cdc-logo.png';

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center px-4 py-10">
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <img src={cdcLogo} alt="CDC logo" className="h-16 w-16 rounded-2xl shadow-sm" />
        </div>
        <p className="text-brand-700 font-semibold text-sm tracking-wide uppercase">CDC Placement Portal</p>
        <h2 className="text-2xl font-semibold text-brand-900 mt-2">{title}</h2>
        {subtitle && <p className="text-sm text-brand-700 mt-1">{subtitle}</p>}
      </div>
      <div className="bg-white border border-brand-100 rounded-lg shadow-card p-6 sm:p-8">{children}</div>
      {footer && <div className="text-center mt-4 text-sm text-brand-700">{footer}</div>}
    </div>
  </div>
);

export default AuthLayout;

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-100 dark:bg-black">
      <div className="relative h-60 w-60 flex items-center justify-center animate-pulse">
        {/* Logo PNG diam di tengah */}
        <img
          src="/images/logo/logo.png" // Ganti dengan path logo
          alt="Logo"
          className="h-50 w-50 object-contain"
        />
      </div>
    </div>
  );
};

export default Loader;

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#f7f9fc] py-8">
      <div className="mx-auto w-full border-t border-slate-200 bg-[#f7f9fc] py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-600 md:flex-row">
          <p>© {year} Ampden</p>
          <p className="text-center md:text-right">
            Built with Next.js • Verified stores only • Modern search UX
          </p>
        </div>
      </div>
    </footer>
  );
}



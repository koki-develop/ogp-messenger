import React, { memo } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = memo((props) => {
  const { children } = props;

  return (
    <div className="relative min-h-screen">
      {/* ヘッダー */}
      <header className="mb-4 border-b py-2">
        <div className="container mx-auto flex px-6">
          <img
            className="mr-1"
            src="/logo64.png"
            alt="Logo"
            height={24}
            width={24}
          />
          <h1 className="font-bold" style={{ fontFamily: '"Sawarabi Gothic"' }}>
            OGP Messenger
          </h1>
        </div>
      </header>

      <main>
        <div className="container mx-auto px-6">{children}</div>
      </main>
    </div>
  );
});

Layout.displayName = "Layout";

export default Layout;

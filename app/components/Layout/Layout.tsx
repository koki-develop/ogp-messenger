import React, { memo } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = memo((props) => {
  const { children } = props;

  return (
    <div className="relative">
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

      <main className="mb-4">
        <div className="container mx-auto px-6">{children}</div>
      </main>

      <footer className="flex flex-col items-center text-sm">
        <p className="mb-2">&copy;2022 Koki Sato</p>
        <a
          href="https://github.com/koki-develop/ogp-messenger"
          target="_blank"
          rel="noreferrer noopener"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  );
});

Layout.displayName = "Layout";

export default Layout;

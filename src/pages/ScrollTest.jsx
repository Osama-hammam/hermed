import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ScrollTest() {
  const [scrollY, setScrollY] = useState(0);
  const [restoredPosition, setRestoredPosition] = useState(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastLogTime = Date.now();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Log significant scroll changes
      const now = Date.now();
      if (
        Math.abs(currentScrollY - lastScrollY) > 50 ||
        now - lastLogTime > 2000
      ) {
        console.log(`Scroll changed: ${lastScrollY}px -> ${currentScrollY}px`);
        lastScrollY = currentScrollY;
        lastLogTime = now;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if scroll position was restored on mount
  useEffect(() => {
    const currentScroll = window.scrollY;
    const savedScroll = sessionStorage.getItem("scroll-/scroll-test");
    console.log("ScrollTest mounted:", { currentScroll, savedScroll });
    setRestoredPosition({ current: currentScroll, saved: savedScroll });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Scroll Restoration Test</h1>

        {/* Debug info */}
        <div className="bg-yellow-100 p-4 rounded-lg mb-8">
          <h2 className="font-semibold mb-2">Debug Info:</h2>
          <p>Current scroll position: {scrollY}px</p>
          {restoredPosition && (
            <p>
              Restored position: {restoredPosition.current}px (saved:{" "}
              {restoredPosition.saved}px)
            </p>
          )}
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => {
                const pos = window.scrollY;
                sessionStorage.setItem("scroll-/scroll-test", pos.toString());
                console.log(`Manually saved scroll position: ${pos}px`);
                alert(`Saved scroll position: ${pos}px`);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Current Position
            </button>
            <Link
              to="/"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block"
            >
              Go to Home (test restoration)
            </Link>
          </div>
        </div>

        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
          Scroll Position: {scrollY}px
        </div>

        <div className="space-y-8">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Section {i + 1}</h2>
              <p className="text-gray-600">
                This is section {i + 1}. Scroll down and navigate between pages
                to test scroll restoration. When you return to this page, you
                should be restored to your previous scroll position.
              </p>
              <p className="text-gray-500 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Navigate to other pages and come back here. Your scroll position
            should be restored!
          </p>
        </div>
      </div>
    </div>
  );
}

export default ScrollTest;

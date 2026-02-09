import { useEffect, useState } from "react";

const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
];

const ThemeDropdown = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost m-1">
                Theme
                <svg
                    width="12px"
                    height="12px"
                    className="ml-2 inline-block h-2 w-2 fill-current opacity-60"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2048 2048"
                >
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
            </div>

            <ul
                tabIndex={0}
                className="dropdown-content bg-base-200 text-base-content rounded-box h-96 w-52 overflow-y-auto shadow"
            >
                {themes.map((t) => (
                    <li key={t}>
                        <button
                            className={`btn btn-ghost w-full justify-start ${theme === t ? "btn-active" : ""
                                }`}
                            onClick={() => setTheme(t)}
                        >
                            {t}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ThemeDropdown;

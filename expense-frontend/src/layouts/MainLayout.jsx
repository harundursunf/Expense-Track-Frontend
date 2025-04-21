import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaPlus, FaList, FaThLarge, FaTachometerAlt } from "react-icons/fa";

export default function MainLayout() {
    const location = useLocation();

    const linkStyle = "hover:text-green-700 flex items-center gap-2 px-2 py-1 rounded transition";
    const activeStyle = "bg-green-100 text-green-900 font-semibold";

    const categoryLinkStyle = "hover:text-blue-700 flex items-center gap-2 px-2 py-1 rounded transition";
    const categoryActiveStyle = "bg-blue-100 text-blue-900 font-semibold";

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-6 flex flex-col gap-8">
                <div className="text-2xl font-extrabold text-green-700 text-center mb-2 tracking-wide">
                    Gider Takip
                </div>

                {/* Expenses */}
                <div>
                    <div className="flex items-center gap-2 text-green-900 font-semibold mb-2 uppercase text-sm">
                        <FaThLarge />
                        <span>Expenses</span>
                    </div>
                    <ul className="ml-4 flex flex-col gap-1">
                        <li>
                            <Link
                                to="/add-expense"
                                className={`${linkStyle} ${location.pathname === "/add-expense" ? activeStyle : ""}`}
                            >
                                <FaPlus /> Add New
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/all-expenses"
                                className={`${linkStyle} ${location.pathname === "/all-expenses" ? activeStyle : ""}`}
                            >
                                <FaList /> All Expenses
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <div className="flex items-center gap-2 text-blue-900 font-semibold mb-2 uppercase text-sm">
                        <FaThLarge />
                        <span>Categories</span>
                    </div>
                    <ul className="ml-4 flex flex-col gap-1">
                        <li>
                            <Link
                                to="/add-category"
                                className={`${categoryLinkStyle} ${location.pathname === "/add-category" ? categoryActiveStyle : ""}`}
                            >
                                <FaPlus /> Add New
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/all-categories"
                                className={`${categoryLinkStyle} ${location.pathname === "/all-categories" ? categoryActiveStyle : ""}`}
                            >
                                <FaList /> All Categories
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Dashboard */}
                <div className="pt-4 border-t border-gray-200 mt-auto">
                    <Link
                        to="/dashboard"
                        className={`flex items-center gap-2 text-gray-800 hover:text-black px-2 py-2 rounded transition ${
                            location.pathname === "/dashboard" ? "bg-gray-100 font-semibold" : ""
                        }`}
                    >
                        <FaTachometerAlt /> Dashboard
                    </Link>
                </div>
            </aside>

            {/* Dinamik içerik */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}

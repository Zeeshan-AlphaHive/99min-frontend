"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, User, Menu, X, MessageSquare, Search } from "lucide-react";
import TicketBadge from "./TicketBadge";
import LanguageDropdown from "./LanguageDropdown";
import { useI18n } from "@/contexts/i18n-context";
import { useSearch } from "@/contexts/search-context";

const navLinks: { href: string; label: string }[] = [
  { href: "/dashboard/explore", label: "Explore/Home" },
  { href: "/dashboard/create", label: "Create" },
  { href: "/dashboard/subscriptions", label: "Subscriptions" },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { tr } = useI18n();
  const { setQuery } = useSearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isSettingsRoute = pathname?.startsWith("/dashboard/settings");

  const iconLinks = [
    { href: "/dashboard/messages", icon: MessageSquare, label: "Messages", route: "/dashboard/messages" },
    { href: "/dashboard/notifications", icon: Bell, label: "Notifications", route: "/dashboard/notifications" },
    { href: "/dashboard/settings", icon: User, label: "Settings", route: "/dashboard/settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-40 shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Main row ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <div className="flex-shrink-0">
            <TicketBadge />
          </div>

          {/* ── Search bar: hidden on mobile, visible md+ ─────────────── */}
          {!isSettingsRoute && (
            <div className="relative flex-1 max-w-xs lg:max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textGray" />
              <input
                type="text"
                placeholder={tr("Search tasks...")}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-inputBg rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-orange focus:bg-white transition-all text-sm text-textBlack placeholder:text-textGray"
              />
            </div>
          )}

          {/* ── Nav links: desktop only (lg+) ─────────────────────────── */}
          <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors relative pb-1 whitespace-nowrap ${
                    isActive
                      ? "text-textBlack font-bold"
                      : "text-textGray hover:text-textBlack font-medium"
                  }`}
                >
                  {tr(link.label)}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right-side actions ────────────────────────────────────── */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Mobile: search toggle */}
            {!isSettingsRoute && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-textGray" />
              </button>
            )}

            {/* Language dropdown */}
            <div className="md:hidden">
              <LanguageDropdown compact />
            </div>
            <div className="hidden md:block">
              <LanguageDropdown />
            </div>

            {/* Icon links: desktop only (lg+) — shown in hamburger on smaller screens */}
            {iconLinks.map(({ href, icon: Icon, route }) => (
              <Link key={href} href={href} className="hidden lg:block">
                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <Icon className={`w-5 h-5 ${pathname === route ? "text-orange" : "text-textGray"}`} />
                </button>
              </Link>
            ))}

            {/* Hamburger: visible below lg */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen
                ? <X className="w-5 h-5 text-textBlack" />
                : <Menu className="w-5 h-5 text-textBlack" />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile search bar ────────────────────────────────────────── */}
        {!isSettingsRoute && isSearchOpen && (
          <div className="md:hidden py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textGray" />
              <input
                type="text"
                placeholder={tr("Search tasks...")}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-inputBg rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-orange focus:bg-white transition-all text-sm text-textBlack placeholder:text-textGray"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* ── Hamburger dropdown menu ──────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3">
            <div className="flex flex-col gap-1">

              {/* Nav links */}
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-semibold text-sm py-2.5 px-3 rounded-lg transition-colors ${
                      isActive
                        ? "text-orange bg-orange/5"
                        : "text-textGray hover:text-textBlack hover:bg-gray-50"
                    }`}
                  >
                    {tr(link.label)}
                  </Link>
                );
              })}

              {/* Icon links (messages, notifications, settings) */}
              {iconLinks.map(({ href, icon: Icon, label, route }) => {
                const isActive = pathname === route;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 font-semibold text-sm py-2.5 px-3 rounded-lg transition-colors ${
                      isActive
                        ? "text-orange bg-orange/5"
                        : "text-textGray hover:text-textBlack hover:bg-gray-50"
                    }`}
                  >
                    {/* <Icon className="w-4 h-4" /> */}
                    {tr(label)}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
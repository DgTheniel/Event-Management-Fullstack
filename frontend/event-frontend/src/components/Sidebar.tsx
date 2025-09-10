import React, { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";

const menuItems = [
  {
    label: "Dashboard",
    path: "/management",
    icon: <></>,
  },
  {
    label: "Events",
    path: "/management/events",
    icon: <></>,
  },
  {
    label: "Venues",
    path: "/management/venues",
    icon: <></>,
  },
  {
    label: "Bookings",
    path: "/management/bookings",
    icon: <></>,
  },
  {
    label: "Analytics",
    path: "/management/analytics",
    icon: <></>,
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [openItem, setOpenItem] = React.useState<string | undefined>(undefined);

  // Fallback to details/summary if Radix Accordion is not available
  const useAccordion = true; // Set false to fallback

  if (useAccordion) {
    return (
      <div
        className={`bg-white shadow-lg h-full ${
          collapsed ? "w-18" : "w-64"
        } transition-width duration-300 flex flex-col`}
      >
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-4 focus:outline-none focus:ring-2 focus:ring-managementAccent"
        >
          {collapsed ? "☰" : "✕"}
        </button>
        <Accordion.Root
          type="single"
          collapsible
          value={openItem}
          onValueChange={setOpenItem}
          className="flex-1 overflow-y-auto"
        >
          {menuItems.map((item) => (
            <Accordion.Item key={item.path} value={item.path}>
              <Accordion.Header>
                <Accordion.Trigger
                  className={`flex items-center px-4 py-3 w-full text-left ${
                    collapsed ? "justify-center" : ""
                  } hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-managementAccent`}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Accordion.Trigger>
              </Accordion.Header>
              {!collapsed && (
                <Accordion.Content className="px-8 py-2 text-sm text-gray-600">
                  {/* Nested menu items could go here */}
                  <ul>
                    <li>
                      <a href="#" className="block py-1 hover:text-managementAccent">
                        Subitem 1
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block py-1 hover:text-managementAccent">
                        Subitem 2
                      </a>
                    </li>
                  </ul>
                </Accordion.Content>
              )}
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    );
  }

  // Fallback with details/summary
  return (
    <nav
      className={`bg-white shadow-lg h-full ${
        collapsed ? "w-18" : "w-64"
      } transition-width duration-300`}
    >
      <button
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="p-4 focus:outline-none focus:ring-2 focus:ring-managementAccent"
      >
        {collapsed ? "☰" : "✕"}
      </button>
      <ul>
        {menuItems.map((item) => (
          <li key={item.path}>
            <details>
              <summary className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100">
                {item.icon}
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </summary>
              {!collapsed && (
                <ul className="pl-8 py-2 text-sm text-gray-600">
                  <li>
                    <a href="#" className="block py-1 hover:text-managementAccent">
                      Subitem 1
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block py-1 hover:text-managementAccent">
                      Subitem 2
                    </a>
                  </li>
                </ul>
              )}
            </details>
          </li>
        ))}
      </ul>
    </nav>
  );
}

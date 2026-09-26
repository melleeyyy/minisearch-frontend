import { NavLink } from "react-router-dom";
import { ActivityIcon, BellIcon, HomeIcon, SearchIcon } from "./icons";

const ITEMS = [
  { to: "/", label: "Home", icon: <HomeIcon /> },
  { to: "/search", label: "Search", icon: <SearchIcon /> },
  { to: "/notifications", label: "Notifications", icon: <BellIcon /> },
  { to: "/activity", label: "Activity", icon: <ActivityIcon /> },
];

export default function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `bottom-nav-item${isActive ? " active" : ""}`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

import React, { useState } from "react";
import {
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { ExpandLess, ExpandMore, Inbox, Mail } from "@mui/icons-material";
import "./App.css";

// Menu items structure
const menuItems = [
  {
    name: "Dành cho Các Bác Cao Niên và Thành Viên Gia Đình",
    submenus: [
      {
        name: "Hướng dẫn sử dụng ứng dụng",
        items: ["Detail 1", "Detail 2"],
      },
      {
        name: "Câu hỏi thường gặp về giải pháp",
        items: ["Detail 3", "Detail 4"],
      },
      {
        name: "Câu hỏi thường gặp về thanh toán",
        items: ["Detail 5", "Detail 6"],
      },
    ],
  },
  {
    name: "Dành cho các Bạn Trẻ",
    submenus: [
      {
        name: "Hướng dẫn sử dụng ứng dụng",
        items: ["Detail 1", "Detail 2"],
      },
      {
        name: "Câu hỏi thường gặp về giải pháp",
        items: ["Detail 3", "Detail 4"],
      },
      {
        name: "Câu hỏi thường gặp về thanh toán",
        items: ["Detail 5", "Detail 6"],
      },
    ],
  },
];

// Helper functions
const getIcon = (type, isActive) =>
  type === "item" && isActive ? <Inbox /> : <Mail />;

const Sidebar = ({
  openMenus,
  openSubMenus,
  handleToggle,
  handleSubToggle,
  handleContentChange,
  activeMenu,
  activeSubMenu,
  activeItem,
}) => {
  const renderItems = (items, level) => (
    <List component="div" disablePadding>
      {items.map((item, index) => (
        <ListItem
          key={index}
          button
          sx={{
            pl: level,
            backgroundColor: activeItem === item ? "lightgreen" : "inherit",
          }}
          onClick={() => handleContentChange(item)}
        >
          <ListItemIcon>{getIcon("item", activeItem === item)}</ListItemIcon>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 420,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 420,
          position: "unset",
        },
      }}
    >
      <List>
        {menuItems.map((menu, menuIndex) => (
          <React.Fragment key={menuIndex}>
            <ListItem
              button
              onClick={() => handleToggle(menuIndex, menu.name)}
              sx={{
                backgroundColor:
                  activeMenu === menu.name ? "lightgrey" : "inherit",
              }}
            >
              <ListItemIcon>
                {getIcon("menu", activeMenu === menu.name)}
              </ListItemIcon>
              <ListItemText primary={menu.name} />
              {openMenus[menuIndex] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openMenus[menuIndex]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {menu.submenus.map((subMenu, subMenuIndex) => (
                  <React.Fragment key={subMenuIndex}>
                    <ListItem
                      button
                      onClick={() =>
                        handleSubToggle(menuIndex, subMenuIndex, subMenu.name)
                      }
                      sx={{
                        pl: 4,
                        backgroundColor:
                          activeSubMenu === subMenu.name
                            ? "lightblue"
                            : "inherit",
                      }}
                    >
                      <ListItemIcon>
                        {getIcon("submenu", activeSubMenu === subMenu.name)}
                      </ListItemIcon>
                      <ListItemText primary={subMenu.name} />
                      {openSubMenus[menuIndex]?.[subMenuIndex] ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </ListItem>
                    <Collapse
                      in={openSubMenus[menuIndex]?.[subMenuIndex]}
                      timeout="auto"
                      unmountOnExit
                    >
                      {renderItems(subMenu.items, 8)}
                    </Collapse>
                  </React.Fragment>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

const MainContent = ({
  selectedContent,
  handlePrevious,
  handleNext,
  isPrevDisabled,
  isNextDisabled,
}) => (
  <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "16px" }}>
    <Typography variant="h4">
      {selectedContent || "Select a menu item"}
    </Typography>
    <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
      <Button
        variant="contained"
        onClick={handlePrevious}
        disabled={isPrevDisabled}
      >
        Previous
      </Button>
      <Button
        variant="contained"
        onClick={handleNext}
        disabled={isNextDisabled}
      >
        Next
      </Button>
    </Box>
  </Box>
);

const App = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [selectedContent, setSelectedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Flatten the menu structure
  const flattenMenu = () =>
    menuItems.flatMap((menu, menuIndex) => [
      { type: "menu", name: menu.name, menuIndex },
      ...menu.submenus.flatMap((subMenu, subMenuIndex) => [
        { type: "submenu", name: subMenu.name, menuIndex, subMenuIndex },
        ...subMenu.items.map((item) => ({
          type: "item",
          name: item,
          menuIndex,
          subMenuIndex,
        })),
      ]),
    ]);

  const flatMenu = flattenMenu();

  const handleToggle = (index, name) => {
    const newOpenMenus = { ...openMenus, [index]: !openMenus[index] };

    // Collapse all submenus when a menu is toggled
    const newOpenSubMenus = { ...openSubMenus };
    if (newOpenMenus[index]) {
      // If the menu is being opened, collapse all other menus
      Object.keys(newOpenMenus).forEach((key) => {
        if (parseInt(key) !== index) {
          newOpenMenus[key] = false;
          delete newOpenSubMenus[key]; // Collapse all submenus of other menus
        }
      });
    } else {
      // If the menu is being closed, collapse its submenus
      newOpenSubMenus[index] = {};
    }

    setOpenMenus(newOpenMenus);
    setOpenSubMenus(newOpenSubMenus);
    handleContentChange(name);
  };

  const handleSubToggle = (menuIndex, subMenuIndex, name) => {
    const newOpenSubMenus = { ...openSubMenus };

    if (newOpenSubMenus[menuIndex]) {
      newOpenSubMenus[menuIndex] = {
        ...newOpenSubMenus[menuIndex],
        [subMenuIndex]: !newOpenSubMenus[menuIndex][subMenuIndex],
      };
    } else {
      newOpenSubMenus[menuIndex] = { [subMenuIndex]: true };
    }

    setOpenSubMenus(newOpenSubMenus);
    handleContentChange(name);
  };

  const handleContentChange = (content) => {
    setSelectedContent(content);
    const index = flatMenu.findIndex((item) => item.name === content);
    setCurrentIndex(index);
  };

  const handleButton = (content) => {
    setSelectedContent(content);
    const index = flatMenu.findIndex((item) => item.name === content);
    const { menuIndex, subMenuIndex } = flatMenu[index] || {};
    if (menuIndex !== undefined) {
      setOpenMenus((prev) => ({ ...prev, [menuIndex]: true }));
    }
    if (subMenuIndex !== undefined) {
      setOpenSubMenus((prev) => ({
        ...prev,
        [menuIndex]: { ...prev[menuIndex], [subMenuIndex]: true },
      }));
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      handleButton(flatMenu[newIndex].name);
    }
  };

  const handleNext = () => {
    if (currentIndex < flatMenu.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      handleButton(flatMenu[newIndex].name);
    }
  };

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex === flatMenu.length - 1;

  const getActiveMenu = () =>
    flatMenu[currentIndex]?.type === "menu"
      ? flatMenu[currentIndex].name
      : menuItems.find((menu) =>
          menu.submenus.some((subMenu) =>
            subMenu.items.includes(flatMenu[currentIndex]?.name)
          )
        )?.name;

  const getActiveSubMenu = () =>
    flatMenu[currentIndex]?.type === "submenu"
      ? flatMenu[currentIndex].name
      : menuItems
          .flatMap((menu) => menu.submenus)
          .find((subMenu) =>
            subMenu.items.includes(flatMenu[currentIndex]?.name)
          )?.name || "";

  const getActiveItem = () =>
    flatMenu[currentIndex]?.type === "item" ? flatMenu[currentIndex].name : "";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Hero Banner */}
      <Box
        sx={{
          backgroundColor: "lightblue",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          padding: 4,
          width: "100%",
          zIndex: 10,
          textAlign: "center",
          height: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" component="h1">
          Ứng dụng TECD - Các câu hỏi thường gặp
        </Typography>
      </Box>

      {/* Main Layout */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {/* Sidebar */}
        <Sidebar
          openMenus={openMenus}
          openSubMenus={openSubMenus}
          handleToggle={handleToggle}
          handleSubToggle={handleSubToggle}
          handleContentChange={handleContentChange}
          activeMenu={getActiveMenu()}
          activeSubMenu={getActiveSubMenu()}
          activeItem={getActiveItem()}
        />

        {/* Main Content */}
        <MainContent
          selectedContent={selectedContent}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          isPrevDisabled={isPrevDisabled}
          isNextDisabled={isNextDisabled}
        />
      </Box>
    </Box>
  );
};

export default App;

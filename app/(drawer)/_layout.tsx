import { Drawer } from "expo-router/drawer";

const menus = [
  { name: "index", title: "Basic" },
  { name: "tanstackform", title: "Tanstack Form" },
  { name: "formcomposition", title: "Form Composition" },
];

export default function Layout() {
  return (
    <Drawer>
      {menus.map((item, index) => (
        <Drawer.Screen
          key={index}
          name={item.name}
          options={{ drawerLabel: item.title, title: item.title }}
        />
      ))}
    </Drawer>
  );
}

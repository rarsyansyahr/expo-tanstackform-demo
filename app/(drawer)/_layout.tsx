import { Drawer } from "expo-router/drawer";

const menus = [
  { name: "index", title: "Basic" },
  { name: "tanstackForm", title: "Tanstack Form" },
  { name: "formComposition", title: "Form Composition" },
];

export default function Layout() {
  return (
    <Drawer>
      {menus.map(({ name, title }) => (
        <Drawer.Screen
          key={name}
          name={name}
          options={{ drawerLabel: title, title }}
        />
      ))}
    </Drawer>
  );
}

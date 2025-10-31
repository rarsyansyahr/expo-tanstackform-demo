import { Drawer } from "expo-router/drawer";

const menus = [
  { name: "index", title: "Manual Form" },
  { name: "tanstackFormBasic", title: "Tanstack Form Basic" },
  { name: "tanstackFormComposition", title: "Tanstack Form Composition" },
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

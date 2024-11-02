import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { ThemeProvider } from "./components/theme/theme-provider.tsx";
import "./index.css";
import {
	createBrowserRouter,
	redirect,
	RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "*",
		// element: <App />,
		loader: async () => redirect("/"),
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<RouterProvider router={router} />
		</ThemeProvider>
	</StrictMode>
);

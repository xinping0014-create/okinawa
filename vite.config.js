import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["header.png", "icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "Okinawa Trip",
        short_name: "Okinawa",
        start_url: "/",
        display: "standalone",
        background_color: "#F7F4EB",
        theme_color: "#F7F4EB",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ]
});

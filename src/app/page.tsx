"use client";
import Geolocation from "./components/GeoLocation";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full font-[family-name:var(--font-geist-sans)]">
      <Geolocation />
    </div>
  );
}

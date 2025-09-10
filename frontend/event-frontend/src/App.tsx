import React from "react";
export default function App(){
  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Event Management App</h1>
      <p className="text-gray-700 mb-4">App is working! Navigate to:</p>
      <ul className="list-disc list-inside space-y-2">
        <li><a href="/public" className="text-blue-600 hover:underline">/public - Public Event Discovery</a></li>
        <li><a href="/management" className="text-green-600 hover:underline">/management - Management Interface</a></li>
      </ul>
    </div>
  );
}

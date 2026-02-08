import { useState } from "react";
import { Outlet } from "react-router-dom";
import PatientSidebar from "../components/PatientSidebar";
import Footer from "../components/Footer";
import { Menu, X } from "lucide-react"; // Import for mobile toggle

const PatientLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    /* min-h-screen ensures the container is at least the height of the device */
    <div className="min-h-screen bg-[#EFF6F7] flex flex-col">
      
      {/* 1. Mobile Toggle Button (Since there is no header) */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] p-4 bg-[#32618F] text-white rounded-full shadow-2xl active:scale-95 transition-transform"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Pass close function to Sidebar links so clicking a link closes menu on mobile */}
        <div onClick={() => setMobileMenuOpen(false)} className="h-full">
            <PatientSidebar />
        </div>
      </aside>

      {/* Main Container */}
      <div className="lg:pl-64 flex flex-col flex-1">
        

        {/* Main Content Area: 
           'flex-1' is the magic here. It grows to fill all 
           remaining vertical space, pushing the footer to the bottom.
        */}
        <main className="p-4 sm:p-6 flex-1">
            <div className="lg:mt-0 mt-4">
                <Outlet />
            </div>
        </main>

        {/* Footer Component */}
        <Footer />
      </div>
    </div>
  );
};

export default PatientLayout;
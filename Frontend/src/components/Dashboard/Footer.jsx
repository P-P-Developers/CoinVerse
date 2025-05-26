import React from 'react';



const Footer = () => {

  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        
        <p className="text-sm text-center md:text-left">
          © <span className="font-semibold">{window.location.hostname == "localhost" ?"Coin Verse":window.location.hostname}</span> {new Date().getFullYear()} — Designed & Developed with ❤️
        </p>



      </div>
    </footer>
  );
};

export default Footer;

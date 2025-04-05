import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

function Footer() {
  return (
    <section className="relative overflow-hidden py-10 bg-[#444444] text-white border-t border-gray-600">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="-m-6 flex flex-wrap">
          {/* LOGO & COPYRIGHT */}
          <div className="w-full p-6 md:w-1/2 lg:w-4/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 inline-flex items-center">
                <Logo width="100px" />
              </div>
              <p className="text-sm text-gray-300">
                &copy; 2024 AI-Powered Medical System. All Rights Reserved.
              </p>
            </div>
          </div>

          {/* ABOUT US */}
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-5 text-xs font-semibold uppercase text-blue-400">
                About Us
              </h3>
              <ul>
                {['Our Mission', 'AI Assistance', 'How It Works', 'Testimonials'].map((item, index) => (
                  <li className="mb-4" key={index}>
                    <Link className="text-base font-medium hover:text-blue-400 transition" to="/">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SERVICES */}
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-5 text-xs font-semibold uppercase text-blue-400">
                Services
              </h3>
              <ul>
                {['Find a Hospital', 'Book Appointments', '24/7 AI Chatbot', 'Home Checkup'].map((item, index) => (
                  <li className="mb-4" key={index}>
                    <Link className="text-base font-medium hover:text-blue-400 transition" to="/">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SUPPORT */}
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-5 text-xs font-semibold uppercase text-blue-400">
                Support
              </h3>
              <ul>
                {['FAQs', 'Contact Us', 'Emergency Help', 'Customer Support'].map((item, index) => (
                  <li className="mb-4" key={index}>
                    <Link className="text-base font-medium hover:text-blue-400 transition" to="/">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* LEGALS */}
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-5 text-xs font-semibold uppercase text-blue-400">
                Legal
              </h3>
              <ul>
                {['Terms of Service', 'Privacy Policy', 'Licensing'].map((item, index) => (
                  <li className="mb-4" key={index}>
                    <Link className="text-base font-medium hover:text-blue-400 transition" to="/">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;

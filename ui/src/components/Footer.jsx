import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-600 font-medium">
            © {new Date().getFullYear()} CareConnect Healthcare.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href="#" className="text-xs text-gray-500 hover:text-[#32618F] transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-xs text-gray-500 hover:text-[#32618F] transition-colors">
            Terms of Service
          </a>
          <a href="mailto:support@careconnect.com" className="text-xs font-medium text-[#4EB1B6] hover:text-[#32618F] transition-colors">
            Help Center
          </a>
          <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-400">
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
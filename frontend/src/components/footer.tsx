import Link from "next/link"
import { CalendarDays, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative p-3 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg">
                <CalendarDays className="h-6 w-6 text-white" />
                <div className="absolute -top-1 -right-1 p-1 bg-yellow-400 rounded-full animate-pulse">
                  <Zap className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-white font-display">QUANTIME AI</span>
                <p className="text-sm text-gray-300 -mt-1 font-ai">Smart Scheduler</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed font-ai">
              Revolutionizing academic scheduling with quantum intelligence and AI-powered automation.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="p-2 bg-white/10 rounded-lg hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              >
                <Facebook className="h-4 w-4 text-white" />
              </Link>
              <Link
                href="#"
                className="p-2 bg-white/10 rounded-lg hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              >
                <Twitter className="h-4 w-4 text-white" />
              </Link>
              <Link
                href="#"
                className="p-2 bg-white/10 rounded-lg hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="h-4 w-4 text-white" />
              </Link>
              <Link
                href="#"
                className="p-2 bg-white/10 rounded-lg hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-4 w-4 text-white" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white font-display">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors font-ai hover:translate-x-1 inline-block transition-transform"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-gray-300 hover:text-white transition-colors font-ai hover:translate-x-1 inline-block transition-transform"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-gray-300 hover:text-white transition-colors font-ai hover:translate-x-1 inline-block transition-transform"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors font-ai hover:translate-x-1 inline-block transition-transform"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white font-display">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors font-ai hover:translate-x-1 inline-block transition-transform"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors font-ai hover:translate-x-1 inline-block transition-transform"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors font-ai hover:translate-x-1 inline-block transition-transform"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors font-ai hover:translate-x-1 inline-block transition-transform"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white font-display">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-gray-300 text-sm font-ai">UMT Campus, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="text-gray-300 text-sm font-ai">+92 42 111 300 200</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="text-gray-300 text-sm font-ai">E.admissions@umt.edu.pk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm font-ai">
            &copy; {new Date().getFullYear()} University of Management and Technology. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2 font-ai">
            Powered by Quantum Intelligence • Built with ❤️ by the QuantiMe Team
          </p>
        </div>
      </div>
    </footer>
  )
}

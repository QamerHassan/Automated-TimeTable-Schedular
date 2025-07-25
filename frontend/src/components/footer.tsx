import Link from "next/link"
import { CalendarDays, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl">
                <CalendarDays className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">UMT Timetable</span>
                <p className="text-sm text-secondary-foreground/80 -mt-1">Scheduler</p>
              </div>
            </div>
            <p className="text-secondary-foreground/80 text-sm leading-relaxed">
              Revolutionizing academic scheduling with intelligent automation and user-friendly design.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-secondary-foreground/80 text-sm">UMT Campus, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-secondary-foreground/80 text-sm">+92 42 111 300 200</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-secondary-foreground/80 text-sm">support@umt.edu.pk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-secondary-foreground/60 text-sm">
            &copy; {new Date().getFullYear()} University of Management and Technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

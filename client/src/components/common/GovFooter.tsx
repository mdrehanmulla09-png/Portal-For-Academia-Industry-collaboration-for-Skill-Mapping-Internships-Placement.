import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

export const GovFooter: React.FC = () => {
  return (
    <footer className="bg-[#162332] text-[#A6B4C4] text-xs border-t border-[#223246] no-print mt-auto">
      {/* Tricolor Ribbon */}
      <div className="gov-tricolor-bar" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">
                SkillBridge <span className="text-[#D1E3D8]">India</span>
              </span>
              <span className="text-[10px] bg-[#223246] text-[#E2E8F0] font-medium px-2 py-0.5 rounded border border-[#2D415A]">
                Problem ID: 26044
              </span>
            </div>
            <p className="text-xs text-[#8C9DAE] leading-relaxed max-w-sm">
              Connecting Education, Skills, and Industry. A national digital public platform
              aligning student competency development with contemporary industrial demand.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded bg-[#101A26] border border-[#223246] text-[11px] text-[#A6B4C4]">
                <Shield className="w-3.5 h-3.5 text-[#B96D4D]" />
                <span>National Innovation Prototype (ID: 26044)</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Students */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">
              Students
            </h4>
            <ul className="space-y-2 text-[#8C9DAE]">
              <li>
                <Link to="/skill-development" className="hover:text-white transition-colors">
                  Skill Assessment
                </Link>
              </li>
              <li>
                <Link to="/internships" className="hover:text-white transition-colors">
                  Internship Catalog
                </Link>
              </li>
              <li>
                <Link to="/placements" className="hover:text-white transition-colors">
                  Graduate Placements
                </Link>
              </li>
              <li>
                <Link to="/learning" className="hover:text-white transition-colors">
                  Industry Courses
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Digital Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Industry & Faculty */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">
              Industry & Academia
            </h4>
            <ul className="space-y-2 text-[#8C9DAE]">
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Post Opportunities
                </Link>
              </li>
              <li>
                <Link to="/collaboration" className="hover:text-white transition-colors">
                  Joint Research & MoUs
                </Link>
              </li>
              <li>
                <Link to="/learning" className="hover:text-white transition-colors">
                  Faculty Development (FDP)
                </Link>
              </li>
              <li>
                <Link to="/collaboration" className="hover:text-white transition-colors">
                  Guest Lecture Directory
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  Verification Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Help */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">
              Support & Grievance
            </h4>
            <ul className="space-y-2 text-[#8C9DAE]">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>support@skillbridge.gov.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>1800-11-26044 (Toll Free)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                <span>Shastri Bhawan, New Delhi 110001</span>
              </li>
              <li className="pt-1">
                <Link to="/contact" className="text-[#D1E3D8] hover:underline font-medium">
                  Help Desk & FAQs &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Prototype Statutory Notice */}
        <div className="mt-8 pt-6 border-t border-[#223246] text-[11px] text-[#788899] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="leading-relaxed">
              <strong>Evaluation Disclaimer:</strong> SkillBridge India is an innovation competition
              prototype designed specifically for <strong>Problem Statement ID: 26044</strong>. It is
              distinct from officially deployed statutory government services. Sample institution names
              and candidate profiles are synthetic test records for functionality demonstration.
            </p>
          </div>
          <div className="flex items-center gap-4 whitespace-nowrap text-[#788899]">
            <Link to="/about" className="hover:text-white">About System</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white">Privacy Policy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white">Accessibility</Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-4 text-center text-[10px] text-[#5C6E80]">
          National Academia–Industry Collaboration Portal | © 2026 SkillBridge India Prototype
        </div>
      </div>
    </footer>
  );
};

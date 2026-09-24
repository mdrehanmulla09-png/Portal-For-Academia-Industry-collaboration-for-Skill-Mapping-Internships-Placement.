import React, { useState } from 'react';
import { GovHeader } from '../../components/common/GovHeader';
import { GovFooter } from '../../components/common/GovFooter';
import { useNotifications } from '../../context/NotificationContext';
import {
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2
} from 'lucide-react';

export const ContactHelpPage: React.FC = () => {
  const { showToast } = useNotifications();
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketCategory, setTicketCategory] = useState<string>('Skill Assessment');
  const [ticketEmail, setTicketEmail] = useState<string>('');
  const [ticketMessage, setTicketMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Support Ticket Logged', 'Your query has been recorded under Ticket #SB-8921. An acknowledgment has been transmitted.', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <GovHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F2EFE9] border border-[#E5E1D9] text-[#245C56] text-xs font-medium mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#B96D4D]" />
            Citizen Helpdesk & Grievance Redressal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#252B32] tracking-tight">
            Support, FAQs & Inquiries
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Assistance regarding credential verification, application tracking, or corporate MoUs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Direct Channels & FAQs */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white rounded-md border border-[#E5E1D9] p-5 shadow-xs space-y-4">
              <h3 className="font-semibold text-[#252B32] text-xs uppercase tracking-wider">Official Channels</h3>

              <div className="flex items-start gap-3 text-xs text-[#667085]">
                <Phone className="w-4 h-4 text-[#245C56] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#252B32]">National Helpline (Toll Free)</div>
                  <div className="text-[#667085]">1800-11-26044 / 011-2338-9000</div>
                  <div className="text-[10px] text-[#8C95A6]">Monday to Friday, 9:00 AM - 6:00 PM IST</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-[#667085]">
                <Mail className="w-4 h-4 text-[#245C56] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#252B32]">Official Email Inquiries</div>
                  <div className="text-[#667085]">grievance@skillbridge.gov.in</div>
                  <div className="text-[#667085]">partnerships@skillbridge.gov.in</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-[#667085]">
                <MapPin className="w-4 h-4 text-[#B96D4D] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#252B32]">National Secretariat</div>
                  <div className="text-[#667085] leading-relaxed">
                    Department of Higher Education & Skill Development,<br />
                    Shastri Bhawan, New Delhi 110001
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQs */}
            <div className="bg-white rounded-md border border-[#E5E1D9] p-5 shadow-xs space-y-3">
              <h3 className="font-semibold text-[#252B32] text-xs uppercase tracking-wider">Frequently Asked Questions</h3>

              <div className="text-xs space-y-1">
                <div className="font-semibold text-[#252B32]">Q: How is the Skill Match Score computed?</div>
                <div className="text-[#667085] leading-relaxed">
                  It applies a transparent mathematical weighted formula benchmarked against required employer proficiencies and verified tests.
                </div>
              </div>

              <div className="text-xs space-y-1 pt-2 border-t border-[#E5E1D9]">
                <div className="font-semibold text-[#252B32]">Q: How do credentials receive the Verified Badge?</div>
                <div className="text-[#667085] leading-relaxed">
                  Certificates uploaded to student portfolios undergo institutional or employer mentor review before obtaining verification.
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Submission Form */}
          <div className="md:col-span-7 bg-white rounded-md border border-[#E5E1D9] p-6 sm:p-8 shadow-xs">
            <h3 className="font-bold text-[#252B32] text-sm mb-1">Submit an Inquiry or Grievance Ticket</h3>
            <p className="text-xs text-[#667085] mb-5">Our nodal grievance officer will review and respond within 24 business hours.</p>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#F0F5F2] text-[#2E6B4A] border border-[#D1E3D8] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-[#252B32] text-sm">Grievance Ticket Recorded</h4>
                <p className="text-xs text-[#667085] max-w-sm mx-auto">
                  Ticket reference <strong>#SB-8921</strong> has been logged in the portal register. An email acknowledgment has been sent.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold text-[#245C56] hover:underline"
                  >
                    Submit another inquiry &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#252B32] mb-1">Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={ticketEmail}
                    onChange={(e) => setTicketEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-3 py-2 border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#252B32] mb-1">Grievance Category *</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D0CBC0] rounded-md bg-white focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                    >
                      <option value="Skill Assessment">Skill Assessment Query</option>
                      <option value="Application Tracking">Application Tracking</option>
                      <option value="Verification Request">Credential Verification</option>
                      <option value="Industry MoU">Industry Collaboration MoU</option>
                      <option value="Technical Issue">Technical Platform Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#252B32] mb-1">Subject Line *</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Brief topic summary"
                      className="w-full px-3 py-2 border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#252B32] mb-1">Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide specific identifiers, dates, and details of the matter..."
                    className="w-full px-3 py-2 border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-md text-xs font-medium bg-[#245C56] hover:bg-[#1B4742] text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Grievance Ticket</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  );
};

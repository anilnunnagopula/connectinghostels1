import React, { useEffect } from "react";

const PartnerTerms = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
          ConnectingHostels Partner Terms & Conditions
        </h1>

        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          These Partner Terms & Conditions ("Terms") constitute a legally
          binding agreement between **ConnectingHostels** ("we," "us," or
          "our"), located in Hyderabad-501506, Telangana, India, and you, the
          hostel owner or authorized representative ("Partner," "you," or
          "your"), regarding your use of the ConnectingHostels platform and
          services (the "Service").
        </p>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          By registering, listing a hostel, or otherwise using the Service as a
          Partner, you acknowledge that you have read, understood, and agree to
          be bound by these Terms, our main{" "}
          <a
            href="/terms-conditions"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Terms & Conditions
          </a>
          ,{" "}
          <a
            href="/privacy-policy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Privacy Policy
          </a>
          ,{" "}
          <a
            href="/refund-policy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Refund & Cancellation Policy
          </a>
          , and{" "}
          <a
            href="/community-guidelines"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Community Guidelines
          </a>
          , which are all incorporated herein by reference. If you do not agree
          to these Terms, you may not use the Service as a Partner.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          1. Eligibility & Account Verification
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              1.1. Legal Authority:
            </strong>{" "}
            You must be the legal owner, authorized manager, or a duly appointed
            representative with full authority to list and manage the specified
            hostel(s) on behalf of the owner.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              1.2. Verification:
            </strong>{" "}
            You agree to provide all requested documentation for verification
            purposes, including but not limited to:
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Government-issued ID of the authorized representative.</li>
              <li>
                Proof of hostel ownership or management authority (e.g.,
                property deeds, rental agreement, business registration
                documents, trade license).
              </li>
              <li>
                Valid GSTIN (Goods and Services Tax Identification Number), if
                applicable.
              </li>
              <li>Bank account details for payment processing.</li>
            </ul>
            We reserve the right to conduct background checks and verify all
            provided information before approving your Partner account or
            publishing your listings. Failure to provide accurate and complete
            information may result in rejection or termination of your account.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          2. Listing Requirements & Accuracy
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          As a Partner, you are solely responsible for the accuracy and quality
          of your hostel listings.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              2.1. Accurate Information:
            </strong>{" "}
            All listings must contain complete and accurate details, including:
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Room types and capacities.</li>
              <li>
                Current and all-inclusive fees (including any hidden charges, if
                applicable, which must be clearly stated).
              </li>
              <li>Comprehensive list of amenities and services provided.</li>
              <li>Accurate address and location details.</li>
              <li>
                Clear house rules and specific terms for your hostel (e.g.,
                guest policy, entry/exit timings, noise rules).
              </li>
            </ul>
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              2.2. Photo Quality & Authenticity:
            </strong>
            Photos uploaded must accurately reflect the current condition of the
            property and its rooms. They should be high-quality, up-to-date, and
            not misleading. Use of stock photos or highly edited photos that do
            not represent reality is prohibited.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              2.3. Availability & Pricing:
            </strong>{" "}
            You must regularly update room availability and pricing to ensure it
            is always current. Inaccurate availability can lead to negative
            student experiences and potential penalties.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              2.4. Prohibited Content:
            </strong>{" "}
            Listings must not contain any unlawful, misleading, fraudulent,
            defamatory, obscene, or otherwise objectionable content.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              2.5. Compliance:
            </strong>{" "}
            Your hostel and its operation must comply with all applicable local,
            state, and national laws, regulations, and licensing requirements
            related to accommodation services, safety, health, and fire codes.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          3. Booking Management & Student Experience
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Providing a positive experience for students is paramount.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.1. Prompt Responses:
            </strong>{" "}
            You must endeavor to accept or reject booking requests within **24
            hours** of receipt. Delays may result in a poor student experience
            and may lead to penalties.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.2. Honoring Bookings:
            </strong>{" "}
            All confirmed bookings must be honored. In the event of unforeseen
            circumstances requiring cancellation by the hostel owner, you must
            notify the student immediately and adhere to our{" "}
            <a
              href="/refund-policy"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Refund & Cancellation Policy
            </a>
            , ensuring a full refund to the student.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.3. Check-in/Check-out:
            </strong>{" "}
            You are responsible for managing the check-in and check-out
            processes smoothly, including verification of student identity.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.4. Vacating Policy:
            </strong>{" "}
            You must adhere to the notice periods and refund policies for
            security deposits for students vacating rooms, as outlined in our
            **Refund & Cancellation Policy** and your own internal hostel rules,
            which must be clearly communicated to students. You are responsible
            for the prompt return of eligible security deposits to students.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.5. Communication:
            </strong>{" "}
            Maintain respectful and clear communication with students. Respond
            promptly to inquiries and address any issues fairly.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          4. Fees, Commissions & Payments
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Your financial obligations for using the ConnectingHostels platform.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.1. Service Fees/Commission:
            </strong>
            ConnectingHostels may charge a service fee or commission on
            confirmed bookings generated through our platform. The applicable
            fee structure will be communicated to you during the onboarding
            process or via your Partner dashboard.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.2. Payment Terms:
            </strong>{" "}
            Details regarding payment collection (e.g., advance deposits from
            students), payouts to you, invoicing, and reconciliation will be
            clearly outlined in your Partner Agreement or dashboard. You agree
            to provide accurate bank account details for timely payouts.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.3. Taxes:
            </strong>{" "}
            You are solely responsible for identifying and paying all applicable
            taxes, duties, levies, and surcharges associated with your hostel
            operations and earnings from bookings, including but not limited to
            GST (Goods and Services Tax) and income tax, in compliance with
            Indian tax laws.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.4. Third-Party Payment Processors:
            </strong>
            Payments processed through ConnectingHostels may use third-party
            payment gateways. You agree to abide by their terms of service.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          5. Data Protection & Privacy
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          You agree to handle student data obtained through the Service with
          utmost care and in compliance with privacy laws.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.1. Compliance:
            </strong>{" "}
            You must comply with all applicable data protection and privacy
            laws, including India's Digital Personal Data Protection Act, 2023
            (DPDP Act), regarding the collection, storage, processing, and use
            of student personal information.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.2. Restricted Use:
            </strong>{" "}
            Student personal data is provided solely for the purpose of managing
            bookings and providing accommodation services. You must not use this
            data for unsolicited marketing, sharing with third parties, or any
            other purpose not expressly permitted by ConnectingHostels or
            applicable law.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.3. Security:
            </strong>{" "}
            You must implement appropriate technical and organizational measures
            to protect student data from unauthorized access, disclosure,
            alteration, or destruction.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.4. Refer to Privacy Policy:
            </strong>
            For more details on data handling by ConnectingHostels, please refer
            to our comprehensive{" "}
            <a
              href="/privacy-policy"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Privacy Policy
            </a>
            .
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          6. Intellectual Property
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              6.1. Your Content:
            </strong>{" "}
            By submitting content (e.g., hostel descriptions, photos) to the
            Service, you grant ConnectingHostels a non-exclusive, worldwide,
            royalty-free, transferable, sublicensable license to use, reproduce,
            display, perform, and distribute your content in connection with the
            Service and ConnectingHostels's marketing activities.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              6.2. Our Intellectual Property:
            </strong>
            All intellectual property rights in the ConnectingHostels platform
            itself, including software, design, trademarks, and logos, belong to
            ConnectingHostels. You may not use these without our prior written
            consent.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          7. Indemnification
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          You agree to indemnify, defend, and hold harmless ConnectingHostels,
          its affiliates, officers, directors, employees, and agents from and
          against any and all claims, liabilities, damages, losses, and
          expenses, including reasonable attorneys' fees and costs, arising out
          of or in any way connected with: (a) your access to or use of the
          Service as a Partner; (b) your violation of these Partner Terms; (c)
          your violation of any third-party right, including without limitation
          any intellectual property right, publicity, confidentiality, property,
          or privacy right; (d) any dispute or issue between you and any
          student; or (e) your hostel's operation, services, safety, or
          compliance with laws.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          8. Limitation of Liability
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          To the maximum extent permitted by applicable law, in no event shall
          ConnectingHostels be liable for any indirect, incidental, special,
          consequential, or punitive damages, including without limitation, loss
          of profits, data, use, goodwill, or other intangible losses, resulting
          from (i) your access to or use of or inability to access or use the
          Service; (ii) any conduct or content of any third party on the
          Service, including without limitation, any defamatory, offensive, or
          illegal conduct of other users or third parties; (iii) any content
          obtained from the Service; and (iv) unauthorized access, use, or
          alteration of your transmissions or content, whether based on
          warranty, contract, tort (including negligence), or any other legal
          theory, whether or not we have been informed of the possibility of
          such damage.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          9. Suspension & Termination
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              9.1. By ConnectingHostels:
            </strong>{" "}
            We reserve the right, in our sole discretion, to suspend or
            terminate your Partner account and delist your hostel(s)
            immediately, with or without notice, if:
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                You violate these Partner Terms, our main Terms & Conditions, or
                any other policies.
              </li>
              <li>You provide false, inaccurate, or misleading information.</li>
              <li>
                You engage in fraudulent, illegal, or unethical activities.
              </li>
              <li>
                You receive repeated severe complaints from students or negative
                reviews.
              </li>
              <li>Required by law or government directive.</li>
            </ul>
            Upon termination, any outstanding fees or commissions owed to
            ConnectingHostels become immediately due and payable.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              9.2. By Partner:
            </strong>{" "}
            You may request the delisting of your hostel(s) or termination of
            your Partner account by providing written notice via email to us.
            All outstanding dues, if any, must be cleared before the full
            account closure is processed.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          10. Governing Law & Dispute Resolution
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          These Partner Terms shall be governed by and construed in accordance
          with the laws of India, specifically the laws of the State of
          Telangana, without regard to its conflict of law provisions.
        </p>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Any dispute, controversy, or claim arising out of or relating to these
          Partner Terms or the breach, termination, or invalidity thereof, shall
          be settled by arbitration in Mangalpalle, Telangana, India, in
          accordance with the provisions of the Arbitration and Conciliation
          Act, 1996, as amended. The language of the arbitration shall be
          English.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          11. Changes to These Partner Terms
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We reserve the right to modify or replace these Partner Terms at any
          time. If a revision is material, we will provide at least 30 days'
          notice prior to any new terms taking effect. What constitutes a
          material change will be determined at our sole discretion. By
          continuing to access or use our Service as a Partner after those
          revisions become effective, you agree to be bound by the revised
          terms. If you do not agree to the new terms, you must cease using the
          Service as a Partner.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          12. Contact Us
        </h2>
        <p className="mb-8 text-gray-700 dark:text-gray-300">
          For any questions about these Partner Terms, please contact us:
        </p>
        <p className="mb-2">
          <strong className="text-gray-900 dark:text-white">Email:</strong>{" "}
          <a
            href="mailto:anilnunnagopula15@gmail.com"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            anilnunnagopula15@gmail.com
          </a>
        </p>
        <p className="mb-8 text-gray-700 dark:text-gray-300">
          <strong className="text-gray-900 dark:text-white">Address:</strong>{" "}
          ConnectingHostels - Hyderabad-501506, Telangana, India
        </p>

        <p className="mt-12 text-sm text-gray-500 dark:text-gray-400 italic text-center">
          **Legal Disclaimer:** These Partner Terms & Conditions are provided as
          a general template for informational purposes only and do not
          constitute legal advice. It is highly recommended to consult with a
          qualified legal professional to draft a comprehensive and legally
          binding agreement tailored to your specific business operations,
          revenue model, and fully compliant with all applicable laws in India
          (including but not limited to contract law, consumer protection law,
          IT law, and data protection laws like the Digital Personal Data
          Protection Act, 2023).
        </p>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          Last updated: July 17, 2025
        </p>
      </div>
    </div>
  );
};

export default PartnerTerms;

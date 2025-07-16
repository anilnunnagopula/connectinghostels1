import React, { useEffect } from "react";

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
          ConnectingHostels Terms & Conditions
        </h1>

        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          Welcome to <strong>ConnectingHostels!</strong> These Terms and
          Conditions ("Terms") govern your access to and use of the
          ConnectingHostels website, mobile application, and related services
          (collectively, the "Service"). The Service is operated by [Your
          Company Name/Entity Name] ("we," "us," or "our"), located in
          Mangalpalle, Telangana, India.
        </p>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          By accessing or using the Service, you signify that you have read,
          understood, and agree to be bound by these Terms, our Privacy Policy,
          and any other guidelines, rules, or policies applicable to specific
          features of the Service, which are incorporated by reference. If you
          do not agree with any part of these Terms, you must not use the
          Service.
        </p>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          We reserve the right to modify or discontinue the Service (or any part
          thereof) with or without notice at any time. We also reserve the right
          to update or change these Terms at any time. Your continued use of the
          Service after any such changes constitutes your acceptance of the new
          Terms.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          1. Eligibility and User Accounts
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              1.1. Age Requirement:
            </strong>{" "}
            You must be at least 18 years old to create an account and use our
            Service. By using the Service, you represent and warrant that you
            are at least 18 years of age.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              1.2. Account Creation:
            </strong>{" "}
            To access certain features of the Service, you must register for an
            account. You agree to provide accurate, current, and complete
            information during the registration process and to update such
            information to keep it accurate, current, and complete.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              1.3. Account Security:
            </strong>{" "}
            You are responsible for safeguarding your password and for all
            activities that occur under your account. You agree to notify us
            immediately of any unauthorized use of your account. We are not
            liable for any loss or damage arising from your failure to maintain
            the confidentiality of your account information.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              1.4. User Roles:
            </strong>
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Students:</strong> May create profiles, browse hostel
                listings, submit booking inquiries/requests, communicate with
                hostel owners, and submit reviews and ratings.
              </li>
              <li>
                <strong>Hostel Owners:</strong> May create profiles, list their
                hostels and rooms, update availability and pricing, manage
                bookings, and communicate with students. Hostel owners are
                responsible for the accuracy and legality of their listings.
              </li>
            </ul>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          2. Listings, Bookings, and Payments
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              2.1. Hostel Listings:
            </strong>{" "}
            Hostel owners are solely responsible for all content they post,
            including but not limited to hostel descriptions, photos, pricing,
            availability, and house rules. All information must be accurate,
            truthful, and not misleading.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              2.2. Booking Process:
            </strong>
            ConnectingHostels acts as a platform to connect students with hostel
            owners. We do not own, operate, or manage any hostels. Any booking
            or agreement for accommodation is solely between the student and the
            hostel owner. ConnectingHostels is not a party to such agreements
            and is not responsible for the performance or non-performance of
            obligations by either party.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              2.3. Fees and Payments:
            </strong>
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                Hostel fees, deposits, and any other charges are determined by
                the hostel owner.
              </li>
              <li>
                If the Service facilitates payments (e.g., booking fees, advance
                payments), these will be processed through secure third-party
                payment gateways. We do not store full payment card details on
                our servers.
              </li>
              <li>
                You agree to abide by the terms and conditions of the respective
                payment gateway provider. We are not responsible for any delays,
                errors, or failed transactions occurring on the payment gateway.
              </li>
              <li>
                <strong>ConnectingHostels Service Fees:</strong> We may charge a
                service fee to either students or hostel owners for the use of
                our platform. Such fees, if any, will be clearly disclosed at
                the time of transaction.
              </li>
            </ul>
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              2.4. Cancellations and Refunds:
            </strong>
            Cancellation and refund policies for hostel bookings are determined
            by individual hostel owners. ConnectingHostels is not responsible
            for managing refunds related to hostel bookings unless explicitly
            stated otherwise. Our platform may facilitate communication
            regarding cancellations, but the final decision and refund
            processing rests with the hostel owner. Any service fees paid to
            ConnectingHostels may be non-refundable, as per our separate Refund
            Policy (link provided below).
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              2.5. Vacating Hostels:
            </strong>
            Students are responsible for adhering to the vacate policies of the
            respective hostel owners. Our platform provides tools for hostel
            owners to update vacancy status, but we do not manage the physical
            vacating process.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          3. User Responsibilities and Prohibited Conduct
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.1. Accuracy:
            </strong>{" "}
            All users must provide accurate and truthful information. Hostel
            owners must ensure their listings accurately reflect the hostel, its
            amenities, availability, and pricing. Students must provide accurate
            personal information and booking details.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.2. Lawful Use:
            </strong>{" "}
            You agree to use the Service only for lawful purposes and in a
            manner that does not infringe the rights of, restrict, or inhibit
            anyone else's use and enjoyment of the Service.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.3. Prohibited Conduct:
            </strong>{" "}
            You agree not to:
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                Post misleading, false, fraudulent, or inaccurate information.
              </li>
              <li>
                Engage in any form of spamming, phishing, or unsolicited
                commercial communications.
              </li>
              <li>
                Upload or transmit any harmful code, viruses, or disruptive
                files.
              </li>
              <li>
                Harass, abuse, defame, or otherwise violate the legal rights of
                others.
              </li>
              <li>
                Attempt to gain unauthorized access to our systems or other
                users' accounts.
              </li>
              <li>Impersonate any person or entity.</li>
              <li>Use the Service for any illegal or unauthorized purpose.</li>
            </ul>
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.4. Communication:
            </strong>{" "}
            Maintain respectful and professional communication with other users
            on the platform. Any abusive, offensive, or derogatory language is
            strictly prohibited.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          4. Content and Intellectual Property
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.1. Your Content:
            </strong>{" "}
            You retain all rights in, and are solely responsible for, the
            content you submit, post, or display on or through the Service
            ("User Content"). By submitting User Content, you grant
            ConnectingHostels a worldwide, non-exclusive, royalty-free,
            transferable license to use, reproduce, distribute, prepare
            derivative works of, display, and perform the User Content in
            connection with the Service and ConnectingHostels's (and its
            successors' and affiliates') business, including without limitation
            for promoting and redistributing part or all of the Service (and
            derivative works thereof) in any media formats and through any media
            channels.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.2. Our Content:
            </strong>{" "}
            All content and materials available on the Service, including but
            not limited to text, graphics, logos, images, software, and the
            compilation thereof (excluding User Content), are the property of
            ConnectingHostels or its licensors and are protected by copyright,
            trademark, and other intellectual property laws.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          5. Disclaimers and Limitation of Liability
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.1. No Endorsement:
            </strong>
            ConnectingHostels does not endorse any specific hostel, student, or
            any User Content. Any references to a hostel's "verification" mean
            only that the owner has completed our registration process, not that
            the hostel meets any particular quality standards or that we endorse
            its services.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.2. "As Is" Basis:
            </strong>{" "}
            The Service is provided "as is" and "as available" without any
            warranties of any kind, either express or implied. ConnectingHostels
            does not warrant that the Service will be uninterrupted, secure, or
            error-free.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.3. No Liability for User Conduct:
            </strong>
            ConnectingHostels is not responsible for the conduct, whether online
            or offline, of any user of the Service. You acknowledge and agree
            that you are solely responsible for your interactions with other
            users.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.4. Limitation of Liability:
            </strong>
            To the maximum extent permitted by applicable law, ConnectingHostels
            shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, including without limitation,
            loss of profits, data, use, goodwill, or other intangible losses,
            resulting from (i) your access to or use of or inability to access
            or use the Service; (ii) any conduct or content of any third party
            on the Service; (iii) any content obtained from the Service; and
            (iv) unauthorized access, use, or alteration of your transmissions
            or content, whether based on warranty, contract, tort (including
            negligence), or any other legal theory, whether or not we have been
            informed of the possibility of such damage.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          6. Account Suspension and Termination
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We may, in our sole discretion, suspend or terminate your account and
          refuse any and all current or future use of the Service for any
          reason, including, without limitation, if we believe that you have
          violated these Terms or engaged in fraudulent or illegal activities.
          Upon termination, your right to use the Service will immediately
          cease.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          7. Governing Law and Dispute Resolution
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          These Terms shall be governed and construed in accordance with the
          laws of India, specifically the laws of the State of Telangana,
          without regard to its conflict of law provisions.
        </p>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Any dispute arising out of or in connection with these Terms,
          including any question regarding its existence, validity, or
          termination, shall be referred to and finally resolved by arbitration
          in Mangalpalle, Telangana, India, in accordance with the provisions of
          the Arbitration and Conciliation Act, 1996, as amended. The language
          of the arbitration shall be English.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          8. Links to Other Websites
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Our Service may contain links to third-party websites or services that
          are not owned or controlled by ConnectingHostels. We have no control
          over and assume no responsibility for the content, privacy policies,
          or practices of any third-party websites or services. We strongly
          advise you to read the terms and conditions and privacy policies of
          any third-party websites or services that you visit.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          9. Changes to These Terms
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. If a revision is material, we will provide at
          least 30 days' notice prior to any new terms taking effect. What
          constitutes a material change will be determined at our sole
          discretion. By continuing to access or use our Service after those
          revisions become effective, you agree to be bound by the revised
          terms. If you do not agree to the new terms, please stop using the
          Service.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          10. Contact Us
        </h2>
        <p className="mb-8 text-gray-700 dark:text-gray-300">
          If you have any questions about these Terms, please contact us:
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
          ConnectingHostels - Hyderbad-501506, Telanagana, India
        </p>

        <p className="mt-12 text-sm text-gray-500 dark:text-gray-400 italic text-center">
          <strong>Legal Disclaimer:</strong> These Terms and Conditions are
          provided as a general template and may not be exhaustive or compliant
          with all local, national, and international laws applicable to your
          business. It is crucial to consult with a legal professional to draft
          a Terms and Conditions agreement that is tailored to your specific
          operations, business model, and the jurisdictions in which you
          operate, particularly regarding consumer protection, data privacy,
          e-commerce, and contractual laws.
        </p>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          Last updated: July , 2025
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;

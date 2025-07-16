import React, { useEffect } from "react";

const DataProtection = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
          ConnectingHostels Data Protection Policy
        </h1>

        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          At <strong>ConnectingHostels</strong>, we are deeply committed to
          safeguarding the privacy and personal data of all our users – both
          students and hostel owners. This Data Protection Policy ("Policy")
          outlines our practices concerning the collection, processing, storage,
          and sharing of personal data, in strict adherence to{" "}
          <strong>
            India's Digital Personal Data Protection (DPDP) Act, 2023
          </strong>
          , and global best practices for data privacy.
        </p>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          By using our Service, you agree to the terms of this Policy. This
          Policy is incorporated into and forms part of our{" "}
          <a
            href="/privacy-policy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Privacy Policy
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          1. What is Personal Data?
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          As per the DPDP Act, "personal data" means any data about an
          individual who is identifiable by or in relation to such data. This
          includes, but is not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Identification Information:
            </strong>
            Name, email address, phone number, date of birth, gender, profile
            picture.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Government IDs (if provided):
            </strong>
            Aadhaar number, PAN card, Passport, or other identity proofs for
            verification purposes (handled with utmost sensitivity).
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Location Data:
            </strong>{" "}
            Geolocation information when you enable location services for hostel
            suggestions.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Hostel Preferences & Booking History:
            </strong>
            Your search filters, preferred amenities, booking dates, and past
            hostel stays.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Hostel Owner Data:
            </strong>{" "}
            Hostel name, address, business registration details, bank account
            information, GSTIN, photos of the property, pricing.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Communication Data:
            </strong>{" "}
            Records of your interactions with our support team, and messages
            exchanged with other users on the platform.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Technical Data:
            </strong>{" "}
            IP address, device information, browser type, operating system, and
            usage data (e.g., pages visited, features used).
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          2. Principles of Data Processing
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Our data processing activities are governed by the following
          principles in accordance with the DPDP Act, 2023:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Lawful and Fair:
            </strong>{" "}
            We process personal data only for a lawful purpose and in a manner
            that is fair to the Data Principal (the individual whose data is
            being processed).
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Purpose Limitation:
            </strong>{" "}
            Data is collected only for specified, explicit, and legitimate
            purposes and not further processed in a manner that is incompatible
            with those purposes.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Data Minimization:
            </strong>{" "}
            We collect only personal data that is adequate, relevant, and
            limited to what is necessary in relation to the purposes for which
            they are processed.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Accuracy:
            </strong>{" "}
            We take reasonable steps to ensure that personal data is accurate
            and kept up to date where necessary.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Storage Limitation:
            </strong>{" "}
            Personal data is kept in a form which permits identification of Data
            Principals for no longer than is necessary for the purposes for
            which the personal data are processed.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Integrity & Confidentiality:
            </strong>
            We implement appropriate technical and organizational measures to
            ensure the security of personal data, including protection against
            unauthorized or unlawful processing and against accidental loss,
            destruction, or damage.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          3. How We Collect Data & Consent
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We collect personal data through various means, primarily with your
          explicit consent:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.1. Direct Collection:
            </strong>
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                When you register and create an account as a student or hostel
                owner.
              </li>
              <li>When you complete your profile information.</li>
              <li>When you submit a booking request or accept a booking.</li>
              <li>
                When you communicate with us (e.g., via email, chat, support
                tickets).
              </li>
              <li>
                When you upload photos or content to your listings/profile.
              </li>
              <li>When you submit reviews or feedback.</li>
              <li>When you participate in surveys or promotions.</li>
            </ul>
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.2. Automated Collection:
            </strong>
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                Device and usage data (IP address, browser type, operating
                system) via cookies and similar technologies (please refer to
                our{" "}
                <a
                  href="/cookie-policy"
                  className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                >
                  Cookie Policy
                </a>
                ).
              </li>
              <li>
                Location data, if you enable location services on your device
                for features like nearby hostel suggestions.
              </li>
            </ul>
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.3. Consent:
            </strong>{" "}
            We obtain your consent before collecting and processing your
            personal data, especially for purposes that are not strictly
            necessary for the provision of the Service. You provide consent by:
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                Ticking an "I agree" box during registration or a specific
                feature activation.
              </li>
              <li>
                Continuing to use our services after being presented with a
                clear privacy notice.
              </li>
            </ul>
            You have the right to withdraw your consent at any time for future
            processing (see Section 5).
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          4. How We Use Your Data
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We use your personal data strictly for the purposes for which it was
          collected, including:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.1. Service Provision:
            </strong>{" "}
            To facilitate hostel bookings, enable communication between students
            and hostel owners, manage accounts, and provide customer support.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.2. Personalization:
            </strong>{" "}
            To customize your experience, show relevant hostel listings and
            offers based on your preferences, search history, and location.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.3. Verification & Security:
            </strong>{" "}
            To verify user identities, prevent fraud, ensure platform security,
            and comply with legal obligations (e.g., KYC norms if applicable for
            payment processing).
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.4. Communication:
            </strong>{" "}
            To send you essential service-related notifications, booking
            updates, account alerts, and, with your consent, marketing or
            promotional communications.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.5. Analytics & Improvement:
            </strong>{" "}
            To analyze user behavior, understand platform usage patterns,
            improve our Service's functionality and user experience, and
            troubleshoot issues.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.6. Legal Compliance:
            </strong>{" "}
            To comply with applicable laws, regulations, and legal processes.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          5. Data Principal Rights (Your Rights)
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Under the DPDP Act, 2023, you, as a Data Principal, have significant
          rights concerning your personal data:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.1. Right to Access Information:
            </strong>
            You have the right to obtain confirmation from us as to whether or
            not personal data concerning you is being processed, and where that
            is the case, access to the personal data and certain information
            about its processing.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.2. Right to Correction and Erasure:
            </strong>
            You can request the correction of inaccurate or incomplete personal
            data and the erasure of your personal data where it is no longer
            necessary for the purpose for which it was collected, or you
            withdraw consent.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.3. Right of Grievance Redressal:
            </strong>
            You have the right to a readily available means of grievance
            redressal in respect of any act or omission by us regarding the
            performance of our obligations in relation to your personal data.
            (See Section 8).
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.4. Right to Nominate:
            </strong>{" "}
            You have the right to nominate any other individual who shall
            exercise your rights under the DPDP Act in the event of your death
            or incapacity.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.5. Right to Withdraw Consent:
            </strong>
            You have the right to withdraw your consent to process your personal
            data at any time. This will not affect the lawfulness of processing
            based on consent before its withdrawal.
          </li>
        </ul>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          To exercise any of these rights, please contact our Data Protection
          Officer (Grievance Officer) as detailed in Section 8. We will respond
          to your request in accordance with the DPDP Act and other applicable
          laws.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          6. Data Disclosure & Sharing
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We treat your personal data with utmost confidentiality. We do
          <strong> not </strong> sell your personal data. We only disclose or
          share it under specific circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              6.1. With Your Consent:
            </strong>{" "}
            For instance, when a student initiates a booking, necessary contact
            and booking details are shared with the relevant hostel owner to
            facilitate the stay. Conversely, hostel owners' public listing
            information is shared with students.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              6.2. To Third-Party Service Providers:
            </strong>
            We engage trusted third-party service providers (Data Processors) to
            perform functions on our behalf and help us operate our Service.
            These include:
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Cloud Hosting:</strong> Google Cloud Platform (Firebase
                for Auth, Firestore, Storage).
              </li>
              <li>
                <strong>Analytics:</strong> Google Analytics for understanding
                user behavior.
              </li>
              <li>
                <strong>Payment Processors:</strong> Secure gateways for
                handling transactions.
              </li>
              <li>
                <strong>Communication Services:</strong> For sending OTPs,
                emails, and notifications.
              </li>
              <li>
                <strong>Mapping Services:</strong> Google Maps APIs for
                location-based features.
              </li>
            </ul>
            These providers are contractually bound to protect your data and
            only process it according to our instructions and applicable data
            protection laws.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              6.3. Legal & Regulatory Compliance:
            </strong>
            When legally required, or in response to valid requests by public
            authorities (e.g., a court order or government directive).
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              6.4. Business Transfers:
            </strong>{" "}
            In connection with, or during negotiations of, any merger, sale of
            company assets, financing, or acquisition of all or a portion of our
            business by another company.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          7. Data Security & Retention
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              7.1. Security Measures:
            </strong>{" "}
            We implement robust technical and organizational security measures
            to protect your personal data from unauthorized access, alteration,
            disclosure, or destruction. This includes:
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                Encryption of data in transit and at rest (where feasible).
              </li>
              <li>Access controls and authentication mechanisms.</li>
              <li>Regular security audits and vulnerability assessments.</li>
              <li>Employee training on data protection best practices.</li>
            </ul>
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              7.2. Data Hosting:
            </strong>{" "}
            Your data is primarily hosted on secure cloud infrastructure
            provided by Google Cloud Platform, which adheres to high security
            standards. While data may be processed on servers located outside
            India by our third-party service providers (e.g., for global content
            delivery networks), we ensure appropriate safeguards are in place
            for cross-border data transfers in compliance with the DPDP Act.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              7.3. Data Retention:
            </strong>{" "}
            We retain your personal data only for as long as necessary to
            fulfill the purposes for which it was collected, including for
            legal, accounting, or reporting requirements. Once data is no longer
            required, it is securely deleted or anonymized.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          8. Grievance Redressal & Data Protection Officer
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          In accordance with the DPDP Act, we have appointed a Grievance Officer
          to address any concerns or requests regarding your personal data.
        </p>
        <p className="mb-8 text-gray-700 dark:text-gray-300">
          If you have any questions, concerns, or wish to exercise your rights
          under this Policy or the DPDP Act, please contact our Grievance
          Officer:
        </p>
        <p className="mb-2">
          <strong className="text-gray-900 dark:text-white">
            Grievance Officer:
          </strong>{" "}
          [Name of Grievance Officer - Placeholder]
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
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We will endeavor to resolve your concerns in a timely and effective
          manner, as stipulated by the DPDP Act.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          9. Children's Data
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Our Service is not directed to individuals under the age of 18. We do
          not knowingly collect personal data from children. If we become aware
          that we have collected personal data from a child without parental
          consent, we will take steps to delete that information as quickly as
          possible.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          10. Changes to This Data Protection Policy
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We may update this Data Protection Policy from time to time to reflect
          changes in our practices or legal requirements. We will notify you of
          any material changes by posting the new Policy on this page and
          updating the "Last updated" date. We encourage you to review this
          Policy periodically.
        </p>

        <p className="mt-12 text-sm text-gray-500 dark:text-gray-400 italic text-center">
          **Legal Disclaimer:** This Data Protection Policy is provided as a
          template for informational purposes only. Given the specifics of the
          Digital Personal Data Protection Act, 2023, and other applicable laws,
          it is absolutely essential to consult with a qualified legal
          professional to ensure your policy fully complies with all legal
          requirements, including the establishment of a robust consent
          mechanism, data breach notification protocols, and appropriate data
          transfer agreements if applicable. This document does not constitute
          legal advice.
        </p>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          Last updated: July 17, 2025
        </p>
      </div>
    </div>
  );
};

export default DataProtection;

// src/components/PrivacyPolicy.jsx
import React, { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    // Changed base background to a lighter color for light mode,
    // and kept dark mode styles with 'dark:' prefix.
    // The outer div in App.jsx should handle the overall page background.
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl  p-8 mt-10 md:p-12 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
        ConnectingHostels Privacy Policy
      </h1>

      <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        At <strong>ConnectingHostels</strong>, we are deeply committed to
        protecting your privacy and personal data. This Privacy Policy explains
        in detail how we collect, use, process, store, and disclose information
        that we obtain through our real-time application and services, whether
        you are a student seeking accommodation or a hostel owner listing
        properties. By using our services, you agree to the terms outlined in
        this policy.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        1. Information We Collect
      </h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        We collect various types of information to provide and improve our
        services. This includes:
      </p>
      <ul className="list-disc pl-6 space-y-3 mb-6">
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            1.1. Student Information:
          </strong>
          <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Personal Identifiers:</strong> Full Name, Email Address,
              Mobile Number.
            </li>
            <li>
              <strong>Demographic Data:</strong> Preferred Hostel Type (e.g.,
              Boys/Girls, Co-ed), Locality/City of interest, Budget range.
            </li>
            <li>
              <strong>Academic Information:</strong> (Optional) Institution
              Name, Course of Study, for specific hostel programs or discounts.
            </li>
            <li>
              <strong>Payment Information:</strong> (If applicable for booking
              facilitation) Partial payment details (e.g., last 4 digits of
              card, payment gateway transaction IDs). Full payment details are
              processed securely by third-party payment processors and are not
              stored on our servers.
            </li>
            <li>
              <strong>Communication Data:</strong> Records of your
              correspondence with us and with hostel owners through our
              platform.
            </li>
          </ul>
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            1.2. Hostel Owner Information:
          </strong>
          <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Personal Identifiers:</strong> Name of Owner/Manager,
              Contact Email, Mobile Number.
            </li>
            <li>
              <strong>Business Information:</strong> Hostel Name, Full Address
              (including precise location coordinates), Room Listings (types,
              capacity, availability), Pricing details (per room, per bed, per
              month/year), Amenities and Facilities offered, Photos/Videos of
              the hostel.
            </li>
            <li>
              <strong>Financial Information:</strong> Bank account details for
              receiving payments (if we facilitate direct payments), GSTIN/Tax
              IDs (if applicable).
            </li>
            <li>
              <strong>Verification Documents:</strong> Business registration
              documents, identity proof for verification purposes.
            </li>
            <li>
              <strong>Operational Data:</strong> Vacancy status,
              check-in/check-out policies, house rules, real-time availability
              updates.
            </li>
          </ul>
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            1.3. Automatically Collected Information:
          </strong>
          <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Location Data:</strong> With your explicit consent, we may
              access your device's GPS data, IP address, or Wi-Fi hotspots to
              provide location-based services (e.g., finding nearby hostels).
              You can enable or disable this at any time through your device
              settings.
            </li>
            <li>
              <strong>Device and Usage Information:</strong> We collect data
              about how you access and use our services, including browser type,
              operating system, device identifiers, referring/exit pages,
              clicks, page views, and timestamps. This helps us understand user
              behavior and improve app performance.
            </li>
            <li>
              <strong>Log Data:</strong> Server logs may include your IP
              address, access times, and the pages you viewed before and after
              navigating to our service.
            </li>
            <li>
              <strong>Cookies and Tracking Technologies:</strong> We use cookies
              and similar technologies (e.g., web beacons, pixels) to enhance
              your experience, remember your preferences, and analyze usage
              patterns. More details in Section 6.
            </li>
          </ul>
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        2. How We Use Your Data
      </h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Your information is primarily used to provide, maintain, and improve
        ConnectingHostels. Specific uses include:
      </p>
      <ul className="list-disc pl-6 space-y-3 mb-6">
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Service Provision:
          </strong>{" "}
          To match students with suitable hostels based on their preferences,
          filters, and location. To enable hostel owners to list and manage
          their properties.
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Communication:
          </strong>{" "}
          To facilitate communication between students and hostel owners. To
          send you notifications about bookings, availability, offers, updates,
          and important service announcements.
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Personalization:
          </strong>{" "}
          To customize your experience, such as showing relevant hostels,
          tailored recommendations, and targeted advertisements (where
          applicable).
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Security and Verification:
          </strong>{" "}
          To verify identities, prevent fraud, enforce our terms of service, and
          maintain the security of our platform.
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Analytics and Improvement:
          </strong>{" "}
          To understand how users interact with our platform, troubleshoot
          issues, perform data analysis, research, and improve our services'
          functionality and user experience.
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Customer Support:
          </strong>{" "}
          To respond to your inquiries, provide technical support, and resolve
          issues.
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Legal Compliance:
          </strong>{" "}
          To comply with applicable laws, regulations, legal processes, or
          governmental requests.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        3. How We Share and Disclose Your Data
      </h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        We are committed to maintaining your trust, and we do{" "}
        <strong className="text-red-600 dark:text-red-400">NOT</strong> sell
        your personal data to third parties. We only share and disclose your
        information in limited circumstances:
      </p>
      <ul className="list-disc pl-6 space-y-3 mb-6">
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            With Hostel Owners/Students:
          </strong>{" "}
          When a student expresses genuine interest or intent to book a hostel,
          we share relevant student contact information (name, email, phone)
          with the respective verified hostel owner. Similarly, when a hostel
          owner lists a property, their contact information and hostel details
          are visible to students. This is essential for facilitating
          connections and bookings.
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Service Providers:
          </strong>{" "}
          We may engage trusted third-party companies and individuals to perform
          services on our behalf, such as payment processing, analytics, cloud
          hosting, marketing, and customer support. These third parties have
          access to your information only to perform these tasks on our behalf
          and are obligated not to disclose or use it for any other purpose.
          Examples include map/location APIs (e.g., Google Maps), email service
          providers.
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Legal Requirements:
          </strong>{" "}
          We may disclose your information if required to do so by law or in the
          good faith belief that such action is necessary to (i) comply with a
          legal obligation, (ii) protect and defend the rights or property of
          ConnectingHostels, (iii) act in urgent circumstances to protect the
          personal safety of users of the service or the public, or (iv) protect
          against legal liability.
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Business Transfers:
          </strong>{" "}
          In connection with any merger, sale of company assets, financing, or
          acquisition of all or a portion of our business to another company,
          your information may be transferred.
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            With Your Consent:
          </strong>{" "}
          We may share your information for any other purpose with your explicit
          consent.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        4. Data Retention
      </h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        We retain your personal information only for as long as necessary to
        fulfill the purposes for which it was collected, including for the
        purposes of satisfying any legal, accounting, or reporting requirements.
      </p>
      <ul className="list-disc pl-6 space-y-3 mb-6">
        <li>
          If you are a student, your profile data is retained as long as your
          account is active.
        </li>
        <li>
          If you are a hostel owner, your property listings and related data are
          retained as long as your account is active and your listings are live.
        </li>
        <li>
          We may retain certain information for a longer period if required by
          law or for legitimate business purposes (e.g., resolving disputes,
          enforcing our agreements).
        </li>
        <li>
          Upon deletion of your account, we will endeavor to delete your
          personal data, subject to any legal obligations or legitimate
          interests for retaining certain information (e.g., anonymized data for
          analytics).
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        5. Data Security
      </h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        We implement robust security measures designed to protect your personal
        data from unauthorized access, alteration, disclosure, or destruction.
        These measures include:
      </p>
      <ul className="list-disc pl-6 space-y-3 mb-6">
        <li>
          <strong>Encryption:</strong> Data is encrypted both in transit (e.g.,
          using SSL/TLS) and at rest (where feasible).
        </li>
        <li>
          <strong>Access Controls:</strong> Strict access controls are in place,
          limiting access to personal data only to employees, agents, and
          service providers who need to know that information to process it for
          us, and who are subject to strict contractual confidentiality
          obligations.
        </li>
        <li>
          <strong>Regular Audits:</strong> We regularly review our information
          collection, storage, and processing practices, including physical
          security measures.
        </li>
        <li>
          <strong>Firewalls and Intrusion Detection:</strong> Our systems are
          protected by firewalls and intrusion detection systems to prevent
          unauthorized access.
        </li>
        <li>
          While we strive to use commercially acceptable means to protect your
          Personal Data, no method of transmission over the Internet or method
          of electronic storage is 100% secure. Therefore, we cannot guarantee
          its absolute security.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        6. Cookies and Tracking Technologies
      </h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        We use cookies and similar tracking technologies to track the activity
        on our service and hold certain information. Cookies are files with a
        small amount of data that are sent to your browser from a website and
        stored on your device.
      </p>
      <ul className="list-disc pl-6 space-y-3 mb-6">
        <li>
          <strong>Essential Cookies:</strong> Necessary for the website to
          function and cannot be switched off in our systems. They are usually
          only set in response to actions made by you, which amount to a request
          for services (e.g., logging in, filling out forms).
        </li>
        <li>
          <strong>Analytical/Performance Cookies:</strong> Allow us to count
          visits and traffic sources so we can measure and improve the
          performance of our site. They help us to know which pages are the most
          and least popular and see how visitors move around the site.
        </li>
        <li>
          <strong>Functionality Cookies:</strong> Used to recognize you when you
          return to our website. This enables us to personalize our content for
          you, greet you by name, and remember your preferences (for example,
          your choice of language or region).
        </li>
        <li>
          You can instruct your browser to refuse all cookies or to indicate
          when a cookie is being sent. However, if you do not accept cookies,
          you may not be able to use some portions of our Service.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        7. Your Data Rights
      </h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        You have significant rights regarding your personal data. We are
        committed to enabling you to exercise these rights:
      </p>
      <ul className="list-disc pl-6 space-y-3 mb-6">
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Right to Access:
          </strong>{" "}
          You have the right to request copies of your personal data we hold.
          (Functionality to download your stored data is under development and
          will be available soon in your profile settings).
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Right to Rectification:
          </strong>{" "}
          You have the right to request that we correct any information you
          believe is inaccurate or incomplete. You can usually edit or update
          your profile information directly within your account settings.
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Right to Erasure (Deletion):
          </strong>{" "}
          You have the right to request the deletion of your personal data under
          certain conditions. Please contact us to initiate this process.
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Right to Restrict Processing:
          </strong>{" "}
          You have the right to request that we restrict the processing of your
          personal data under certain conditions.
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Right to Object to Processing:
          </strong>{" "}
          You have the right to object to our processing of your personal data
          under certain conditions.
        </li>
        <li>
          <strong className="text-blue-600 dark:text-blue-400">
            Right to Data Portability:
          </strong>{" "}
          You have the right to request that we transfer the data that we have
          collected to another organization, or directly to you, under certain
          conditions.
        </li>
        <li>
          To exercise any of these rights, please contact us using the details
          provided in Section 10. We will respond to your request within a
          reasonable timeframe, typically within 30 days.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        8. Children's Privacy
      </h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Our services are not intended for individuals under the age of 18
        ("Children"). We do not knowingly collect personally identifiable
        information from anyone under the age of 18. If you are a parent or
        guardian and you are aware that your Children have provided us with
        Personal Data, please contact us. If we become aware that we have
        collected Personal Data from children without verification of parental
        consent, we take steps to remove that information from our servers.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        9. Third-Party Links
      </h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Our service may contain links to other sites that are not operated by
        us. If you click on a third-party link, you will be directed to that
        third party's site. We strongly advise you to review the Privacy Policy
        of every site you visit. We have no control over and assume no
        responsibility for the content, privacy policies, or practices of any
        third-party sites or services.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        10. Changes to This Privacy Policy
      </h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        We may update our Privacy Policy from time to time to reflect changes in
        our practices or for other operational, legal, or regulatory reasons. We
        will notify you of any changes by posting the new Privacy Policy on this
        page and updating the "Last updated" date. We will also inform you via
        email or a prominent notice on our service prior to the change becoming
        effective, if the changes are material. You are advised to review this
        Privacy Policy periodically for any changes.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        11. Contact Us
      </h2>
      <p className="mb-8 text-gray-700 dark:text-gray-300">
        If you have any questions or concerns about this Privacy Policy or our
        data practices, please do not hesitate to contact us:
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
        <strong>Important Note:</strong> This Privacy Policy is for
        informational purposes and outlines our general practices. It should not
        be considered legal advice. We recommend consulting with a legal
        professional to ensure full compliance with all applicable privacy laws
        and regulations (e.g., GDPR, CCPA, Indian IT Act, etc.) relevant to your
        specific operations and target regions.
      </p>

      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        Last updated: July, 2025
      </p>
    </div>
  );
};

export default PrivacyPolicy;

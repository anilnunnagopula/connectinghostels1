import React, { useEffect } from "react";

const CommunityGuidelines = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
          ConnectingHostels Community Guidelines
        </h1>

        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          Welcome to the <strong>ConnectingHostels</strong> community! These
          guidelines are designed to foster a safe, respectful, and productive
          environment for all users, including students seeking accommodation
          and hostel owners listing properties. By using our platform, you agree
          to adhere to these guidelines, along with our{" "}
          <a
            href="/terms-conditions"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href="/privacy-policy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Privacy Policy
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          1. Respect Everyone 🫶
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Our community thrives on mutual respect. Treat others as you would
          like to be treated.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              No Hate Speech, Harassment, or Bullying:
            </strong>
            Do not post content or send messages that promote hatred,
            discrimination, or violence based on race, ethnicity, religion,
            gender, sexual orientation, disability, or any other characteristic.
            Bullying, intimidation, or persistent harassment of other users or
            staff is strictly prohibited.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Respect Privacy:
            </strong>{" "}
            Do not share personal information of others (including contact
            details, photos, or private conversations) without their explicit
            consent.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Inclusive and Kind Language:
            </strong>{" "}
            Use language that is welcoming and respectful in all your
            interactions, whether in messages, reviews, or other public postings
            on the platform. Avoid profanity, offensive jokes, or derogatory
            terms.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Professionalism:
            </strong>{" "}
            Maintain a professional demeanor, especially in communications
            related to bookings and hostel management.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          2. Keep It Real 🧾 (Accuracy and Authenticity)
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Trust is the foundation of our community. All information shared must
          be honest and accurate.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Accurate Listings:
            </strong>{" "}
            Hostel owners must ensure all information in their listings (photos,
            descriptions, amenities, pricing, availability, rules) is current,
            accurate, and not misleading. Misrepresentation will not be
            tolerated.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Honest Reviews and Feedback:
            </strong>
            Students should provide truthful and constructive reviews based on
            their genuine experience. Do not post spam, fake reviews, or use the
            review system for personal attacks or blackmail.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Genuine Intent:
            </strong>{" "}
            Students should only send booking inquiries or requests with a
            genuine intent to find accommodation. Hostel owners should respond
            to inquiries truthfully regarding availability and terms.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Identity:
            </strong>{" "}
            Do not impersonate any person or entity. Your profile information
            should accurately represent who you are.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          3. Use the Platform Responsibly ⚖️
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Help us maintain the integrity and security of our Service.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              No Spam or Unsolicited Offers:
            </strong>
            Do not post duplicate, irrelevant, or excessive listings. Do not
            send unsolicited advertisements, promotional materials, or spam
            messages to other users. Misusing contact information obtained
            through the platform for marketing or other non-platform related
            purposes is strictly forbidden.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              No Malicious Activity:
            </strong>{" "}
            Do not upload or transmit any malicious code, viruses, or engage in
            any activity that could harm our platform, users' devices, or data.
            Exploiting bugs, using automated scripts, or attempting unauthorized
            access to our systems is strictly prohibited.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Respect Intellectual Property:
            </strong>
            Do not upload or share content that infringes on the copyrights,
            trademarks, or other intellectual property rights of others.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Follow Laws:
            </strong>{" "}
            Ensure your use of the platform complies with all applicable local,
            national, and international laws and regulations.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          4. Reporting & Moderation 🚨
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We rely on our community to help us maintain a positive environment.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Report Violations:
            </strong>{" "}
            If you encounter any content or behavior that violates these
            guidelines, please report it immediately via our{" "}
            <a
              href="/support"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Support page
            </a>{" "}
            or the reporting tools available on the platform. Provide as much
            detail as possible to help us investigate.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Our Action:
            </strong>{" "}
            We review all reports and take appropriate action, which may include
            removing content, issuing warnings, temporary suspension of
            accounts, or permanent bans.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              No Retaliation:
            </strong>{" "}
            Do not retaliate against users who report your content or behavior.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          5. Consequences of Violations
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Violations of these Community Guidelines can lead to various actions:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            **Content Removal:** Inappropriate or violating content may be
            removed without prior notice.
          </li>
          <li>**Warnings:** For minor offenses, a warning may be issued.</li>
          <li>
            **Temporary Suspension:** Your account access may be temporarily
            restricted.
          </li>
          <li>
            **Permanent Ban:** Severe or repeat violations (e.g., hate speech,
            fraudulent activity, harassment) will result in immediate and
            permanent termination of your account, without a refund of any
            service fees.
          </li>
          <li>
            **Legal Action:** In cases of illegal activity, we may report users
            to relevant law enforcement authorities.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          6. Feedback Welcome 💬
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We are committed to continuously improving our community and platform.
          Your feedback is valuable.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          If you have suggestions, questions about these guidelines, or
          encounter any issues, please email us at{" "}
          <a
            href="mailto:anilnunnagopula15@gmail.com"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            anilnunnagopula15@gmail.com
          </a>
          .
        </p>
        <p className="mb-8 text-gray-700 dark:text-gray-300">
          <strong className="text-gray-900 dark:text-white">Address:</strong>{" "}
          ConnectingHostels - Hyderabad-501506, Telangana, India
        </p>

        <p className="mt-12 text-sm text-gray-500 dark:text-gray-400 italic text-center">
          These Community Guidelines are an integral part of our commitment to
          user safety and platform integrity. We reserve the right to update or
          modify them at any time.
        </p>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          Last updated: July , 2025
        </p>
      </div>
    </div>
  );
};

export default CommunityGuidelines;

import React, { useEffect } from "react";

const Transparency = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
          Transparency Statement for ConnectingHostels
        </h1>

        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          At <strong>ConnectingHostels</strong>, we believe that a strong
          community is built on trust, and trust is fostered through clear and
          open communication. This Transparency Statement outlines our core
          principles and practices to ensure you understand how our platform
          operates, how your data is handled, and how decisions are made. We are
          committed to providing a fair, reliable, and straightforward
          experience for both students and hostel owners.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          1. Our Platform's Purpose & Mission
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          <strong>ConnectingHostels</strong> serves as a dedicated bridge
          connecting students with quality, verified hostel accommodations,
          primarily in Mangalpalle, Hyderabad. Our mission is to:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Simplify Hostel Search:
            </strong>{" "}
            Provide students with an easy-to-use platform to browse, compare,
            and inquire about hostels based on their specific needs and
            preferences.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Empower Hostel Owners:
            </strong>{" "}
            Offer hostel owners a fair and efficient channel to showcase their
            properties, manage inquiries, and connect with potential residents.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Foster Community:
            </strong>{" "}
            Build a reliable ecosystem where trust and clear information are
            paramount, benefiting both students and hostel providers.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          2. Transparent Pricing & Fees
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We believe in a clear and understandable fee structure.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              For Students:
            </strong>
            Browse listings, viewing details, and sending inquiries through
            ConnectingHostels is absolutely free for students. There are no
            hidden charges for using our search and connection services.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              For Hostel Owners (Partners):
            </strong>
            Any service fees, commissions, or charges for premium features
            (e.g., featured listings, advanced analytics) that may apply to
            hostel owners will be explicitly communicated and agreed upon during
            the onboarding process or clearly displayed in your partner
            dashboard.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Offline Transactions:
            </strong>
            ConnectingHostels primarily facilitates the connection. We do not
            take a percentage or fee from offline payments (e.g., monthly rent,
            security deposits) made directly between the student and the hostel
            owner, unless explicitly stated and agreed upon for specific service
            offerings.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          3. Verified & Accurate Listings
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Ensuring the reliability of our listings is a top priority.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Verification Process:
            </strong>{" "}
            All hostels undergo a verification process (which may include manual
            checks, document verification, or digital validation) before their
            listings go live on our platform. This helps ensure authenticity and
            compliance with our standards.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Information Accuracy:
            </strong>{" "}
            We rely on hostel owners to provide accurate and up-to-date
            information, including photos, amenities, pricing, and availability.
            While we verify initial details, owners are responsible for
            maintaining listing accuracy.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Content Moderation:
            </strong>{" "}
            Listings found to contain misleading, false, or fraudulent
            information will be investigated and removed promptly upon
            verification of reports. We encourage users to report any
            discrepancies.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          4. Fair Reviews & Ratings
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          User-generated reviews are crucial for our community's integrity.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Authentic Reviews Only:
            </strong>
            Only students who have made an inquiry through our platform and
            either booked or demonstrably stayed at a hostel may submit a review
            for that specific property. This helps ensure reviews are based on
            actual experiences.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              No Manipulation:
            </strong>{" "}
            We strictly prohibit any manipulation of reviews or ratings.
            ConnectingHostels does not alter, remove (unless violating Community
            Guidelines), or selectively display reviews to favor or disfavor any
            listing or owner.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Moderation & Reporting:
            </strong>{" "}
            All reviews are subject to our{" "}
            <a
              href="/community-guidelines"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Community Guidelines
            </a>
            . Reported reviews for abuse, hate speech, or personal attacks are
            reviewed by our dedicated moderation team typically within 48 hours.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          5. Advertising & Promotion Transparency
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Any promotional content on our platform will be clearly identified.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Clear Labeling:
            </strong>{" "}
            If a hostel listing or any other content is promoted, featured, or
            sponsored through a paid arrangement, it will be explicitly labeled
            as "Promoted," "Sponsored," or "Ad."
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Distinction:
            </strong>{" "}
            We ensure a clear distinction between organic search
            results/listings and paid promotional content to avoid any confusion
            for our users.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          6. Data Usage & Privacy
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Your privacy is paramount. We are committed to responsible data
          handling.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              No Sale of Personal Data:
            </strong>{" "}
            We categorically state that{" "}
            <strong>ConnectingHostels does not sell</strong>
            your personal data (including names, contact details, or usage
            patterns) to third parties.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Purpose-Limited Sharing:
            </strong>{" "}
            Your data is only shared with relevant parties (e.g., a hostel owner
            when you inquire about their property, or our trusted service
            providers for platform functionality) as necessary for the purpose
            of providing the Service and with your explicit consent where
            required.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              User Control:
            </strong>{" "}
            We aim to provide you with full control over your account and the
            visibility of your personal information and listings. You can manage
            your preferences and settings directly on the platform.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Refer to Policies:
            </strong>{" "}
            For detailed information on how we collect, use, store, and protect
            your personal data, please refer to our comprehensive{" "}
            <a
              href="/privacy-policy"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="/data-protection-policy"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Data Protection Policy
            </a>
            .
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          7. Our Commitment to Continuous Improvement
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We are dedicated to continuously improving our Service and maintaining
          the highest standards of transparency and integrity.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Feedback Welcome:
            </strong>{" "}
            We value your feedback as it helps us identify areas for improvement
            and maintain our commitment to transparency.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Policy Updates:
            </strong>{" "}
            This statement, along with our other policies, may be updated
            periodically to reflect changes in our practices or regulatory
            requirements. We will endeavor to notify you of significant changes.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          8. Contact Us
        </h2>
        <p className="mb-8 text-gray-700 dark:text-gray-300">
          Your questions and concerns are important to us. If you have any
          feedback, questions about this Transparency Statement, or suggestions
          for how we can improve, please do not hesitate to contact us.
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
          Building <strong>ConnectingHostels</strong> with integrity, respect,
          and a commitment to full transparency for students and hostel owners
          alike.
        </p>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          Last updated: July 17, 2025
        </p>
      </div>
    </div>
  );
};

export default Transparency;

import React, { useEffect } from "react";

const CookiePolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
          ConnectingHostels Cookie Policy
        </h1>

        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Cookie Policy ("Policy") explains how{" "}
          <strong>ConnectingHostels</strong>
          ("we," "us," or "our") uses cookies and similar technologies (like web
          beacons, pixels, and local storage) when you visit our website, use
          our mobile application, or interact with our online services
          (collectively, the "Service").
        </p>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          By continuing to use our Service, you consent to the use of cookies as
          described in this Policy. You have the right to withdraw your consent
          at any time.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          1. What Are Cookies?
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Cookies are small text files that are placed on your computer or
          mobile device when you visit a website. They are widely used to make
          websites work more efficiently, as well as to provide reporting
          information and to remember your preferences and activities. Cookies
          can be "persistent" or "session" cookies.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Session Cookies:
            </strong>{" "}
            These are temporary cookies that remain in your browser's cookie
            file until you leave the site. They allow you to carry information
            across pages of our site without having to re-enter it.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Persistent Cookies:
            </strong>{" "}
            These remain in your browser's cookie file for a longer period (how
            long depends on the lifetime of the specific cookie). They are used
            to remember your preferences and settings when you revisit a site.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          2. How We Use Cookies
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We use cookies for several reasons, including:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Authentication:
            </strong>{" "}
            To identify you when you log in to our Service, keeping you logged
            in as you navigate.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Security:
            </strong>{" "}
            To help detect and prevent malicious activities.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Preference and Settings:
            </strong>{" "}
            To remember your preferences, such as your preferred language,
            currency, dark/light mode, and other display settings.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Analytics and Performance:
            </strong>{" "}
            To understand how our Service is being used, which pages are most
            popular, how long users spend on each page, and to identify and fix
            errors. This helps us improve the overall user experience.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Personalization:
            </strong>{" "}
            To provide you with a more personalized experience, such as
            recommending hostels based on your previous searches or interests.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Advertising (where applicable):
            </strong>{" "}
            To deliver relevant advertisements to you, both on our Service and
            on third-party websites.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          3. Types of Cookies We Use
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.1. Essential (Strictly Necessary) Cookies:
            </strong>
            These cookies are vital for the proper functioning of our Service.
            They enable core functionalities like user login, authentication,
            and basic site navigation. Without these cookies, certain parts of
            the Service may not function correctly. These do not require your
            explicit consent as they are necessary for the service to be
            provided.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.2. Analytics and Performance Cookies:
            </strong>
            These cookies collect information about how visitors use our
            Service, such as which pages they visit most often, and if they get
            error messages from web pages. These cookies do not collect
            information that identifies a visitor. All information these cookies
            collect is aggregated and therefore anonymous. We use tools like
            Google Analytics for this purpose.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.3. Functionality/Preference Cookies:
            </strong>
            These cookies allow our Service to remember choices you make (such
            as your user name, language, or the region you are in) and provide
            enhanced, more personal features. For instance, remembering your
            preferred theme (light/dark mode) or your search filters for
            hostels.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.4. Location-Based Cookies/Local Storage:
            </strong>
            When you grant permission, we may store your location data (or a
            setting indicating location access permission) in local storage to
            provide geographically relevant hostel suggestions. This is
            typically tied to your explicit consent for location services.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.5. Advertising/Targeting Cookies (if applicable):
            </strong>
            These cookies are used to deliver advertisements more relevant to
            you and your interests. They are also used to limit the number of
            times you see an advertisement as well as help measure the
            effectiveness of the advertising campaign. They are usually placed
            by advertising networks with the website operator's permission.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          4. Third-Party Cookies
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          In addition to our own cookies, we may also use various third-party
          cookies to report usage statistics of the Service, deliver
          advertisements on and through the Service, and so on. These third
          parties may include:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Google Analytics:
            </strong>{" "}
            For website traffic analysis.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Google Maps API:
            </strong>{" "}
            For location-based features.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Firebase (e.g., Analytics, Authentication):
            </strong>{" "}
            For backend services and app performance monitoring.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Payment Gateways:
            </strong>{" "}
            For processing transactions securely.
          </li>
          <li>
            We encourage you to review the privacy policies of these third-party
            services for more information on their data practices.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          5. Your Choices and Managing Cookies
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          You have the ability to accept or decline cookies. Most web browsers
          automatically accept cookies, but you can usually modify your browser
          setting to decline cookies if you prefer.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Browser Settings:
            </strong>{" "}
            You can typically remove or reject cookies via your browser's
            settings. To do this, follow the instructions provided by your
            browser (usually located within the "settings," "help," "tools," or
            "edit" functions).
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Cookie Consent Tool (Coming Soon):
            </strong>{" "}
            For certain regions (e.g., EU), we plan to implement a dedicated
            cookie consent tool on our website, allowing you to explicitly
            manage your preferences for different cookie categories.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              {" "}
              Consequences of Disabling:
            </strong>{" "}
            Please note that if you choose to disable essential cookies, some
            parts of our Service may not function properly or may become
            inaccessible. Disabling other types of cookies may reduce the
            functionality and personalization you experience.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          6. Changes to This Cookie Policy
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We may update our Cookie Policy from time to time. We will notify you
          of any changes by posting the new Cookie Policy on this page and
          updating the "Last updated" date. We will also inform you via email or
          a prominent notice on our Service prior to the change becoming
          effective, if the changes are material. You are advised to review this
          Cookie Policy periodically for any changes.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          7. Contact Us
        </h2>
        <p className="mb-8 text-gray-700 dark:text-gray-300">
          If you have any questions about this Cookie Policy, please contact us:
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
          <strong>Legal Disclaimer:</strong> This Cookie Policy is provided as a
          general template. It is highly recommended to consult with a legal
          professional to ensure full compliance with all applicable data
          protection and privacy laws, such as GDPR (for EU users), CCPA (for
          California users), and India's Digital Personal Data Protection Act,
          2023, which may require specific details and consent mechanisms.
        </p>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          Last updated: July , 2025
        </p>
      </div>
    </div>
  );
};

export default CookiePolicy;

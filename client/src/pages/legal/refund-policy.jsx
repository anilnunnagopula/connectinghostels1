import React, { useEffect } from "react";

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
          ConnectingHostels Refund & Cancellation Policy
        </h1>

        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          At <strong>ConnectingHostels</strong>, we strive to facilitate a
          transparent and fair experience for both students seeking
          accommodation and hostel owners listing their properties. This Refund
          & Cancellation Policy ("Policy") outlines the terms and conditions
          governing cancellations and refunds related to bookings made through
          our platform. Please read this policy carefully before making any
          bookings or payments.
        </p>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          <strong>Important Note:</strong> ConnectingHostels acts as a platform
          to connect students with hostel owners. We are not the direct provider
          of accommodation. Unless explicitly stated, this policy primarily
          covers "ConnectingHostels Service Fees" (if any) and provides general
          guidelines for interactions between students and hostel owners.
          Specific cancellation and refund rules for the *hostel rent/deposit*
          are often set by individual hostel owners, and you should always
          confirm these directly with the hostel.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          1. Booking Confirmation & Payments
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              1.1. Booking Request:
            </strong>{" "}
            When a student submits a booking request through our platform, it is
            sent to the respective hostel owner for review and confirmation.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              1.2. Confirmation:
            </strong>{" "}
            A booking is considered confirmed only when the hostel owner
            explicitly accepts the request through the ConnectingHostels
            platform.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              1.3. Payment Types:
            </strong>{" "}
            Payments made via ConnectingHostels may include:
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                **ConnectingHostels Service Fee:** A fee charged by us for using
                our platform (if applicable).
              </li>
              <li>
                **Advance/Booking Deposit to Hostel:** A partial payment
                collected on behalf of the hostel owner to secure the booking,
                which is then transferred to the hostel owner.
              </li>
            </ul>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          2. Cancellation by Students
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Students can initiate a cancellation request through their
          ConnectingHostels account. The refund eligibility for the
          "Advance/Booking Deposit to Hostel" (collected on behalf of the
          hostel) is as follows:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              2.1. Cancellation 3 Days or More Before Check-In:
            </strong>
            If a confirmed booking is canceled by the student at least **72
            hours (3 days)** prior to the scheduled check-in date/time:
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>**ConnectingHostels Service Fee:** Non-refundable.</li>
              <li>
                **Advance/Booking Deposit to Hostel:** 100% of the deposit will
                be refunded to the student.
              </li>
            </ul>
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              2.2. Cancellation Less Than 3 Days Before Check-In:
            </strong>
            If a confirmed booking is canceled by the student **less than 72
            hours (3 days)** prior to the scheduled check-in date/time:
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>**ConnectingHostels Service Fee:** Non-refundable.</li>
              <li>
                **Advance/Booking Deposit to Hostel:** A cancellation fee of
                **25%** of the deposit amount will be deducted, and the
                remaining 75% will be refunded.
              </li>
            </ul>
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              2.3. Cancellation On or After Check-In Date (No Show):
            </strong>
            If a student cancels on or after the scheduled check-in date/time,
            or does not show up for the booking (no-show):
            <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>**ConnectingHostels Service Fee:** Non-refundable.</li>
              <li>
                **Advance/Booking Deposit to Hostel:** No refund on the initial
                advance/booking deposit or any other fees paid, unless
                explicitly approved otherwise by the hostel owner under their
                specific policy.
              </li>
            </ul>
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              2.4. Mid-Stay Cancellation/Vacating Early:
            </strong>
            Once a student has moved into a hostel, any refunds for vacating
            early or canceling their stay are solely at the discretion of the
            hostel owner and subject to their individual hostel's policies
            (e.g., notice period, deductions for unused days, cleaning fees,
            etc.). ConnectingHostels is not responsible for these specific
            refunds.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          3. Vacating Policy (After Moving In)
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          This section applies once a student has successfully moved into a
          hostel booked through our platform.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.1. Notice Period:
            </strong>{" "}
            Students are generally required to provide a minimum of **7 days'
            written notice** to the hostel owner before their intended vacate
            date. Failure to provide sufficient notice may result in forfeiture
            of a portion or all of the security deposit, as per the hostel's
            rules.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.2. Refund of Security Deposit:
            </strong>
            Refunds for security deposits (distinct from advance/booking
            deposits) are handled directly by the hostel owner. The refund
            amount is subject to deductions for any damages, unpaid dues, or
            cleaning charges as per the hostel's agreement.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.3. Room Condition:
            </strong>{" "}
            Rooms must be handed back in good, clean condition, free of damages
            beyond normal wear and tear, to facilitate the full return of the
            security deposit.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              3.4. Dispute Resolution:
            </strong>{" "}
            Any disputes regarding security deposit deductions or refunds after
            vacating must be resolved directly between the student and the
            hostel owner. ConnectingHostels may, at its discretion, offer
            mediation but is not liable for the outcome.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          4. Cancellation by Hostel Owners
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          In the rare event that a hostel owner cancels a confirmed booking:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.1. Full Refund:
            </strong>{" "}
            The student will receive a full refund of any "Advance/Booking
            Deposit to Hostel" and any "ConnectingHostels Service Fee" paid.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.2. Platform Action:
            </strong>{" "}
            Repeated or unjustified cancellations by hostel owners may result in
            penalties, including temporary suspension or permanent removal from
            the ConnectingHostels platform.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              4.3. Assistance:
            </strong>{" "}
            ConnectingHostels will endeavor to assist the student in finding
            alternative accommodation options, though we cannot guarantee
            availability or price matching.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          5. Refund Processing Timeline
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.1. Processing Period:
            </strong>{" "}
            Once a refund is approved by ConnectingHostels (for service fees) or
            confirmed by the hostel owner (for deposits), refunds are typically
            processed within **5-7 working days**.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.2. Payment Method:
            </strong>{" "}
            Refunds will be issued to the original payment method used during
            the booking transaction. The actual time for the funds to reflect in
            your account may vary depending on your bank or payment processor.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              5.3. Confirmation:
            </strong>{" "}
            A confirmation email will be sent to your registered email address
            once the refund has been initiated from our end.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          6. Force Majeure / Exceptional Circumstances
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          In cases of unforeseeable circumstances beyond the control of either
          the student, hostel owner, or ConnectingHostels (e.g., natural
          disasters, pandemics, government restrictions, severe civil unrest),
          ConnectingHostels will work with affected parties to find fair
          solutions. Refund and cancellation terms in such situations may be
          adjusted on a case-by-case basis, overriding standard policies if
          necessary.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          7. Contact & Grievance Redressal
        </h2>
        <p className="mb-8 text-gray-700 dark:text-gray-300">
          For any questions, concerns, or issues related to refunds or
          cancellations, please reach out to our support team:
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
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We aim to resolve all queries efficiently. For detailed dispute
          resolution procedures, please refer to our main{" "}
          <a
            href="/terms-conditions"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Terms & Conditions
          </a>
          .
        </p>

        <p className="mt-12 text-sm text-gray-500 dark:text-gray-400 italic text-center">
          **Legal Disclaimer:** This Refund & Cancellation Policy is a general
          template and should not be considered legal advice. It is imperative
          to consult with a legal professional to draft a policy that is
          specific to your business model, payment processing flows, and fully
          compliant with all applicable consumer protection and e-commerce laws
          in India (e.g., Consumer Protection Act, 2019) and other relevant
          jurisdictions.
        </p>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          Last updated: July, 2025
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;

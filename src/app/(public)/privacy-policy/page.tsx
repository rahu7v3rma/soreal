"use client";

const Page = () => {
  return (
    <div className="min-h-screen bg-background w-screen">
      <div className="pt-24 pb-12 text-center">
        <h1 className="text-4xl font-semibold tracking-[-0.022em] mb-4">
          Privacy Policy
        </h1>
        <p className="text-xl font-light text-muted-foreground">
          Soreal – a service of Soreal AI, LLC
        </p>
        <p className="text-sm font-light text-muted-foreground mt-2">
          Effective Date: May 19, 2025
        </p>
      </div>

      <div className="max-w-[900px] mx-auto px-6 pb-24">
        <div className="prose prose-gray max-w-none">
          <div className="border-t border-gray-200 my-8"></div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] mb-6">
              1. Who We Are
            </h2>
            <p className="text-gray-700 font-light leading-relaxed">
              Soreal AI, LLC ("Soreal," "we," "our" or "us") operates the Soreal
              website, API and related services (collectively, the "Service").
              This Privacy Policy explains how we collect, use and protect
              information when you use the Service.
            </p>
          </section>

          <div className="border-t border-gray-200 my-8"></div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] mb-6">
              2. Age Restriction
            </h2>
            <p className="text-gray-700 font-light leading-relaxed">
              Soreal is strictly limited to users 18 years of age or older. We
              do not knowingly collect personal information from anyone under
              18. If you are under 18, do not use the Service.
            </p>
          </section>

          <div className="border-t border-gray-200 my-8"></div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] mb-6">
              3. Information We Collect
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left font-medium text-gray-900">
                      Category
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">
                      Details & Examples
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Account Data
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Name, email, password hash, subscription level, payment
                      status
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Provided by you
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Payment Data
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Billing name, card last 4, ZIP/postal code (processed by
                      Stripe—Soreal never stores full card numbers)
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Provided by you / Stripe
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Prompt & Asset Data
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Text prompts, uploaded reference images, generated images
                      ("Assets"), metadata
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Provided by you; created by our models
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Device & Log Data
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      IP address, browser type, OS, referring URL, pages viewed,
                      timestamps
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Collected automatically
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Analytics Events
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Feature use, button clicks, session length (Google
                      Analytics 4 & self-hosted PostHog)
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Collected automatically
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Cookie Data
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      See section 5
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Collected automatically
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Inferred Data
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      General location (city/country) from IP, product-usage
                      patterns
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Derived by us
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="border-t border-gray-200 my-8"></div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] mb-6">
              4. How We Use Information
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left font-medium text-gray-900">
                      Purpose
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">
                      Explanation & Legal Basis*
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Provide Service
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Authenticate you, render pages, generate images, deliver
                      API responses (contract)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Improve & Secure
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Debug, prevent abuse, measure performance, test new
                      features (legitimate interest)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">Billing</td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Process subscriptions, detect fraud (contract / legitimate
                      interest)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Communications
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Send account, transactional & product-update emails
                      (legitimate interest / consent where required)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Model Training (Opt-in)
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Paid-tier users may opt-in to allow their prompts & images
                      to improve future model versions (consent)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 font-light text-sm mt-2">
              *Where GDPR/UK GDPR applies.
            </p>
          </section>

          <div className="border-t border-gray-200 my-8"></div>

          <section id="cookies-similar-tech" className="mb-12">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] mb-6">
              5. Cookies & Similar Tech
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left font-medium text-gray-900">
                      Cookie Type
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">
                      Why We Use It
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">
                      Opt-Out Options
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Essential
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Login, session routing, CSRF protection
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Cannot be disabled without breaking the Service
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Analytics
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      GA4 & PostHog collect de-identified usage stats
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Banner opt-in for EU/UK; global opt-out link in footer
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Functional
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Remember UI settings (e.g., theme, language)
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Manage in your browser
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Advertising
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Limited first-party retargeting pixels to show Soreal ads
                      on other sites
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Disabled by default in EU/UK banner; global toggle in
                      account settings
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 font-light leading-relaxed mt-4">
              We do not sell or share data with data brokers. Advertising
              cookies are never set unless you have explicitly opted-in.
            </p>
          </section>

          <div className="border-t border-gray-200 my-8"></div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] mb-6">
              6. Sharing & Disclosure
            </h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              We disclose personal data only:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 font-light">
              <li>
                Service providers under contract who act on our instructions
                (e.g., Stripe payments, Supabase hosting, AWS image cache).
              </li>
              <li>
                Analytics vendors (GA4, PostHog) that receive obfuscated or
                pseudonymous IDs.
              </li>
              <li>
                Legal or safety reasons if required by law or to protect rights,
                property or safety.
              </li>
              <li>
                Corporate events (merger, acquisition) where data transfers
                follow this Policy.
              </li>
            </ol>
          </section>

          <div className="border-t border-gray-200 my-8"></div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] mb-6">
              7. International Transfers
            </h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              Data is hosted primarily in the United States (Supabase / AWS).
              For EU, UK and Swiss users we rely on:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 font-light">
              <li>
                Standard Contractual Clauses (SCCs) with our US processors;
              </li>
              <li>Data Processing Addenda with all sub-processors;</li>
              <li>Technical measures (encryption in transit & at rest).</li>
            </ul>
          </section>

          <div className="border-t border-gray-200 my-8"></div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] mb-6">
              8. Retention & Deletion
            </h2>
            <p className="text-gray-700 font-light leading-relaxed">
              We store prompts, uploads and Assets indefinitely so you can
              revisit your history, unless you:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 font-light mt-4">
              <li>delete specific items via your dashboard; or</li>
              <li>
                submit an account-deletion request (erases all personal data and
                Assets within 30 days, except backups required for
                fraud-prevention or legal obligations).
              </li>
            </ul>
          </section>

          <div className="border-t border-gray-200 my-8"></div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] mb-6">
              9. Your Rights
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left font-medium text-gray-900">
                      Region
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">
                      Rights You Have
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">
                      How to Exercise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      EEA / UK / CH
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Access, rectification, erasure, restriction, objection,
                      portability, withdraw consent
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Email privacy@soreal.app
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      California (CCPA)
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Know, delete, correct, no sale, non-discrimination
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Same as above
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Worldwide
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Export, delete account, manage cookies, advertising
                      opt-out
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Self-service in Settings or email us
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 font-light leading-relaxed mt-4">
              We verify each request and respond within statutory deadlines.
            </p>
          </section>

          <div className="border-t border-gray-200 my-8"></div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] mb-6">
              10. Security
            </h2>
            <p className="text-gray-700 font-light leading-relaxed">
              We use HTTPS, at-rest encryption, least-privilege access, and
              regular penetration testing. No system is perfect; if a breach
              occurs we will notify affected users and regulators as required by
              law.
            </p>
          </section>

          <div className="border-t border-gray-200 my-8"></div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] mb-6">
              11. Third-Party Links
            </h2>
            <p className="text-gray-700 font-light leading-relaxed">
              External sites we link to operate under their own policies. We are
              not responsible for their content or privacy practices.
            </p>
          </section>

          <div className="border-t border-gray-200 my-8"></div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] mb-6">
              12. Changes to This Policy
            </h2>
            <p className="text-gray-700 font-light leading-relaxed">
              We may update this Policy periodically. If changes are material we
              will notify you by email or in-app banner 30 days before they take
              effect. Continued use after the effective date constitutes
              acceptance.
            </p>
          </section>

          <div className="border-t border-gray-200 my-8"></div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] mb-6">
              13. Contact Us
            </h2>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left font-medium text-gray-900">
                      Office
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">
                      Address
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">
                      Purpose
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 align-top font-medium">
                      Company Address
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      Soreal AI, LLC
                      <br />
                      8 The Green #18947
                      <br />
                      Dover, DE 19901, USA
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-light">
                      All inquiries
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 font-light leading-relaxed">
              Email:{" "}
              <a
                href="mailto:privacy@soreal.app"
                className="text-[#2fceb9] hover:underline"
              >
                privacy@soreal.app
              </a>
            </p>
            <p className="text-gray-700 font-light leading-relaxed">
              We aim to reply within 5 business days.
            </p>
          </section>

          <div className="border-t border-gray-200 my-8"></div>

          <p className="text-sm text-gray-500 font-light text-center">
            Last revised: May 19, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

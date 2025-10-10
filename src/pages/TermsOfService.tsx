import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms of Service</h1>
          
          <p className="text-sm text-gray-600 mb-6">
            Last Updated: October 8, 2025
          </p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Zenk Loans ("the Service"), you accept and agree to be bound
                by these Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Eligibility</h2>
              <p className="mb-2">To use our service, you must:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Be at least 18 years of age</li>
                <li>Be a Kenyan citizen or legal resident</li>
                <li>Have a valid Kenyan ID or passport</li>
                <li>Have an active M-Pesa account</li>
                <li>Provide accurate and truthful information</li>
                <li>Have the legal capacity to enter into a binding contract</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Loan Terms</h2>
              
              <h3 className="text-lg font-medium mt-4 mb-2">3.1 Loan Amounts</h3>
              <p>Loans range from KES 5,000 to KES 25,000, subject to approval and creditworthiness.</p>

              <h3 className="text-lg font-medium mt-4 mb-2">3.2 Processing Fees</h3>
              <p className="mb-2">Processing fees are charged based on loan amount:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Up to KES 5,000: KES 99</li>
                <li>KES 5,001 - 7,000: KES 135</li>
                <li>KES 7,001 - 10,000: KES 165</li>
                <li>KES 10,001 - 14,000: KES 195</li>
                <li>KES 14,001 - 16,000: KES 210</li>
                <li>KES 16,001 - 19,000: KES 240</li>
                <li>KES 19,001 - 22,000: KES 300</li>
                <li>KES 22,001 - 25,000: KES 350</li>
              </ul>

              <h3 className="text-lg font-medium mt-4 mb-2">3.3 Interest Rates</h3>
              <p>
                Interest rates are calculated based on the loan amount and repayment period.
                All rates comply with Central Bank of Kenya regulations.
              </p>

              <h3 className="text-lg font-medium mt-4 mb-2">3.4 Repayment Period</h3>
              <p>Repayment periods range from 1 to 12 months, as selected during application.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Application Process</h2>
              <p className="mb-2">When you apply for a loan:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>You authorize us to verify your information</li>
                <li>You consent to credit checks (if applicable)</li>
                <li>You agree to pay the processing fee via M-Pesa</li>
                <li>You provide a guarantor who confirms their consent</li>
                <li>Approval is not guaranteed and is at our sole discretion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Payment and Disbursement</h2>
              <p className="mb-2">
                All payments are processed through M-Pesa. By using our service, you agree that:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Processing fees are non-refundable</li>
                <li>Loan disbursement occurs after successful payment verification</li>
                <li>You are responsible for ensuring sufficient M-Pesa balance</li>
                <li>Transaction failures due to insufficient funds are your responsibility</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Repayment Obligations</h2>
              <p className="mb-2">You agree to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Repay the loan according to the agreed schedule</li>
                <li>Pay all interest and fees as outlined in your loan agreement</li>
                <li>Notify us immediately if you cannot make a payment</li>
                <li>Accept that late payments may incur additional fees</li>
                <li>Understand that default may be reported to credit bureaus</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Guarantor Responsibilities</h2>
              <p>
                By providing a guarantor, you confirm that the guarantor has consented to be listed
                and understands they may be contacted regarding your loan. The guarantor may be
                held liable in case of default, as per Kenyan law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Prohibited Activities</h2>
              <p className="mb-2">You may not:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide false or misleading information</li>
                <li>Use the service for illegal purposes</li>
                <li>Attempt to manipulate or hack the system</li>
                <li>Apply for multiple loans simultaneously without disclosure</li>
                <li>Use another person's identity or M-Pesa account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Data Protection</h2>
              <p>
                Your personal information is protected under our Privacy Policy and the Kenya
                Data Protection Act. We collect, use, and store your data as described in our
                Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Limitation of Liability</h2>
              <p>
Zenk Loans is not liable for any indirect, incidental, or consequential damages
                arising from your use of the service, including but not limited to M-Pesa
                transaction failures, network issues, or third-party service disruptions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to the service at any
                time for violation of these terms, fraudulent activity, or any other reason at
                our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Governing Law</h2>
              <p>
                These Terms of Service are governed by the laws of the Republic of Kenya. Any
                disputes shall be resolved in Kenyan courts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. Changes to Terms</h2>
              <p>
                We may modify these terms at any time. Continued use of the service after changes
                constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">14. Contact Information</h2>
              <p className="mb-2">For questions about these terms:</p>
              <ul className="list-none space-y-1">
                <li><strong>Email:</strong> support@zenk.co.ke</li>
                <li><strong>Phone:</strong> +254 700 000 000</li>
                <li><strong>Address:</strong> Nairobi, Kenya</li>
              </ul>
            </section>

            <section className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm">
                <strong>Important:</strong> By clicking "I Agree" or using our service, you acknowledge
                that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

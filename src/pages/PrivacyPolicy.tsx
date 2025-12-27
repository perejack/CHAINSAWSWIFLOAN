import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
          
          <p className="text-sm text-gray-600 mb-6">
            Last Updated: October 8, 2025
          </p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="mb-2">We collect the following information when you apply for a loan:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Personal identification (Name, ID Number, Date of Birth)</li>
                <li>Contact information (Phone Number, Email Address)</li>
                <li>Financial information (Employment Status, Monthly Income)</li>
                <li>Loan details (Amount, Purpose, Repayment Period)</li>
                <li>Guarantor information (Name, Phone, Relationship)</li>
                <li>Transaction data (Payment status, M-Pesa receipts)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="mb-2">Your information is used to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Process and evaluate your loan application</li>
                <li>Verify your identity and creditworthiness</li>
                <li>Process payments via M-Pesa</li>
                <li>Communicate with you about your loan status</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Encrypted data transmission (HTTPS/SSL)</li>
                <li>Secure database storage with access controls</li>
                <li>Regular security audits and updates</li>
                <li>PCI DSS compliant payment processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Information Sharing</h2>
              <p className="mb-2">We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Payment Processors:</strong> PesaFlux/M-Pesa for transaction processing</li>
                <li><strong>Credit Reference Bureaus:</strong> For credit assessment (with your consent)</li>
                <li><strong>Legal Authorities:</strong> When required by law</li>
                <li><strong>Service Providers:</strong> Who assist in our operations under strict confidentiality</li>
              </ul>
              <p className="mt-2">We do NOT sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
              <p className="mb-2">Under the Kenya Data Protection Act, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data (subject to legal obligations)</li>
                <li>Object to processing of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services
                and comply with legal obligations. Loan records are typically retained for 7 years
                after loan completion as required by financial regulations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Cookies and Tracking</h2>
              <p>
                We use essential cookies to ensure the proper functioning of our website. We do not
                use third-party advertising cookies or tracking technologies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
              <p className="mb-2">For privacy-related inquiries or to exercise your rights:</p>
              <ul className="list-none space-y-1">
                <li><strong>Email:</strong> silverstonesolutions103@gmail.com</li>
                <li><strong>Phone:</strong> +2540104101257</li>
                <li><strong>Address:</strong> Nairobi, Kenya</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any
                significant changes by posting the new policy on this page and updating the
                "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Compliance</h2>
              <p>
                This privacy policy complies with the Kenya Data Protection Act, 2019 and other
                applicable data protection regulations.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

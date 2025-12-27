import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, BookOpen, Zap, Shield, Copy, Check, ExternalLink,
  Github, FileText, ChevronRight, AlertCircle, CheckCircle2,
  Terminal, Database, Key, Play, Smartphone, Globe, Lock,
  Webhook, Server, AlertTriangle, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Components ---

const CodeBlock = ({
  code,
  language = "javascript",
  title,
  showLineNumbers = false
}: {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-border/50 font-mono text-sm relative group my-4">
      {(title) && (
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-border/50">
          <span className="text-muted-foreground text-xs">{title}</span>
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500/20" />
            <div className="h-2 w-2 rounded-full bg-yellow-500/20" />
            <div className="h-2 w-2 rounded-full bg-green-500/20" />
          </div>
        </div>
      )}
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute right-4 top-4 p-2 rounded-lg bg-white/5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/10 transition-all custom-backdrop z-10"
          title="Copy code"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
        <div className="p-4 overflow-x-auto custom-scrollbar">
          <pre className="text-gray-300 font-[400] leading-relaxed">
            {showLineNumbers ? (
              code.split('\n').map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell text-gray-600 select-none text-right pr-4 border-r border-gray-800/50 mr-4">{i + 1}</span>
                  <span className="table-cell pl-4">{line}</span>
                </div>
              ))
            ) : (
              <code>{code}</code>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

const FlowStep = ({
  icon: Icon,
  title,
  desc,
  active,
  completed,
  onClick
}: {
  icon: any;
  title: string;
  desc: string;
  active: boolean;
  completed: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    className={cn(
      "flex items-start gap-4 p-4 rounded-xl text-left w-full transition-all border-2 group",
      active
        ? "bg-primary/5 border-primary shadow-lg shadow-primary/10"
        : completed
          ? "bg-muted/30 border-green-500/30 opacity-70 hover:opacity-100"
          : "bg-transparent border-transparent hover:bg-muted/50"
    )}
  >
    <div className={cn(
      "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-colors shadow-sm",
      active
        ? "bg-primary text-primary-foreground"
        : completed
          ? "bg-green-500 text-white"
          : "bg-muted text-muted-foreground group-hover:bg-muted/80"
    )}>
      {completed ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
    </div>
    <div>
      <h3 className={cn(
        "font-semibold transition-colors",
        active ? "text-primary" : completed ? "text-green-500" : "text-muted-foreground group-hover:text-foreground"
      )}>
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
    </div>
  </motion.button>
);

const EndpointBadge = ({ method }: { method: string }) => {
  const colors = {
    GET: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    POST: "bg-green-500/10 text-green-400 border-green-500/20",
    PUT: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
  }[method] || "bg-gray-500/10 text-gray-400";

  return (
    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border", colors)}>
      {method}
    </span>
  );
};

export default function DeveloperPortal() {
  const [activeTab, setActiveTab] = useState<'guide' | 'reference' | 'webhooks'>('guide');
  const [activeStep, setActiveStep] = useState(0);
  const [codeLang, setCodeLang] = useState('nodejs');

  const INTEGRATION_STEPS = [
    { id: 'credentials', icon: Key, title: 'Get Credentials', desc: 'Setup your API keys' },
    { id: 'initiate', icon: Smartphone, title: 'Initiate Payment', desc: 'Trigger STK Push' },
    { id: 'verify', icon: CheckCircle2, title: 'Verify Status', desc: 'Confirm payment receipt' }
  ];

  const REFERENCE_DOCS = [
    {
      title: "Initiate STK Push",
      method: "POST",
      endpoint: "/api/mpesa/stk-push-api",
      desc: "Triggers an M-Pesa STK push prompt on the customer's phone.",
      params: [
        { name: "phone_number", type: "string", req: true, desc: "Format: 254XXXXXXXXX" },
        { name: "amount", type: "number", req: true, desc: "Amount to charge" },
        { name: "till_id", type: "string", req: true, desc: "Your Till ID" }
      ]
    },
    {
      title: "Check Status",
      method: "POST",
      endpoint: "/api/mpesa-verification-proxy",
      desc: "Checks the real-time status of a payment request.",
      params: [
        { name: "checkoutId", type: "string", req: true, desc: "ID returned from initiation" },
        { name: "apiKey", type: "string", req: false, desc: "Optional verification key" }
      ]
    }
  ];

  const ERROR_CODES = [
    { code: "1032", desc: "Request Cancelled by User", solution: "Prompt user to try again" },
    { code: "1037", desc: "User Timeout", solution: "User didn't enter PIN in time" },
    { code: "2001", desc: "Invalid Credentials", solution: "Check your API Key and Till ID" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 selection:bg-primary/30 font-sans">

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050505] to-[#050505]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium mb-6 backdrop-blur-sm"
              >
                <Zap className="h-3 w-3 text-yellow-400" />
                <span>Developer Hub v2.0</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight mb-4"
              >
                Build with SwiftPay
              </motion.h1>

              <p className="text-lg text-muted-foreground max-w-xl">
                The complete toolkit for integrating M-Pesa payments.
                From simple checkouts to complex enterprise flows.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={activeTab === 'guide' ? 'secondary' : 'ghost'}
                onClick={() => setActiveTab('guide')}
                className="rounded-full"
              >
                <BookOpen className="mr-2 h-4 w-4" /> Guide
              </Button>
              <Button
                variant={activeTab === 'reference' ? 'secondary' : 'ghost'}
                onClick={() => setActiveTab('reference')}
                className="rounded-full"
              >
                <Server className="mr-2 h-4 w-4" /> API Reference
              </Button>
              <Button
                variant={activeTab === 'webhooks' ? 'secondary' : 'ghost'}
                onClick={() => setActiveTab('webhooks')}
                className="rounded-full"
              >
                <Webhook className="mr-2 h-4 w-4" /> Webhooks
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">

          {/* --- TAB: INTEGRATION GUIDE --- */}
          {activeTab === 'guide' && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid lg:grid-cols-[350px_1fr] gap-12"
            >
              {/* Wizard Sidebar */}
              <div className="space-y-8">
                <div className="sticky top-24">
                  <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 p-6 shadow-2xl relative group mb-8">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      Integration Steps
                    </h3>
                    <div className="space-y-4 relative z-10">
                      {INTEGRATION_STEPS.map((step, idx) => (
                        <FlowStep
                          key={step.id}
                          {...step}
                          active={activeStep === idx}
                          completed={activeStep > idx}
                          onClick={() => setActiveStep(idx)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="hidden lg:block p-6 rounded-2xl bg-[#0A0A0A] border border-white/5">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                      <Terminal className="h-4 w-4 text-muted-foreground" />
                      Quick Tip
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Use <code className="text-white bg-white/10 px-1 rounded">await</code> when calling our async endpoints to ensure you capture the Checkout ID before proceeding.
                    </p>
                  </div>
                </div>
              </div>

              {/* Wizard Content */}
              <div className="min-h-[600px] space-y-12">
                {activeStep === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <h2 className="text-2xl font-bold">1. Get Credentials</h2>
                    <p className="text-muted-foreground text-lg">
                      You'll need a Till ID and an API Key to authenticate your requests.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-xl hover:border-primary/20 transition-colors">
                        <div className="h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg mb-4 flex items-center justify-center">
                          <Database className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Create Till</h3>
                        <p className="text-sm text-muted-foreground mb-4">Dashboard &rarr; Accounts</p>
                        <code className="block w-full bg-black p-3 rounded text-xs text-gray-400 font-mono">dbdedaea-11d8-...</code>
                      </div>

                      <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-xl hover:border-primary/20 transition-colors">
                        <div className="h-24 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg mb-4 flex items-center justify-center">
                          <Key className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Generate API Key</h3>
                        <p className="text-sm text-muted-foreground mb-4">Dashboard &rarr; API Keys</p>
                        <code className="block w-full bg-black p-3 rounded text-xs text-gray-400 font-mono">swp_live_8392...</code>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">2. Initiate Payment</h2>
                      <div className="flex bg-white/5 p-1 rounded-lg">
                        {['nodejs', 'curl'].map(lang => (
                          <button key={lang} onClick={() => setCodeLang(lang)} className={cn("px-4 py-1.5 rounded-md text-xs font-medium transition-all", codeLang === lang ? "bg-primary text-white" : "text-muted-foreground hover:text-white")}>
                            {lang === 'nodejs' ? 'Node.js' : 'cURL'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-muted-foreground">
                      Send a POST request to trigger the STK Push on the user's phone.
                    </p>

                    <CodeBlock
                      title={codeLang === 'nodejs' ? 'api/initiate-payment.js' : 'Terminal'}
                      language={codeLang === 'nodejs' ? 'javascript' : 'bash'}
                      showLineNumbers
                      code={codeLang === 'nodejs' ?
                        `const response = await fetch('https://swiftpay-backend-uvv9.onrender.com/api/mpesa/stk-push-api', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.SWIFTPAY_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone_number: '254712345678', // Must be 254...
    amount: 100,
    till_id: process.env.SWIFTPAY_TILL_ID
  })
});

const { success, data } = await response.json();
// Save this ID! You need it to check status
const checkoutId = data.checkout_id;` :
                        `curl -X POST https://swiftpay-backend-uvv9.onrender.com/api/mpesa/stk-push-api \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone_number": "254712345678",
    "amount": 100,
    "till_id": "YOUR_TILL_ID"
  }'`}
                    />

                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                      <h4 className="text-blue-400 font-medium text-sm mb-2 flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Saving to Database
                      </h4>
                      <p className="text-blue-300/80 text-sm">
                        Only save <code>transaction_request_id</code> (string) and <code>amount</code> (numeric) to your transactions table. Do NOT try to save the entire response object.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <h2 className="text-2xl font-bold">3. Verify Status</h2>
                    <p className="text-muted-foreground">
                      M-Pesa payments are asynchronous. You must poll the status endpoint or use webhooks.
                    </p>

                    <CodeBlock
                      title="api/check-status.js"
                      showLineNumbers
                      code={
                        `// Poll this function every 5 seconds
const checkStatus = async (checkoutId) => {
  const res = await fetch('https://swiftpay-backend-uvv9.onrender.com/api/mpesa-verification-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checkoutId })
  });
  
  const { payment } = await res.json();
  
  if (payment.status === 'success') {
    return 'PAID';
  } else if (payment.status === 'failed') {
    return 'FAILED'; // e.g., Insufficient funds
  }
  
  return 'PENDING'; // User hasn't entered PIN yet
};`}
                    />
                  </motion.div>
                )}

                <div className="flex justify-between pt-8 border-t border-white/5">
                  <Button variant="ghost" onClick={() => setActiveStep(s => Math.max(0, s - 1))} disabled={activeStep === 0}>
                    Back
                  </Button>
                  <Button onClick={() => setActiveStep(s => Math.min(2, s + 1))} disabled={activeStep === 2}>
                    Next Step <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- TAB: API REFERENCE --- */}
          {activeTab === 'reference' && (
            <motion.div
              key="reference"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="prose prose-invert max-w-none">
                <h2 className="text-3xl font-bold mb-6">API Reference</h2>
                <div className="space-y-8">
                  {REFERENCE_DOCS.map((doc, idx) => (
                    <div key={idx} className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
                      <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <EndpointBadge method={doc.method} />
                          <code className="text-sm font-mono text-primary">{doc.endpoint}</code>
                        </div>
                        <h3 className="font-semibold text-sm text-muted-foreground">{doc.title}</h3>
                      </div>
                      <div className="p-6">
                        <p className="text-muted-foreground mb-6">{doc.desc}</p>

                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-[10px]">Parameters</h4>
                        <div className="space-y-2">
                          {doc.params.map(p => (
                            <div key={p.name} className="flex md:items-center flex-col md:flex-row gap-4 p-3 bg-white/5 rounded border border-white/5 text-sm">
                              <div className="w-48 flex-shrink-0 font-mono text-blue-400">{p.name}</div>
                              <div className="w-24 flex-shrink-0 text-xs text-yellow-500 font-mono">{p.type}</div>
                              <div className="w-24 flex-shrink-0 text-xs text-red-400 font-bold">{p.req ? 'REQUIRED' : 'OPTIONAL'}</div>
                              <div className="text-muted-foreground text-xs">{p.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Error Codes</h2>
                <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-white">
                      <tr>
                        <th className="p-4 font-semibold">Code</th>
                        <th className="p-4 font-semibold">Description</th>
                        <th className="p-4 font-semibold">Suggested Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-muted-foreground">
                      {ERROR_CODES.map(err => (
                        <tr key={err.code}>
                          <td className="p-4 font-mono text-primary">{err.code}</td>
                          <td className="p-4">{err.desc}</td>
                          <td className="p-4">{err.solution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- TAB: WEBHOOKS --- */}
          {activeTab === 'webhooks' && (
            <motion.div
              key="webhooks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 max-w-4xl"
            >
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-8 rounded-2xl border border-purple-500/20">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Webhook className="h-6 w-6 text-purple-400" />
                  Real-time Notifications
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Webhooks allow your application to receive automated updates when a payment Status changes, eliminating the need for polling.
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => setActiveTab('reference')}>View Payload Format</Button>
                  <Button variant="outline">Test Webhook</Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Handling Events</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">1</div>
                      <div>
                        <h4 className="font-semibold">Create Endpoint</h4>
                        <p className="text-sm text-muted-foreground mt-1">Create a POST route (e.g., /api/webhooks) in your app.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">2</div>
                      <div>
                        <h4 className="font-semibold">Register URL</h4>
                        <p className="text-sm text-muted-foreground mt-1">Go to Dashboard &rarr; Webhooks and enter your URL.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">3</div>
                      <div>
                        <h4 className="font-semibold">Verify & Process</h4>
                        <p className="text-sm text-muted-foreground mt-1">Check the signature and update your database.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Example Payload</h3>
                  <CodeBlock
                    language="json"
                    code={
                      `{
  "event": "payment.success",
  "data": {
    "transaction_request_id": "ws_CO_123...",
    "amount": 100,
    "receipt": "MPF123456",
    "phone": "254712345678",
    "timestamp": "2024-03-20T10:00:00Z"
  }
}`}
                  />
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}

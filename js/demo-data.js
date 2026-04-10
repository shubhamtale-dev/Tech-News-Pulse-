/**
 * Tech News Pulse — Demo / Sample Articles
 * Shown when no API key is present. Covers all categories.
 */

const DEMO_ARTICLES = [
  {
    title: "OpenAI's GPT-5 Demonstrates Unprecedented Reasoning — Solves PhD-Level Problems",
    description:
      "OpenAI released GPT-5 today with major advances in reasoning, mathematics, and coding ability. Early evaluations show it passing PhD-level benchmarks across 12 academic disciplines, marking a watershed moment for large language models.",
    url: "https://openai.com",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    source: "TechCrunch",
    publishedAt: new Date().toISOString(),
    content: "",
  },
  {
    title: "Bitcoin Breaches $120,000 Milestone as Institutional Adoption Accelerates",
    description:
      "Bitcoin hit a new all-time high of $120,000 today driven by record ETF inflows and growing institutional treasury allocations. Analysts predict further upside as supply-side pressure intensifies post-halving.",
    url: "https://coindesk.com",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80",
    source: "CoinDesk",
    publishedAt: new Date(Date.now() - 3_600_000).toISOString(),
    content: "",
  },
  {
    title: "Apple Vision Pro 2: Leaked Specs Show 40% Weight Reduction and Standalone Mode",
    description:
      "Internal supply chain documents reveal Apple's second-generation spatial computer will weigh just 280g — nearly half the original — while introducing a standalone mode that eliminates the external battery pack.",
    url: "https://9to5mac.com",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    source: "9to5Mac",
    publishedAt: new Date(Date.now() - 7_200_000).toISOString(),
    content: "",
  },
  {
    title: "Y Combinator-Backed Startup Raises $80M to Build AI-Powered Legal Research Tools",
    description:
      "LexAI, a stealth startup backed by Y Combinator and Sequoia, emerged from stealth with an $80 million Series A to disrupt the $37 billion legal research market using large language models fine-tuned on case law.",
    url: "https://techcrunch.com",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    source: "VentureBeat",
    publishedAt: new Date(Date.now() - 10_800_000).toISOString(),
    content: "",
  },
  {
    title: "Google DeepMind AlphaCode 3 Outperforms 99.5% of Human Competitive Programmers",
    description:
      "DeepMind's third iteration of AlphaCode has achieved a competitive programming ranking that surpasses virtually all human participants on Codeforces, raising fundamental questions about the future of software engineering.",
    url: "https://deepmind.com",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
    source: "The Verge",
    publishedAt: new Date(Date.now() - 14_400_000).toISOString(),
    content: "",
  },
  {
    title: "Samsung Galaxy S26 Ultra Ships with Real-Time Neural Translation in 52 Languages",
    description:
      "Samsung's flagship Galaxy S26 Ultra introduces on-device neural translation covering 52 languages with sub-200ms latency, powered by a new dedicated language processing unit built into the Snapdragon X Elite chip.",
    url: "https://samsung.com",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
    source: "Android Authority",
    publishedAt: new Date(Date.now() - 18_000_000).toISOString(),
    content: "",
  },
  {
    title: "Ethereum Layer-2 Daily Transactions Exceed Ethereum Mainnet for the First Time",
    description:
      "Layer-2 networks including Arbitrum, Optimism, and Base collectively processed more daily transactions than the Ethereum mainnet — a milestone that signals the success of Ethereum's rollup-centric scaling roadmap.",
    url: "https://ethereum.org",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    source: "Decrypt",
    publishedAt: new Date(Date.now() - 21_600_000).toISOString(),
    content: "",
  },
  {
    title: "NVIDIA Blackwell B300 GPU Delivers 3x Inference Speed over H100 at Same Power Budget",
    description:
      "NVIDIA's next-generation B300 AI GPU has been benchmarked internally with results showing 3× inference throughput improvements for transformer models while operating within the same 700W TDP envelope as the H100 SXM.",
    url: "https://nvidia.com",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    source: "AnandTech",
    publishedAt: new Date(Date.now() - 25_200_000).toISOString(),
    content: "",
  },
  {
    title: "Anthropic's Claude 4 Sets New State-of-the-Art on Every Major AI Safety Benchmark",
    description:
      "Anthropic released Claude 4 with unprecedented performance on alignment, helpfulness, and harmlessness benchmarks. The model achieves Constitutional AI 2.0 compliance and reportedly refuses harmful tasks with 99.8% reliability.",
    url: "https://anthropic.com",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    source: "MIT Technology Review",
    publishedAt: new Date(Date.now() - 28_800_000).toISOString(),
    content: "",
  },
  {
    title: "Sony's New OLED Gaming Monitor Achieves 240Hz at 4K with 0.03ms Response Time",
    description:
      "Sony's INZONE M9 Pro gaming monitor pushes display technology forward with a 4K 240Hz OLED panel achieving 0.03ms grey-to-grey response time, native HDR 2000 nits, and dedicated PS5/Xbox Series X optimization modes.",
    url: "https://sony.com",
    image: "https://images.unsplash.com/photo-1593640408182-31c228f8c667?w=800&q=80",
    source: "Digital Trends",
    publishedAt: new Date(Date.now() - 32_400_000).toISOString(),
    content: "",
  },
  {
    title: "Microsoft Azure Launches Quantum-Safe Encryption Services for Enterprise Cloud",
    description:
      "Microsoft is now offering post-quantum cryptography as a managed service on Azure, enabling enterprises to migrate to NIST-standardized quantum-resistant algorithms without rebuilding their existing key management systems.",
    url: "https://azure.microsoft.com",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    source: "ZDNet",
    publishedAt: new Date(Date.now() - 36_000_000).toISOString(),
    content: "",
  },
  {
    title: "Robotic Surgery Startup Receives FDA Clearance for Autonomous Soft-Tissue Operations",
    description:
      "Autonomy Surgical received FDA 510(k) clearance for its CASPAR robotic system — the first to perform supervised autonomous soft-tissue procedures including cholecystectomy. Clinical trials showed complication rates 34% below human baselines.",
    url: "https://techcrunch.com",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
    source: "STAT News",
    publishedAt: new Date(Date.now() - 39_600_000).toISOString(),
    content: "",
  },
];

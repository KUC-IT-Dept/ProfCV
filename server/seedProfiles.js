/**
 * seedProfiles.js — Seeds rich Profile documents for every user in the DB.
 * Run: node server/seedProfiles.js
 * Safe to re-run — upserts by userId so no duplicates.
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  const users = await User.find({});
  if (users.length === 0) {
    console.error('❌ No users found. Run `node server/seed.js` first.');
    process.exit(1);
  }

  const byEmail = {};
  users.forEach(u => { byEmail[u.email] = u; });

  const profiles = [
    // ─────────────────────────────────────────────────────────────────────────
    // Dr. Jane Smith — teacher@profcv.edu (TEACHER, CS)
    // ─────────────────────────────────────────────────────────────────────────
    {
      email: 'teacher@profcv.edu',
      bio: 'Dr. Jane Smith is an Associate Professor in the Department of Computer Science with over 12 years of experience in academia and industry. Her research focuses on distributed systems, cloud computing, and human-computer interaction. She is a recipient of the National Science Foundation CAREER Award and has led numerous funded research projects.',
      headline: 'Associate Professor of Computer Science | Distributed Systems & Cloud Research',
      subjects: ['Data Structures & Algorithms', 'Distributed Systems', 'Cloud Computing', 'Operating Systems', 'Advanced Algorithms'],
      qualifications: [
        { degree: 'Ph.D. in Computer Science', institution: 'MIT (Massachusetts Institute of Technology)', year: '2013', grade: 'Summa Cum Laude' },
        { degree: 'M.S. in Computer Science', institution: 'Stanford University', year: '2009', grade: 'GPA: 4.0/4.0' },
        { degree: 'B.Tech in Computer Engineering', institution: 'IIT Delhi', year: '2007', grade: 'First Class with Distinction' },
      ],
      publications: [
        { title: 'AutoScale: Intelligent Workload-Aware Auto-Scaling in Distributed Cloud Environments', journal: 'IEEE Transactions on Cloud Computing', year: '2023', doi: '10.1109/TCC.2023.1234567', url: 'https://ieeexplore.ieee.org/document/1234567' },
        { title: 'Latency-Optimal Data Placement in Edge-Cloud Hybrid Architectures', journal: 'ACM SIGCOMM 2022', year: '2022', doi: '10.1145/3544216.3544219', url: 'https://dl.acm.org/doi/10.1145/3544216' },
        { title: 'Fault-Tolerant Consensus in Byzantine Distributed Ledgers', journal: 'Journal of Parallel and Distributed Computing', year: '2021', doi: '10.1016/j.jpdc.2021.03.012', url: 'https://www.sciencedirect.com/science/article/pii/S0743731521' },
        { title: 'A Survey on Container Orchestration in Kubernetes-based Microservice Architectures', journal: 'ACM Computing Surveys', year: '2020', doi: '10.1145/3388440', url: 'https://dl.acm.org/doi/10.1145/3388440' },
        { title: 'Energy-Efficient Task Scheduling in Heterogeneous Cloud Data Centers', journal: 'Future Generation Computer Systems', year: '2019', doi: '10.1016/j.future.2019.01.044', url: 'https://www.sciencedirect.com/science/article/pii/S0167739X19' },
      ],
      projects: [
        { title: 'CloudSense: Real-Time Anomaly Detection in Multi-Cloud Deployments', description: 'A funded NSF project developing ML-driven anomaly detection pipelines for multi-cloud environments. Achieved 94.7% detection accuracy across 1M+ events/sec. Collaborators: MIT CSAIL, Google Cloud Research.', year: '2022', url: 'https://github.com/janesmith/cloudsense' },
        { title: 'EdgeMesh: Federated Learning over Heterogeneous Edge Networks', description: 'Designed a privacy-preserving federated learning framework deployable on resource-constrained IoT edge nodes. Published at ICLR 2023 workshop. Funded by DARPA.', year: '2023', url: 'https://edgemesh.cs.profcv.edu' },
        { title: 'Adaptive Resource Broker for Green HPC Clusters', description: 'Built a DVFS-aware resource broker reducing energy consumption by 38% in high-performance computing clusters while maintaining 99.9% SLA compliance.', year: '2020', url: 'https://github.com/janesmith/green-hpc' },
      ],
      customDetails: [
        { sectionTitle: 'Awards & Honors', content: '• NSF CAREER Award (2021) — $512,000 for distributed systems research\n• Best Paper Award — IEEE Cloud 2022\n• Excellence in Teaching Award — Dept. of CS, 2020 & 2022\n• Women in Tech Research Fellowship — ACM-W, 2018\n• Outstanding Dissertation Award — MIT EECS Department, 2013' },
        { sectionTitle: 'Professional Service', content: '• Program Committee Member — OSDI 2023, EuroSys 2022, ATC 2021\n• Reviewer — IEEE TPDS, ACM TOCS, USENIX ATC\n• Session Chair — SOSP 2022\n• Mentor — CRA-WP Grad Cohort for Women 2019–Present' },
        { sectionTitle: 'Invited Talks & Keynotes', content: '• Keynote: "Rethinking Resource Management in the Age of Edge AI" — CloudConf 2023, San Francisco\n• Invited Talk: "Byzantine Fault Tolerance at Scale" — Dagstuhl Seminar 23101, Germany, 2023\n• Panel Speaker: "Women Leaders in Systems Research" — USENIX LISA 2022' },
        { sectionTitle: 'Grants & Funding', content: '• NSF CNS-2134567: $512,000 — Intelligent Auto-Scaling for Distributed Systems (PI) 2021–2025\n• DARPA HR001123C0042: $1.2M — Federated Learning on Edge Networks (Co-PI) 2022–2024\n• Google Faculty Research Award: $60,000 — Cloud Workload Characterization (PI) 2020' },
        { sectionTitle: 'PhD Students Supervised', content: '• Alex Chen (2020–Present) — Thesis: Serverless Cold-Start Optimization\n• Priya Nair (2019–2023) — Thesis: Byzantine-Resilient Consensus (Now: Postdoc @ CMU)\n• Rahul Gupta (2018–2022) — Thesis: Energy-Aware HPC Scheduling (Now: Google Research)' },
      ],
      media: {
        attachments: [
          { name: 'Dr_Jane_Smith_CV_2024.pdf', url: '/uploads/dr_jane_smith_cv.pdf', fileType: 'application/pdf', sizeKB: 248 },
          { name: 'Research_Statement_2024.pdf', url: '/uploads/research_statement.pdf', fileType: 'application/pdf', sizeKB: 185 },
          { name: 'Teaching_Portfolio.pdf', url: '/uploads/teaching_portfolio.pdf', fileType: 'application/pdf', sizeKB: 312 },
        ],
        videoEmbeds: [
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          'https://www.youtube.com/watch?v=9bZkp7q19f0',
        ],
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Prof. Alan Turing — turing@profcv.edu (TEACHER, CS)
    // ─────────────────────────────────────────────────────────────────────────
    {
      email: 'turing@profcv.edu',
      bio: 'Prof. Turing is a Full Professor of Computer Science specializing in theoretical computer science, computational complexity, and artificial intelligence. He has published over 70 peer-reviewed papers and his work on decidability has been cited over 8,000 times. He serves as the Director of the Theoretical AI Lab.',
      headline: 'Full Professor | Theoretical CS, Complexity Theory & AI Foundations',
      subjects: ['Theory of Computation', 'Computational Complexity', 'Artificial Intelligence', 'Discrete Mathematics', 'Machine Learning Theory'],
      qualifications: [
        { degree: 'D.Phil. in Mathematics', institution: 'University of Oxford', year: '1998', grade: 'First Class' },
        { degree: 'M.Sc. in Computer Science', institution: 'University of Cambridge', year: '1994', grade: 'Distinction' },
        { degree: 'B.Sc. in Mathematics & CS', institution: 'University of Edinburgh', year: '1992', grade: 'First Class Honours' },
      ],
      publications: [
        { title: 'On the Computational Limits of Large Language Models: A Complexity-Theoretic Perspective', journal: 'Journal of the ACM', year: '2023', doi: '10.1145/3580305.3599323', url: 'https://dl.acm.org/doi/10.1145/3580305' },
        { title: 'Circuit Complexity Lower Bounds for Transformer Architectures', journal: 'STOC 2022 Proceedings', year: '2022', doi: '10.1145/3519935.3520040', url: 'https://dl.acm.org/doi/10.1145/3519935' },
        { title: 'PAC-Learning with Approximate Oracles under Distribution Shift', journal: 'NeurIPS 2021', year: '2021', doi: '10.48550/arXiv.2109.12345', url: 'https://proceedings.neurips.cc/paper/2021' },
        { title: 'Decidability Boundaries in Neural Network Verification', journal: 'LICS 2020', year: '2020', doi: '10.1145/3373718.3394779', url: 'https://dl.acm.org/doi/10.1145/3373718' },
      ],
      projects: [
        { title: 'THEORAI: Complexity-Theoretic Foundations of Modern AI Systems', description: 'An ERC-funded project investigating when and why deep learning generalizes, using tools from computational complexity, PAC-learning, and information theory.', year: '2021', url: 'https://theorai.cs.profcv.edu' },
        { title: 'Formal Verification of Safety-Critical Neural Networks', description: 'Developing decidable fragments of neural network property verification using SAT/SMT solvers and abstract interpretation. Collaboration with Airbus Research.', year: '2023', url: 'https://nn-verify.cs.profcv.edu' },
      ],
      customDetails: [
        { sectionTitle: 'Awards & Recognition', content: '• Turing Award Nominee — ACM (2022)\n• Royal Academy of Engineering Fellowship — FREng (2019)\n• EATCS Presburger Award (2015)\n• Best Paper — FOCS 2018, STOC 2014\n• ERC Advanced Grant: €2.5M (2021)' },
        { sectionTitle: 'Editorial Boards', content: '• Editor-in-Chief — Computational Complexity (Springer), 2020–Present\n• Associate Editor — SIAM Journal on Computing, 2017–Present\n• Guest Editor — Special Issue on AI Theory, Journal of the ACM, 2023' },
        { sectionTitle: 'Patents', content: '• US Patent 11,234,567: "Method for Efficient SAT-Based Verification of Recurrent Neural Networks" (2022)\n• EU Patent EP3,987,654: "Complexity-Aware Neural Architecture Search Algorithm" (2021)' },
      ],
      media: {
        attachments: [
          { name: 'Professor_Turing_Full_CV.pdf', url: '/uploads/turing_cv.pdf', fileType: 'application/pdf', sizeKB: 420 },
          { name: 'THEORAI_Project_Summary.pdf', url: '/uploads/theorai_summary.pdf', fileType: 'application/pdf', sizeKB: 156 },
        ],
        videoEmbeds: [
          'https://www.youtube.com/watch?v=aircAruvnKk',
        ],
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Dr. Marie Curie — curie@profcv.edu (TEACHER, Physics)
    // ─────────────────────────────────────────────────────────────────────────
    {
      email: 'curie@profcv.edu',
      bio: 'Dr. Marie Curie is an Assistant Professor in the Department of Physics. Her experimental research focuses on quantum materials, superconductivity, and 2D heterostructures. She completed a prestigious Marie Skłodowska-Curie Fellowship at CERN before joining the faculty. She runs the Quantum Materials Lab with state-of-the-art cryogenic equipment.',
      headline: 'Assistant Professor of Physics | Quantum Materials & Superconductivity Lab',
      subjects: ['Quantum Mechanics', 'Condensed Matter Physics', 'Electromagnetism', 'Statistical Mechanics', 'Laboratory Physics I & II'],
      qualifications: [
        { degree: 'Ph.D. in Experimental Physics', institution: 'ETH Zürich', year: '2017', grade: 'Summa Cum Laude' },
        { degree: 'M.Sc. in Physics', institution: 'University of Paris-Saclay', year: '2013', grade: 'Mention Très Bien' },
        { degree: 'B.Sc. in Physics', institution: 'University of Warsaw', year: '2011', grade: 'First Class Honours' },
      ],
      publications: [
        { title: 'Unconventional Superconductivity in Twisted Bilayer Graphene at 1.1° Magic Angle', journal: 'Nature Physics', year: '2023', doi: '10.1038/s41567-023-02156-7', url: 'https://www.nature.com/articles/s41567-023-02156' },
        { title: 'Topological Phase Transitions in WTe₂/MoSe₂ van der Waals Heterostructures', journal: 'Physical Review Letters', year: '2022', doi: '10.1103/PhysRevLett.128.186802', url: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.128.186802' },
        { title: 'High-Temperature Superconductivity in Hydrogen Sulfide Under Megabar Pressure', journal: 'Science', year: '2021', doi: '10.1126/science.abh3164', url: 'https://www.science.org/doi/10.1126/science.abh3164' },
      ],
      projects: [
        { title: 'Quantum Materials Lab: 2D Heterostructure Engineering', description: 'Designing and characterizing novel 2D material heterostructures for quantum computing applications. Funded by DST-SERB with ₹2.4 Cr grant. Access to 4K dilution refrigerator and UHV-STM.', year: '2021', url: 'https://qmlab.physics.profcv.edu' },
        { title: 'High-Entropy Alloys for Room-Temperature Superconductivity', description: 'Exploring compositionally complex alloy spaces using combinatorial materials science and DFT simulations to identify candidates for room-temperature superconductivity.', year: '2023', url: 'https://github.com/mcurie/hea-supercon' },
      ],
      customDetails: [
        { sectionTitle: 'Fellowships & Awards', content: '• Marie Skłodowska-Curie Individual Fellowship — European Commission (2018–2020)\n• DST INSPIRE Faculty Award (2021)\n• L\'Oréal-UNESCO For Women in Science National Fellowship (2022)\n• Best Poster — Condensed Matter Physics Conference, APS March Meeting 2023' },
        { sectionTitle: 'Lab Equipment & Facilities', content: '• Dilution Refrigerator (Oxford Instruments Triton 200) — Base temperature: 7 mK\n• UHV-STM/AFM System (Omicron) — Atomic resolution imaging\n• Molecular Beam Epitaxy (MBE) — 2D material growth\n• PPMS (Physical Property Measurement System) — Quantum Design' },
        { sectionTitle: 'Science Outreach', content: '• "Physics for All" — Annual public lecture series for school students (2021–Present)\n• Women in STEM mentoring program — Mentored 15 undergraduate women (2022–Present)\n• Science communicator for CSIR social media channels (50K followers)' },
      ],
      media: {
        attachments: [
          { name: 'Curie_CV_April2024.pdf', url: '/uploads/curie_cv.pdf', fileType: 'application/pdf', sizeKB: 198 },
          { name: 'QML_Lab_Brochure.pdf', url: '/uploads/qml_brochure.pdf', fileType: 'application/pdf', sizeKB: 2450 },
        ],
        videoEmbeds: [
          'https://www.youtube.com/watch?v=WiTgn5QH_HU',
        ],
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Prof. Isaac Newton — newton@profcv.edu (TEACHER, Physics)
    // ─────────────────────────────────────────────────────────────────────────
    {
      email: 'newton@profcv.edu',
      bio: 'Prof. Isaac Newton is a Professor of Applied Physics and the founding director of the Centre for Computational Astrophysics. With 25 years of research experience, he has contributed foundational work in gravitational wave detection, numerical relativity, and planetary dynamics simulations. He is a Fellow of the Royal Society.',
      headline: 'Professor of Applied Physics | Gravitational Waves, Astrophysics & Numerical Relativity',
      subjects: ['Classical Mechanics', 'Mathematical Physics', 'Astrophysics', 'General Relativity', 'Computational Physics'],
      qualifications: [
        { degree: 'Ph.D. in Astrophysics', institution: 'Caltech', year: '1999', grade: 'Highest Distinction' },
        { degree: 'M.Sc. in Applied Mathematics', institution: 'University of Cambridge', year: '1995', grade: 'First Class' },
        { degree: 'B.Sc. in Physics', institution: 'Trinity College, Dublin', year: '1993', grade: 'First Class Honours' },
      ],
      publications: [
        { title: 'Multi-Messenger Astrophysics: Correlating LIGO-O4 Events with Fermi-GBM Gamma-Ray Bursts', journal: 'The Astrophysical Journal Letters', year: '2023', doi: '10.3847/2041-8213/acb7f9', url: 'https://iopscience.iop.org/article/10.3847/2041-8213/acb7f9' },
        { title: 'Spinning Black Hole Mergers in Dense Star Clusters: A Monte Carlo Study', journal: 'Monthly Notices of the Royal Astronomical Society', year: '2022', doi: '10.1093/mnras/stac1892', url: 'https://academic.oup.com/mnras/article/515/2/2802' },
        { title: 'Numerical Relativity Simulations of Binary Neutron Star Mergers with Exotic Equations of State', journal: 'Physical Review D', year: '2021', doi: '10.1103/PhysRevD.104.084060', url: 'https://journals.aps.org/prd/abstract/10.1103/PhysRevD.104.084060' },
        { title: 'Early-Warning Gravitational Wave Detection using Neural Network Matched Filtering', journal: 'Nature Astronomy', year: '2020', doi: '10.1038/s41550-020-01295-8', url: 'https://www.nature.com/articles/s41550-020-01295' },
      ],
      projects: [
        { title: 'LIGO-India Science Data Analysis Pipeline', description: 'Leading the software and data analysis working group for the upcoming LIGO-India (INDIGO) detector. Developing matched-filter template banks and Bayesian parameter estimation frameworks.', year: '2022', url: 'https://www.ligo-india.in' },
        { title: 'N-Body Simulations of Galaxy Cluster Formation with Dark Matter Self-Interaction', description: 'Running petascale hydrodynamical cosmological simulations on the PARAM Ganga supercomputer to constrain dark matter self-interaction cross-sections.', year: '2023', url: 'https://github.com/inewton/nbody-tidm' },
        { title: 'Exoplanet Atmospheric Characterization via Transit Spectroscopy', description: 'Collaborating with JWST teams to characterize atmospheres of 12 confirmed exoplanets in the habitable zone using near-infrared transmission spectroscopy.', year: '2021', url: 'https://exoatm.physics.profcv.edu' },
      ],
      customDetails: [
        { sectionTitle: 'Honours & Fellowships', content: '• Fellow of the Royal Society — FRS (2018)\n• Fellow of the American Physical Society — FAPS (2015)\n• Shanti Swarup Bhatnagar Prize in Physical Sciences (2017)\n• J.C. Bose National Fellowship (2019)\n• Infosys Prize in Physical Sciences (2016)' },
        { sectionTitle: 'PhD Students & Postdocs (Current)', content: '• Sunita Rao (PhD 2021–Present) — LIGO matched-filter algorithms\n• Diego Gomez (PhD 2022–Present) — Dark matter simulations\n• Dr. Ankita Verma (Postdoc 2023–Present) — Binary neutron star EOS\n• Dr. Kwame Asante (Postdoc 2022–Present) — Multi-messenger astrophysics' },
        { sectionTitle: 'Popular Science & Media', content: '• "Listening to the Universe" — TEDx Talk, 1.2M views (2021)\n• Regular contributor: Scientific American, Physics Today, Resonance Journal\n• BBC Radio 4 interview: "Gravitational Waves and the New Astronomy" (2020)\n• Book: "Ripples in Spacetime: A Primer on Gravitational Waves" (OUP, 2022, ISBN: 978-0-19-886123-4)' },
        { sectionTitle: 'Computational Resources', content: '• PI-level access: PARAM Ganga HPC (1.66 PetaFLOP/s) — DST allocation 2023\n• LIGO Computing Grid — 40,000 CPU cores, dedicated allocation\n• AWS Research Credits: $150,000/year (2022–2024)\n• National Supercomputing Mission (NSM) allocation — 5M CPU-hours/year' },
      ],
      media: {
        attachments: [
          { name: 'Newton_Academic_CV.pdf', url: '/uploads/newton_cv.pdf', fileType: 'application/pdf', sizeKB: 534 },
          { name: 'Research_Overview_Slides.pdf', url: '/uploads/newton_research_slides.pdf', fileType: 'application/pdf', sizeKB: 3120 },
        ],
        videoEmbeds: [
          'https://www.youtube.com/watch?v=IMdPTUf6AnI',
          'https://www.youtube.com/watch?v=jey_CzIOfYE',
        ],
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // HOD CS — hod_cs@profcv.edu
    // ─────────────────────────────────────────────────────────────────────────
    {
      email: 'hod_cs@profcv.edu',
      bio: 'Head of the Department of Computer Science with extensive experience in academic administration, curriculum design, and faculty development. Research expertise in software engineering, formal methods, and CS education.',
      headline: 'Head of Department — Computer Science | Software Engineering & Formal Methods',
      subjects: ['Software Engineering', 'Formal Methods', 'Program Verification', 'CS Education'],
      qualifications: [
        { degree: 'Ph.D. in Software Engineering', institution: 'Carnegie Mellon University', year: '2005', grade: 'Distinction' },
        { degree: 'M.Sc. in Computer Science', institution: 'IISc Bangalore', year: '2001', grade: 'First Rank' },
        { degree: 'B.E. in Computer Engineering', institution: 'BITS Pilani', year: '1999', grade: 'CGPA 9.7/10' },
      ],
      publications: [
        { title: 'Model-Driven Engineering for Reliable Distributed Software Systems', journal: 'IEEE Transactions on Software Engineering', year: '2022', doi: '10.1109/TSE.2022.3187654', url: 'https://ieeexplore.ieee.org/document/9821562' },
        { title: 'Formal Specification and Verification of RESTful Microservice Contracts', journal: 'ICSE 2021', year: '2021', doi: '10.1109/ICSE43902.2021.00012', url: 'https://ieeexplore.ieee.org/document/9402036' },
      ],
      projects: [
        { title: 'CS Curriculum Redesign 2024: Industry-Academia Integration', description: 'Leading a comprehensive redesign of the CS undergraduate curriculum integrating industry mentorship, capstone projects with 25 partner companies, and a new AI/ML specialization track.', year: '2024', url: 'https://cs.profcv.edu/curriculum2024' },
      ],
      customDetails: [
        { sectionTitle: 'Administrative Roles', content: '• Head of Department, Computer Science — 2019–Present\n• Board of Studies Chair — School of Engineering, 2020–Present\n• Member, Academic Council — University, 2021–Present\n• Coordinator, NBA Accreditation — CS Dept, 2022 (Accredited with Distinction)' },
        { sectionTitle: 'Industry Collaborations', content: '• Academic Partner: Microsoft Research India, Google, Adobe Systems, TCS Research\n• MoU Signed: 12 industry partners for internship and research collaboration\n• Industry Advisory Board: 8 CXO-level members from top tech companies' },
      ],
      media: {
        attachments: [
          { name: 'HOD_CS_Profile.pdf', url: '/uploads/hod_cs_profile.pdf', fileType: 'application/pdf', sizeKB: 187 },
        ],
        videoEmbeds: [],
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // HOD Physics — hod_phy@profcv.edu
    // ─────────────────────────────────────────────────────────────────────────
    {
      email: 'hod_phy@profcv.edu',
      bio: "Head of the Department of Physics with a distinguished career in experimental condensed matter physics. Leads the department's strategic research initiatives and has established three fully equipped research labs. A passionate advocate for interdisciplinary science education.",
      headline: 'Head of Department — Physics | Condensed Matter & Materials Science',
      subjects: ['Condensed Matter Physics', 'Materials Science', 'Solid State Physics', 'Advanced Quantum Mechanics'],
      qualifications: [
        { degree: 'Ph.D. in Condensed Matter Physics', institution: 'IISc Bangalore', year: '2000', grade: 'Excellent' },
        { degree: 'M.Sc. in Physics', institution: 'University of Hyderabad', year: '1996', grade: 'First Class, Gold Medalist' },
        { degree: 'B.Sc. in Physics', institution: 'Presidency College, Chennai', year: '1994', grade: 'First Class with Distinction' },
      ],
      publications: [
        { title: 'Giant Magnetoresistance in Perovskite Manganite Thin Films: Substrate Strain Engineering', journal: 'Physical Review B', year: '2022', doi: '10.1103/PhysRevB.106.174421', url: 'https://journals.aps.org/prb/abstract/10.1103/PhysRevB.106.174421' },
        { title: 'Spin-Orbit Coupling Driven Topological Transitions in Oxide Heterointerfaces', journal: 'Advanced Materials', year: '2021', doi: '10.1002/adma.202105643', url: 'https://onlinelibrary.wiley.com/doi/10.1002/adma.202105643' },
      ],
      projects: [
        { title: 'Centre for Advanced Materials Research (CAMR)', description: 'Established and directing the CAMR with ₹15 Cr DST-FIST funding. Hosts researchers from 3 departments and has produced 45 publications since inception in 2019.', year: '2019', url: 'https://camr.physics.profcv.edu' },
      ],
      customDetails: [
        { sectionTitle: 'Administrative Contributions', content: '• Head of Department, Physics — 2020–Present\n• Coordinator, NAAC Self-Study Report — Natural Sciences Cluster, 2023\n• Dean Academic Affairs (Acting) — 2021 Q3\n• Member, Equipment Purchase Committee — University, 2019–Present' },
        { sectionTitle: 'Research Group', content: '• 4 PhD Students (active)\n• 2 Postdoctoral Researchers\n• 3 M.Sc. Project Students\n• Annual group publications: 6–8 papers in high-impact journals' },
      ],
      media: {
        attachments: [
          { name: 'HOD_Physics_CV.pdf', url: '/uploads/hod_physics_cv.pdf', fileType: 'application/pdf', sizeKB: 204 },
        ],
        videoEmbeds: ['https://www.youtube.com/watch?v=Q1ni5f2g1gE'],
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // VC — vc@profcv.edu
    // ─────────────────────────────────────────────────────────────────────────
    {
      email: 'vc@profcv.edu',
      bio: 'The Vice Chancellor brings over 30 years of experience in higher education leadership, strategic planning, and research governance. Has led institutional transformations resulting in the university entering the QS World University Rankings Top 500. A published scholar in educational policy and research management.',
      headline: 'Vice Chancellor | Strategic Leadership in Higher Education & Research Governance',
      subjects: ['Higher Education Policy', 'Research Management', 'Academic Leadership'],
      qualifications: [
        { degree: 'Ph.D. in Education Policy', institution: 'Harvard Graduate School of Education', year: '1994', grade: 'Distinction' },
        { degree: 'M.B.A.', institution: 'IIM Ahmedabad', year: '1990', grade: 'Gold Medalist' },
        { degree: 'M.A. in Economics', institution: 'Delhi School of Economics', year: '1988', grade: 'First Class' },
        { degree: 'B.A. (Honours) Economics', institution: 'St. Stephen\'s College, Delhi', year: '1986', grade: 'First Class' },
      ],
      publications: [
        { title: 'Reimagining the Research University: Strategies for Global Competitiveness in Emerging Economies', journal: 'Higher Education Quarterly', year: '2023', doi: '10.1111/hequ.12423', url: 'https://onlinelibrary.wiley.com/doi/10.1111/hequ.12423' },
        { title: 'Faculty Development and Retention Strategies in Indian Technical Universities', journal: 'Journal of Higher Education Policy and Management', year: '2021', doi: '10.1080/1360080X.2021.1934256', url: 'https://www.tandfonline.com/doi/full/10.1080/1360080X.2021.1934256' },
      ],
      projects: [
        { title: 'University Excellence Initiative 2030', description: 'Flagship strategic plan: 10-year roadmap to achieve Top-200 QS ranking, ₹500 Cr research funding target, 20 Centre of Excellence, and 5 international branch campuses.', year: '2023', url: 'https://vc.profcv.edu/excellence2030' },
        { title: 'Industry Partnership & Incubation Ecosystem', description: 'Established Technology Business Incubator recognized by DST-NSTEDB. 65+ startups incubated, ₹120 Cr equity raised by portfolio companies, 4 unicorn exits.', year: '2020', url: 'https://incubator.profcv.edu' },
      ],
      customDetails: [
        { sectionTitle: 'Leadership & Governance', content: '• Vice Chancellor, Prof CV University — 2019–Present\n• Member, UGC Standing Committee on Policy (2022–Present)\n• Board Member, Association of Indian Universities (2021–Present)\n• Governing Council Member, IIM Trichy (2020–Present)\n• Advisor, Ministry of Education — NEP Implementation Committee (2020–2022)' },
        { sectionTitle: 'Institutional Achievements Under Leadership', content: '• QS World Rankings: Entered Top 600 (2021), Top 500 (2023) — first in state history\n• Research funding: Grew from ₹45 Cr to ₹280 Cr annually (2019–2023)\n• Faculty recruited: 128 international faculty including 12 IIT/IISc alumni\n• New Schools established: AI & Data Science, Entrepreneurship, Policy Studies\n• NBA Accreditation: 18/18 eligible programs accredited (2022)' },
        { sectionTitle: 'Speaking Engagements', content: '• World Economic Forum, Davos — Panel: "Future of Education" (2023)\n• G20 Education Working Group — Presented India\'s NEP outcomes (2023)\n• Times Higher Education Asia Summit — Keynote (2022)\n• QS Subject Focus Summit — Speaker (2021)' },
      ],
      media: {
        attachments: [
          { name: 'VC_Official_Profile.pdf', url: '/uploads/vc_profile.pdf', fileType: 'application/pdf', sizeKB: 289 },
          { name: 'Excellence2030_Brochure.pdf', url: '/uploads/excellence2030.pdf', fileType: 'application/pdf', sizeKB: 4850 },
        ],
        videoEmbeds: ['https://www.youtube.com/watch?v=szXhs935q9o'],
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Super Admin — admin@profcv.edu
    // ─────────────────────────────────────────────────────────────────────────
    {
      email: 'admin@profcv.edu',
      bio: 'System Administrator for the Prof CV platform with full oversight of all institutional data, user accounts, and system configuration.',
      headline: 'Super Administrator — Prof CV Platform',
      subjects: [],
      qualifications: [
        { degree: 'M.Tech in Information Technology', institution: 'NIT Trichy', year: '2010', grade: 'First Class' },
        { degree: 'B.E. in Computer Science', institution: 'Anna University', year: '2008', grade: 'First Class' },
      ],
      publications: [],
      projects: [
        { title: 'Prof CV Platform — System Architecture & Deployment', description: 'Designed and deployed the Prof CV MERN-stack platform serving 500+ faculty. Includes role-based access control, automated backups, and CI/CD pipeline on AWS.', year: '2024', url: 'https://admin.profcv.edu' },
      ],
      customDetails: [
        { sectionTitle: 'System Access & Permissions', content: '• Full CRUD access to all user accounts and profiles\n• Database administration (MongoDB Atlas)\n• API key management and JWT configuration\n• Audit log access' },
      ],
      media: { attachments: [], videoEmbeds: [] },
    },
  ];

  let created = 0, updated = 0;

  for (const pd of profiles) {
    const user = byEmail[pd.email];
    if (!user) {
      console.log(`  ⚠️  Skipped (user not found): ${pd.email}`);
      continue;
    }

    const { email, ...profileData } = pd;

    const existing = await Profile.findOne({ user: user._id });
    if (existing) {
      await Profile.findOneAndUpdate({ user: user._id }, { $set: profileData }, { runValidators: true });
      console.log(`  🔄 Updated:  ${email} [${user.role}]${profileData.publications?.length ? ` — ${profileData.publications.length} pubs` : ''}`);
      updated++;
    } else {
      await Profile.create({ user: user._id, ...profileData });
      console.log(`  ✅ Created:  ${email} [${user.role}]${profileData.publications?.length ? ` — ${profileData.publications.length} pubs` : ''}`);
      created++;
    }
  }

  console.log(`\n🌱 Profile seed complete — ${created} created, ${updated} updated.`);
  await mongoose.disconnect();
  console.log('🔌 Disconnected.');
}

seed().catch((err) => {
  console.error('❌ Seed error:', err.message);
  process.exit(1);
});

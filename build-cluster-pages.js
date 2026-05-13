// node build-cluster-pages.js — generates all 7 cluster HTML pages
const fs = require('fs');
const _raw = JSON.parse(fs.readFileSync('cluster-image-urls.json','utf8'));
// Normalize both JSON formats (array or {name, subsectors:[]} object)
const imgUrls = {};
for (const [k,v] of Object.entries(_raw)) {
  imgUrls[k] = Array.isArray(v) ? v : (v.subsectors || []);
}
const logoUrls = JSON.parse(fs.readFileSync('logo-urls.json','utf8'));

const BPS_LOGO    = logoUrls['bps101'];
const LIB_LOGO    = logoUrls['batavia-library'];
const ORGANIC_LOGO= logoUrls['organic-life'];

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxeHACK_6TtpOYYpo32qM5AGa962uiHOnE8-UF13x8hDqjeozKwpXbYtL7bOqTbZoBwNg/exec';

// ─── CLUSTER DEFINITIONS ───────────────────────────────────────────────────
const CLUSTERS = {
  agriculture: {
    title: 'Agriculture, Food & Natural Resources',
    tagline: 'Feed the world. Protect the planet. Grow your future.',
    description: 'From sustainable farming and food science to environmental stewardship and veterinary care — this cluster connects you to the essential systems that feed our communities and protect our natural world.',
    color: '#2d6a4f',
    accentLight: '#d8f3dc',
    subsectors: [
      { label: 'Agriculture & Farming',  url: imgUrls.agriculture[0].url },
      { label: 'Food Science',           url: imgUrls.agriculture[1].url },
      { label: 'Environmental Science',  url: imgUrls.agriculture[2].url },
      { label: 'Horticulture',           url: imgUrls.agriculture[3].url },
      { label: 'Veterinary Science',     url: imgUrls.agriculture[4].url },
    ],
    competencies: ['Sustainable farming practices','Food safety & quality control','Environmental stewardship','Agricultural technology','Natural resource conservation'],
    careers: ['Agricultural Scientist','Farm Manager','Food Inspector','Environmental Technician','Landscape Architect','Veterinary Assistant'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  },
  arts: {
    title: 'Arts & Communication',
    tagline: 'Tell stories. Shape culture. Make an impact.',
    description: 'Graphic design, journalism, film, photography, and marketing — this cluster is for students who think visually, communicate boldly, and want to build careers around creativity and storytelling.',
    color: '#7b2d8b',
    accentLight: '#f3e8ff',
    subsectors: [
      { label: 'Graphic Design',          url: imgUrls.arts[0].url },
      { label: 'Journalism & Media',      url: imgUrls.arts[1].url },
      { label: 'Photography',             url: imgUrls.arts[2].url },
      { label: 'Film & Video Production', url: imgUrls.arts[3].url },
      { label: 'Marketing & Advertising', url: imgUrls.arts[4].url },
    ],
    competencies: ['Visual design principles','Digital media production','Written & verbal communication','Creative problem solving','Brand storytelling'],
    careers: ['Graphic Designer','Video Producer','Social Media Manager','Journalist','Photographer','Marketing Coordinator'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/></svg>',
  },
  finance: {
    title: 'Finance & Business Services',
    tagline: 'Move money. Build businesses. Drive economies.',
    description: 'Accounting, banking, entrepreneurship, and business management — this cluster prepares students to understand how organizations operate, how capital flows, and how good decisions at scale shape the world.',
    color: '#1a3a5c',
    accentLight: '#dbeafe',
    subsectors: [
      { label: 'Banking & Finance',    url: imgUrls.finance[0].url },
      { label: 'Accounting',           url: imgUrls.finance[1].url },
      { label: 'Business Management',  url: imgUrls.finance[2].url },
      { label: 'Entrepreneurship',     url: imgUrls.finance[3].url },
      { label: 'Real Estate',          url: imgUrls.finance[4].url },
    ],
    competencies: ['Financial reporting & analysis','Project management','Principles of economics','Business operations','Customer relationship management'],
    careers: ['Accountant','Financial Analyst','Bank Teller','Business Manager','Entrepreneur','Insurance Agent'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  },
  health: {
    title: 'Health Sciences & Technology',
    tagline: 'Heal. Diagnose. Innovate.',
    description: 'Nursing, medical technology, physical therapy, pharmacy, and mental health — this cluster connects students to careers where science meets compassion and every day they go to work matters.',
    color: '#AC161D',
    accentLight: '#fee2e2',
    subsectors: [
      { label: 'Nursing & Patient Care',  url: imgUrls.health[0].url },
      { label: 'Medical Technology',      url: imgUrls.health[1].url },
      { label: 'Physical Therapy',        url: imgUrls.health[2].url },
      { label: 'Pharmacy',                url: imgUrls.health[3].url },
      { label: 'Mental Health',           url: imgUrls.health[4].url },
    ],
    competencies: ['Patient care fundamentals','Medical terminology','Health information systems','Clinical procedures','Healthcare ethics & compliance'],
    careers: ['Registered Nurse','Medical Assistant','Physical Therapist','Pharmacy Technician','EMT/Paramedic','Lab Technician'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>',
  },
  human: {
    title: 'Human & Public Services',
    tagline: 'Teach. Protect. Serve.',
    description: 'Education, social work, government, and public safety — this cluster is for students who want to dedicate their careers to strengthening communities, advocating for others, and building a more just society.',
    color: '#c47a15',
    accentLight: '#fef3c7',
    subsectors: [
      { label: 'Education & Teaching',   url: imgUrls.human[0].url },
      { label: 'Social Work',            url: imgUrls.human[1].url },
      { label: 'Government & Admin',     url: imgUrls.human[2].url },
      { label: 'Public Safety',          url: imgUrls.human[3].url },
      { label: 'Nonprofit & Community',  url: imgUrls.human[4].url },
    ],
    competencies: ['Community engagement','Counseling & guidance','Public policy awareness','Crisis intervention','Cultural competence'],
    careers: ['Social Worker','Teacher','Police Officer','Firefighter','City Planner','Nonprofit Manager'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
  },
  it: {
    title: 'Information Technology',
    tagline: 'Build systems. Secure networks. Shape the digital world.',
    description: 'Software development, cybersecurity, networking, data science, and AI — this cluster is for students who want to be the architects of the technology that runs everything else.',
    color: '#0f4c75',
    accentLight: '#dbeafe',
    subsectors: [
      { label: 'Software Development',  url: imgUrls.it[0].url },
      { label: 'Cybersecurity',         url: imgUrls.it[1].url },
      { label: 'Network Administration',url: imgUrls.it[2].url },
      { label: 'Data Science',          url: imgUrls.it[3].url },
      { label: 'AI & Machine Learning', url: imgUrls.it[4].url },
    ],
    competencies: ['Programming & software development','Network administration','Cybersecurity fundamentals','Database management','Technical troubleshooting'],
    careers: ['Software Developer','IT Support Specialist','Cybersecurity Analyst','Web Developer','Data Analyst','Network Administrator'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>',
  },
  manufacturing: {
    title: 'Manufacturing, Engineering & Trades',
    tagline: 'Design it. Build it. Fix it.',
    description: 'Engineering, manufacturing, construction, automotive, and electrical trades — this cluster connects students to hands-on careers where they build the infrastructure, products, and systems the world depends on.',
    color: '#5a3e1b',
    accentLight: '#fef3c7',
    subsectors: [
      { label: 'Engineering',           url: imgUrls.manufacturing[0].url },
      { label: 'Manufacturing',         url: imgUrls.manufacturing[1].url },
      { label: 'Construction & Trades', url: imgUrls.manufacturing[2].url },
      { label: 'Automotive',            url: imgUrls.manufacturing[3].url },
      { label: 'Electrical & HVAC',     url: imgUrls.manufacturing[4].url },
    ],
    competencies: ['Equipment safety & operation','Spatial reasoning & CAD','Quality control processes','Supply chain logistics','Technical documentation'],
    careers: ['Mechanical Engineer','Electrician','CNC Machinist','Welder','HVAC Technician','Construction Manager'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
  },
};

// ─── STATIC BUSINESSES (with Cloudinary logos) ────────────────────────────
const STATIC_BUSINESSES = [
  { idx:0, name:'BPS101 Business Office', sector:'Finance & Business', website:'https://www.bps101.net/depts/finance-business/', logo:BPS_LOGO, mission:'Committed to fostering student success through operational excellence, responsible stewardship of resources, and a focus on supporting teaching and learning.', role:'Business Office Intern', tasks:'-Organizing and digitizing business office files and records\n-Cleaning and standardizing vendor data in accounting system\n-Review and audit new naming conventions\n-Create how-to guides for staff\n-General office support', skills:'-Data organization and systems thinking\n-Process improvement and documentation\n-Understanding of financial operations', environment:'Office-based, Hybrid', compensation:'One-Time Stipend', hours:'5 hrs/wk', reqs:'Any specific job trainings', specificReqs:'Excel/Google Sheet knowledge', numStudents:'1', mentorName:'Josh Bulak', mentorEmail:'josh.bulak@bps101.net', appLink:'', appInstructions:'Apply via our company website, Email a resume and cover letter directly to the contact listed above, Contact the mentor via phone to schedule an initial conversation', idealCandidate:'Someone who is attentive to detail and curious — looks at data and asks why? Now what? So what?', otherInfo:'', clusterId:'finance' },
  { idx:1, name:'BPS101 Athletics', sector:'Finance & Business', website:'https://schools.snap.app/batavia', logo:BPS_LOGO, mission:'Batavia High School strives for excellence in all areas of student development, including athletics.', role:'Athletics Intern', tasks:'-Set ups for events\n-Logistics for events\n-Snap Website: registrations, schedules, rosters\n-Contract and official work\n-Athlete highlights / social media\n-Marketing, sponsorships, fundraising', skills:'-Leadership\n-Organization\n-Communication with adults, community members, and students', environment:'Office, Field, Hybrid, Hands-on', compensation:'One-Time Stipend', hours:'10 hrs/wk', reqs:'Any specific job trainings', specificReqs:'FERPA/HIPAA training, Public School Works trainings', numStudents:'1', mentorName:'Mark Anderson', mentorEmail:'mark.anderson@bps101.net', appLink:'', appInstructions:'Apply via our company website, Email a resume and cover letter directly to the contact listed above', idealCandidate:'Someone with an athletics background interested in schools — teacher or coach track.', otherInfo:'', clusterId:'finance' },
  { idx:2, name:'BPS101 Superintendent Office', sector:'Finance & Business', website:'https://bps101.net', logo:BPS_LOGO, mission:'To ensure that our school system is operating and functioning so that students can learn every day.', role:'Leadership & Public Policy Intern', tasks:'-Attend meetings\n-Diligent notetaking\n-Summaries and reflection', skills:'-Leadership through multiple lenses\n-Legal literacy — reading important documents\n-Strategic planning and thinking', environment:'Office, Field, Hybrid, Hands-on', compensation:'One-Time Stipend', hours:'5 hrs/wk', reqs:'Must provide own transport, Specific course prerequisite', specificReqs:'Leadership-type courses; self-motivated, self-starter', numStudents:'1 or 2', mentorName:'Tom Kim', mentorEmail:'tom.kim@bps101.net', appLink:'', appInstructions:'Apply via our company website, Email a resume and cover letter directly to the contact listed above', idealCandidate:'Self starter, reliable, passionate about public service, curious, strong leader.', otherInfo:'', clusterId:'finance' },
  { idx:3, name:'BPS101 Athletic Training', sector:'Health Sciences', website:'https://sites.google.com/bps101.net/batavia-athletic-training/', logo:BPS_LOGO, mission:'Athletic training encompasses the prevention, examination, diagnosis, treatment and rehabilitation of emergent, acute or chronic injuries and medical conditions.', role:'Athletic Training Student Aide', tasks:'-Facilitating prehab/rehab protocols\n-Game and practice set up\n-Shadowing evaluations and injury assessments\n-Learn how to tape athletes\n-Assisting with sideline procedures', skills:'-Understanding of athletic trainer responsibilities\n-Skills to evaluate and assess injuries\n-Injury protocol knowledge', environment:'Office, Field, Hands-on', compensation:'Paid Hourly', hours:'5–10 hrs/wk', reqs:'Specific course prerequisite, CPR certified', specificReqs:'Accell course, anatomy course, Sports Med club interest, CPR certified', numStudents:'1', mentorName:'Zac Roberts, Jake Reist', mentorEmail:'zac.roberts@bps101.net', appLink:'', appInstructions:'Apply via our company website, Email a resume and cover letter directly to the contact listed above', idealCandidate:'Outgoing, passionate, flexible, quick learner, trustworthy, good communication skills.', otherInfo:'', clusterId:'health' },
  { idx:4, name:'BPS101 Nursing', sector:'Health Sciences', website:'https://www.bps101.net/health-services/', logo:BPS_LOGO, mission:'To provide general health and well-being to all students through BPS101 schools.', role:'Nursing Intern', tasks:'-Quick assessment of students\n-Wound care\n-Additional education\n-Five rights of medication\n-Documentation', skills:'-Vital signs\n-Wound care\n-Giving medication with RN assistance\n-Quick neuro assessment\n-Patient flow and general student health intake', environment:'Office, Hands-on', compensation:'Paid Hourly', hours:'Flexible/Project-based', reqs:'Anatomy, General Health class', specificReqs:'Anatomy, General Health class, Possibly FERPA/HIPAA', numStudents:'Up to 1 per building', mentorName:'Kelii Coonrod', mentorEmail:'kelli.coonrod@bps101.net', appLink:'', appInstructions:'Apply via our company website, Email a resume and cover letter directly to the contact listed above', idealCandidate:'Interested in expanding nursing knowledge. Good work ethic. Ready to listen and learn.', otherInfo:'', clusterId:'health' },
  { idx:5, name:'Batavia Public Library', sector:'Human & Public Services', website:'https://www.bataviapl.org/', logo:LIB_LOGO, mission:'We are a welcoming place to gather, create, and learn by providing quality resources and experiences.', role:'Graphic Design & Marketing Intern', tasks:'-Design social media graphics for Instagram, Facebook, TikTok\n-Create flyers and posters for library programs\n-Assist with short-form video creation\n-Capture photography at library events\n-Support campaigns like summer reading', skills:'-Real-world experience on a creative team\n-Portfolio-ready work across print, digital, and social media\n-Mentorship from designers, illustrators, and content creators', environment:'Office, Field, Hybrid, Hands-on', compensation:'Paid Hourly', hours:'10 hrs/wk', reqs:'Portfolio examples, Adobe Suite', specificReqs:'Portfolio examples, Adobe Suite (Photoshop, Illustrator, Canva, Mac environment)', numStudents:'1', mentorName:'Cesar Orozco', mentorEmail:'corozco@bataviapl.org', appLink:'', appInstructions:'Apply via our company website, Email a resume and cover letter directly to the contact listed above', idealCandidate:'Someone passionate about creativity who can communicate ideas and sell a concept.', otherInfo:'', clusterId:'human' },
  { idx:6, name:'Organic Life', sector:'Human & Public Services', website:'https://www.organiclifeusa.com/', logo:ORGANIC_LOGO, mission:"OrganicLife is the Midwest's foremost food management service, delivering unparalleled services tailored to clients of varying scales.", role:'Food Service Worker', tasks:"-Breakfast prep\n-Cold/hot box prep at middle school for elementaries\n-Loading/unloading food deliveries\n-Receiving and stocking food on Thursday mornings\n-General food prep and management", skills:'-Purchasing and supply aspects of food services\n-Understanding food prep and delivery workflow\n-Cost management, customer interaction, and rotating product', environment:'Shop/Lab, Hands-on', compensation:'Paid Hourly', hours:'5 hrs/wk', reqs:'Illinois Food Handlers License ($10 online)', specificReqs:"Illinois Food Handlers License ($10 online), Work in morning 6:30am–7:30am", numStudents:'1', mentorName:'Anne Hjelmberg / Tony Lopez', mentorEmail:'Anthony.lopez@bps101.net', appLink:'', appInstructions:'Email a resume and cover letter directly to the contact listed above', idealCandidate:"Hard worker, self-motivated, doesn't need to be micromanaged.", otherInfo:'', clusterId:'human' },
  { idx:7, name:'BPS101 Building & Grounds', sector:'Manufacturing, Engineering, & Trades', website:'https://www.bps101.net/depts/facilities/', logo:BPS_LOGO, mission:'The Facilities Department oversees nine sites and one million square feet of school buildings and grounds.', role:'General Maintenance Intern', tasks:'-HVAC\n-Plumbing\n-Electrical\n-General repairs\n-Snow removal\n-Turf maintenance', skills:'-Collaboration\n-Problem solving and troubleshooting\n-Technical skills in different trades', environment:'Field, Hands-on', compensation:'Paid Hourly', hours:'5 hrs/wk', reqs:'Must provide own transport, Trades courses', specificReqs:'Trades courses, safety trainings for public works', numStudents:'1 (can expand)', mentorName:'Robert Schmidt', mentorEmail:'robert.schmitt@bps101.net', appLink:'', appInstructions:'Apply via our company website, Email a resume and cover letter directly to the contact listed above', idealCandidate:"A go-getter who wants to work and do hands-on tasks. You learn by doing, not just watching.", otherInfo:'', clusterId:'manufacturing' },
  { idx:8, name:'BPS101 Technology Dept.', sector:'Information Technology', website:'https://www.bps101.net/depts/technology/', logo:BPS_LOGO, mission:'At BPS101, we believe every child deserves access to digital tools that support their learning and help them become successful contributors to our global world.', role:'Help Desk Technician', tasks:'-Technical support for software/hardware issues\n-Resolving helpdesk tickets promptly\n-Level 1 support operations\n-Setup and repair of technology hardware\n-Record keeping and inventory', skills:'-Customer service\n-Problem solving\n-Troubleshooting', environment:'Office-based', compensation:'Paid Hourly', hours:'5 hrs/wk', reqs:'Must provide own transport, Some kind of tech class', specificReqs:'Some kind of tech class; ideal: CompTIA A+ and Net+ certifications', numStudents:'1–2', mentorName:'David Thurlby, Rob Luxton, Lynn Bartolotta', mentorEmail:'David.thurlby@bps101.net', appLink:'', appInstructions:'Apply via our company website, Email a resume and cover letter directly to the contact listed above', idealCandidate:'Responsible, owns their work, good with customer service, takes responsibility.', otherInfo:'', clusterId:'it' },
];

// ─── CLUSTER_MAP for Google Sheet normalization ───────────────────────────
const CLUSTER_MAP_JS = `{
  'business & finance':                  'finance',
  'finance & business':                  'finance',
  'health sciences':                     'health',
  'human & public services':             'human',
  'manufacturing, engineering, & trades':'manufacturing',
  'manufacturing, engineering & trades': 'manufacturing',
  'information technology':              'it',
  'agriculture, food & natural resources':'agriculture',
  'agriculture':                         'agriculture',
  'arts & communication':                'arts',
}`;

// ─── HTML TEMPLATE ────────────────────────────────────────────────────────
function buildPage(clusterId, cluster) {
  const cells = cluster.subsectors;
  const staticForCluster = STATIC_BUSINESSES.filter(b => b.clusterId === clusterId);

  const subsectorCellsHtml = cells.map((sub, i) => {
    const kbAnims = ['kb-zoom-in','kb-pan-right','kb-zoom-out','kb-pan-left','kb-zoom-in-alt'];
    return `
        <div class="collage-cell cell-${i+1}" style="position:relative;overflow:hidden;">
          <div class="kb-inner" style="background-image:url('${sub.url}');animation:${kbAnims[i]} ${11+i*2}s ease-in-out infinite alternate;"></div>
          <div class="cell-label">${sub.label}</div>
        </div>`;
  }).join('');

  const competenciesHtml = cluster.competencies.map(c => `
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:${cluster.color}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span class="text-gray-700">${c}</span>
              </li>`).join('');

  const careersHtml = cluster.careers.map(c =>
    `<span class="career-pill">${c}</span>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>if(sessionStorage.getItem('fe_auth')!=='1'){location.replace('index.html')}</script>
  <title>${cluster.title} — Field Experience BHS</title>
  <link rel="icon" type="image/png" href="https://res.cloudinary.com/dsbllwpbh/image/upload/v1771966521/fieldexperience-favicon_jgdotp.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Open+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: { extend: {
        colors: {
          crimson: { 50:'#fef2f2',100:'#fee2e2',200:'#fdcbcb',300:'#fba5a6',400:'#f56d6f',500:'#eb4044',600:'#d72429',700:'#b91c22',800:'#AC161D',900:'#851519',950:'#490808' },
          navy:    { 50:'#f5f5f5',100:'#e5e5e5',200:'#D9D9D9',300:'#b3b3b3',400:'#8a8a8a',500:'#5D5D5D',600:'#4a4a4a',700:'#333333',800:'#1a1a1a',900:'#000000' },
          gold:    { 50:'#fffde6',100:'#fffabd',200:'#fff48a',300:'#ffe94d',400:'#fde020',500:'#FBCD07',600:'#DAB107',700:'#9a7305',800:'#7d5c0b',900:'#66490f' },
        },
        fontFamily: { heading: ['Montserrat','system-ui','sans-serif'], body: ['Open Sans','system-ui','sans-serif'] }
      }}
    }
  </script>
  <style>
    *{box-sizing:border-box}
    body{font-family:'Open Sans',system-ui,sans-serif;background:#fff;color:#000;overflow-x:hidden}
    .font-heading{font-family:'Montserrat',system-ui,sans-serif}
    ::selection{background:#AC161D;color:#fff}
    html{scroll-behavior:smooth}

    /* ── Collage hero ── */
    .collage-grid{
      display:grid;
      grid-template-columns:2fr 1fr 1fr;
      grid-template-rows:1fr 1fr;
      height:72vh;
      min-height:420px;
      gap:3px;
    }
    .cell-1{grid-row:1/3;}
    .collage-cell{position:relative;overflow:hidden;}
    .kb-inner{
      position:absolute;
      inset:-6%;
      width:112%;
      height:112%;
      background-size:cover;
      background-position:center;
      will-change:transform;
    }
    @keyframes kb-zoom-in     { from{transform:scale(1)   translateX(0)   translateY(0)}   to{transform:scale(1.15) translateX(-2%) translateY(-1%)} }
    @keyframes kb-zoom-in-alt { from{transform:scale(1)   translateX(1%)  translateY(1%)}  to{transform:scale(1.15) translateX(-1%) translateY(-2%)} }
    @keyframes kb-zoom-out    { from{transform:scale(1.12) translateX(-1%) translateY(-1%)} to{transform:scale(1)   translateX(1%)  translateY(1%)}  }
    @keyframes kb-pan-right   { from{transform:scale(1.08) translateX(-3%) translateY(0)}   to{transform:scale(1.08) translateX(3%)  translateY(-1%)} }
    @keyframes kb-pan-left    { from{transform:scale(1.08) translateX(3%)  translateY(1%)}  to{transform:scale(1.08) translateX(-3%) translateY(0)}   }

    .cell-label{
      position:absolute;bottom:0;left:0;right:0;
      background:linear-gradient(transparent,rgba(0,0,0,0.72));
      color:#fff;font-family:'Montserrat',sans-serif;font-size:0.7rem;font-weight:700;
      letter-spacing:.07em;text-transform:uppercase;
      padding:1.5rem 0.75rem 0.6rem;
    }

    /* collage overlay — cluster title */
    .hero-overlay{
      position:absolute;inset:0;
      background:linear-gradient(135deg,rgba(0,0,0,0.52) 0%,rgba(0,0,0,0.08) 50%,rgba(0,0,0,0.0) 100%);
      pointer-events:none;z-index:10;
    }
    .hero-text{
      position:absolute;left:0;bottom:0;
      padding:2.5rem;z-index:20;
      pointer-events:none;
    }

    /* Nav */
    .top-nav{
      position:fixed;top:0;left:0;right:0;
      background:rgba(255,255,255,0.97);backdrop-filter:blur(12px);
      border-bottom:1px solid #e5e5e5;z-index:50;
    }

    /* Job cards */
    .job-card{
      background:#fff;border:1.5px solid #e5e5e5;border-radius:16px;
      padding:1.5rem;
      transition:all .3s cubic-bezier(.16,1,.3,1);
      display:flex;flex-direction:column;
    }
    .job-card:hover{
      border-color:${cluster.color};
      box-shadow:0 12px 40px -8px rgba(0,0,0,0.15);
      transform:translateY(-3px);
    }
    .apply-btn{
      display:block;width:100%;
      padding:.875rem 1rem;
      border-radius:10px;
      font-family:'Montserrat',sans-serif;font-size:.875rem;font-weight:700;
      letter-spacing:.04em;text-transform:uppercase;
      text-align:center;cursor:pointer;border:none;
      background:${cluster.color};color:#fff;
      transition:all .2s ease;margin-top:auto;
    }
    .apply-btn:hover{opacity:.88;transform:translateY(-1px);}

    .env-badge{
      display:inline-flex;align-items:center;gap:.3rem;
      background:#f5f5f5;border-radius:999px;
      padding:.25rem .65rem;font-size:.7rem;font-weight:600;
      font-family:'Montserrat',sans-serif;color:#4a4a4a;
    }

    .career-pill{
      display:inline-block;background:${cluster.accentLight};
      border-radius:999px;padding:.4rem .9rem;
      font-size:.8rem;font-weight:600;color:${cluster.color};
      font-family:'Montserrat',sans-serif;
    }

    /* Modal */
    .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.93);z-index:200;display:none;opacity:0;transition:opacity .4s cubic-bezier(.16,1,.3,1);}
    .modal-backdrop.active{display:flex;opacity:1;}
    .modal-content{transform:translateY(40px);opacity:0;transition:all .5s cubic-bezier(.16,1,.3,1) .1s;}
    .modal-backdrop.active .modal-content{transform:translateY(0);opacity:1;}

    @keyframes spin{to{transform:rotate(360deg)}}

    .section-label{font-family:'Montserrat',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${cluster.color};}

    /* Mobile collage */
    @media(max-width:640px){
      .collage-grid{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr 1fr;height:56vh;}
      .cell-1{grid-row:1/3;}
      .cell-5{display:none;}
      .hero-text{padding:1.25rem;}
    }
    @media(max-width:380px){
      .collage-grid{grid-template-columns:1fr;grid-template-rows:repeat(3,1fr);height:70vh;}
      .cell-1{grid-row:1/2;}
      .cell-3,.cell-4,.cell-5{display:none;}
    }
  </style>
</head>
<body>

<!-- ── TOP NAV ── -->
<nav class="top-nav">
  <div class="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
    <a href="index.html#pathways" class="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-crimson-800 transition-colors font-heading">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Explore More Careers
    </a>
    <a href="index.html" class="flex items-center gap-2.5">
      <img src="${BPS_LOGO}" alt="BPS101" class="h-8 w-auto">
      <span class="font-heading font-bold text-sm text-navy-900 hidden sm:block">Field Experience</span>
    </a>
  </div>
</nav>

<!-- ── HERO COLLAGE ── -->
<div style="margin-top:57px;position:relative;">
  <div class="collage-grid">
    ${subsectorCellsHtml}
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-text">
    <p class="section-label mb-2" style="color:rgba(255,255,255,0.75)">Career Cluster</p>
    <h1 class="font-heading font-black text-white leading-tight mb-2" style="font-size:clamp(1.6rem,4vw,3rem);text-shadow:0 2px 20px rgba(0,0,0,0.5);">${cluster.title}</h1>
    <p class="text-white font-semibold font-heading" style="font-size:clamp(.85rem,2vw,1.1rem);opacity:.85;text-shadow:0 1px 8px rgba(0,0,0,0.5);">${cluster.tagline}</p>
  </div>
</div>

<!-- ── CLUSTER INFO ── -->
<section class="py-16 px-5">
  <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

    <div>
      <p class="section-label mb-3">About This Cluster</p>
      <h2 class="font-heading text-2xl md:text-3xl font-bold text-navy-900 mb-4 leading-snug">${cluster.title}</h2>
      <p class="text-gray-600 text-lg leading-relaxed mb-8">${cluster.description}</p>

      <p class="section-label mb-4">Key Competencies</p>
      <ul class="space-y-3">
        ${competenciesHtml}
      </ul>
    </div>

    <div>
      <p class="section-label mb-4">Careers in This Field</p>
      <div class="flex flex-wrap gap-2 mb-10">
        ${careersHtml}
      </div>

      <div class="rounded-2xl p-6" style="background:${cluster.accentLight};">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white" style="background:${cluster.color};">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">${cluster.icon.replace(/<svg[^>]*>/,'').replace('</svg>','')}</svg>
          </div>
          <div>
            <p class="font-heading font-bold text-navy-900 mb-1">Ready to explore?</p>
            <p class="text-gray-600 text-sm">Scroll down to see real internship and partner employer opportunities in this cluster — all available through BHS Field Experience.</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>

<!-- ── OPPORTUNITIES ── -->
<section class="py-16 px-5" style="background:#f9f9f9;">
  <div class="max-w-6xl mx-auto">

    <div class="mb-10">
      <p class="section-label mb-3">Apply Now</p>
      <h2 class="font-heading text-2xl md:text-3xl font-bold text-navy-900 mb-3">Internship & Partner Opportunities</h2>
      <p class="text-gray-500 max-w-2xl">These real placements are available to BHS Field Experience students. Click any position to read the full job description and find out how to apply.</p>
    </div>

    <div id="jobs-loading" class="flex items-center gap-3 py-8">
      <div style="width:22px;height:22px;border:2.5px solid ${cluster.color};border-top-color:transparent;border-radius:50%;animation:spin .7s linear infinite"></div>
      <p class="text-gray-400 text-sm font-heading font-semibold">Loading partner opportunities…</p>
    </div>

    <div id="jobs-grid" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" style="display:none;"></div>

    <div id="jobs-empty" style="display:none;" class="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
      <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="background:${cluster.accentLight};">
        <svg class="w-7 h-7" fill="none" stroke="${cluster.color}" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
      </div>
      <p class="font-heading font-bold text-navy-900 mb-1">More opportunities coming soon</p>
      <p class="text-gray-400 text-sm">Partner employers in this cluster are being added. Check back as we grow these connections.</p>
    </div>

  </div>
</section>

<!-- ── JOB DETAIL MODAL ── -->
<div id="modal-job" class="modal-backdrop items-center justify-center p-4">
  <div class="modal-content bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
    <div id="job-modal-inner"></div>
  </div>
</div>

<!-- ── FOOTER ── -->
<footer class="py-10 px-5 border-t border-gray-200">
  <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <img src="${BPS_LOGO}" alt="BPS101" class="h-8 w-auto">
      <div>
        <p class="font-heading font-bold text-sm text-navy-900">Field Experience</p>
        <p class="text-xs text-gray-400">Batavia High School</p>
      </div>
    </div>
    <a href="index.html#pathways" class="text-sm font-heading font-semibold hover:text-crimson-800 transition-colors flex items-center gap-1.5" style="color:${cluster.color}">
      ← Explore More Career Clusters
    </a>
  </div>
</footer>

<script>
  // ── DATA ──────────────────────────────────────────────────────────────
  const APPS_SCRIPT_URL = '${APPS_SCRIPT_URL}';
  const CLUSTER_ID = '${clusterId}';
  const CLUSTER_COLOR = '${cluster.color}';

  const CLUSTER_MAP = ${CLUSTER_MAP_JS};

  const KNOWN_LOGOS = {
    'batavia public library': '${LIB_LOGO}',
    'organic life': '${ORGANIC_LOGO}',
  };
  const BPS_LOGO = '${BPS_LOGO}';

  const STATIC_BUSINESSES = ${JSON.stringify(STATIC_BUSINESSES)};

  let allBusinesses = STATIC_BUSINESSES;
  let sheetLoaded = false;

  // ── HELPERS ───────────────────────────────────────────────────────────
  function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function toDriveImg(raw) {
    if (!raw || !raw.trim()) return '';
    const m = raw.match(/[?&]id=([^&\\s]+)/);
    if (m) return 'https://drive.google.com/uc?export=view&id=' + m[1];
    const m2 = raw.match(/\\/d\\/([a-zA-Z0-9_-]+)/);
    if (m2) return 'https://drive.google.com/uc?export=view&id=' + m2[1];
    if (raw.trim().startsWith('http')) return raw.trim();
    return '';
  }

  function getLogoUrl(b) {
    const n = (b.name || '').toLowerCase();
    for (const [k, url] of Object.entries(KNOWN_LOGOS)) { if (n.includes(k)) return url; }
    if (n.includes('bps101') || n.includes('bps 101')) return BPS_LOGO;
    return toDriveImg(b.logo) || '';
  }

  function initials(n){ return (n||'??').split(/\\s+/).map(w=>w[0]||'').join('').slice(0,2).toUpperCase(); }

  function bulletLines(text) {
    if (!text) return '';
    return text.split('\\n')
      .map(l => l.replace(/^[-•*]\\s*/,'').trim()).filter(Boolean)
      .map(l => \`<li class="flex items-start gap-2 text-sm text-gray-600"><span class="font-bold flex-shrink-0 mt-0.5" style="color:\${CLUSTER_COLOR}">•</span><span>\${esc(l)}</span></li>\`)
      .join('');
  }

  function badge(icon, label, val) {
    if (!val) return '';
    return \`<div class="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
      <div class="text-lg">\${icon}</div>
      <div class="text-xs text-gray-400 font-semibold font-heading mt-0.5">\${label}</div>
      <div class="text-xs font-heading font-bold text-gray-800 leading-tight mt-0.5">\${esc(val)}</div>
    </div>\`;
  }

  // ── RENDER JOBS ───────────────────────────────────────────────────────
  function renderJobs() {
    const businesses = allBusinesses.filter(b => b.clusterId === CLUSTER_ID);
    const loading = document.getElementById('jobs-loading');
    const grid    = document.getElementById('jobs-grid');
    const empty   = document.getElementById('jobs-empty');

    loading.style.display = 'none';

    if (!businesses.length) {
      empty.style.display = 'block';
      grid.style.display  = 'none';
      return;
    }

    grid.style.display = 'grid';
    empty.style.display = 'none';

    grid.innerHTML = businesses.map((b, i) => {
      const logoUrl = getLogoUrl(b);
      const logoHtml = logoUrl
        ? \`<img src="\${logoUrl}" alt="\${esc(b.name)}" class="w-full h-full object-contain p-1.5"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">\`
        : '';
      const fbDisplay = logoUrl ? 'display:none' : 'display:flex';
      const isBps = (b.name || '').toLowerCase().includes('bps');
      const cardLogoBg = isBps ? 'background:#AC161D' : 'background:#f9fafb';
      const cardLogoBorder = isBps ? '' : 'border border-gray-100';
      const envBadges = (b.environment||'').split(',').map(e=>e.trim()).filter(Boolean).slice(0,2)
        .map(e=>\`<span class="env-badge">\${esc(e)}</span>\`).join('');

      return \`
        <div class="job-card">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-16 h-16 rounded-xl \${cardLogoBorder} overflow-hidden flex-shrink-0 flex items-center justify-center" style="\${cardLogoBg}">
              \${logoHtml}
              <span style="\${fbDisplay}" class="w-full h-full items-center justify-center font-heading font-bold text-lg"
                    title="\${esc(b.name)}"
                    data-initials="\${initials(b.name)}"
                    id="init-\${CLUSTER_ID}-\${i}"></span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-heading font-bold text-navy-900 text-base leading-snug mb-0.5">\${esc(b.name)}</p>
              <p class="text-sm font-semibold" style="color:\${CLUSTER_COLOR}">\${esc(b.role || 'Internship')}</p>
            </div>
          </div>

          \${envBadges ? \`<div class="flex flex-wrap gap-1.5 mb-3">\${envBadges}</div>\` : ''}

          \${b.compensation ? \`<div class="flex items-center gap-2 mb-3 text-sm text-gray-500 font-semibold">
            <span>💰</span><span>\${esc(b.compensation)}</span>
            \${b.hours ? \`<span class="text-gray-300">·</span><span>⏱ \${esc(b.hours)}</span>\` : ''}
          </div>\` : ''}

          \${b.mission ? \`<p class="text-sm text-gray-500 leading-relaxed mb-4" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">\${esc(b.mission)}</p>\` : ''}

          <button class="apply-btn" onclick="openJobModal(\${b.idx})">View Full Position →</button>
        </div>\`;
    }).join('');

    // fill initials spans
    businesses.forEach((b, i) => {
      const el = document.getElementById(\`init-\${CLUSTER_ID}-\${i}\`);
      if (el) {
        el.textContent = initials(b.name);
        el.style.background = CLUSTER_COLOR + '20';
        el.style.color = CLUSTER_COLOR;
      }
    });
  }

  // ── JOB MODAL ─────────────────────────────────────────────────────────
  function openJobModal(idx) {
    const b = allBusinesses[idx];
    if (!b) return;
    const logoUrl = getLogoUrl(b);
    const isBpsModal = (b.name || '').toLowerCase().includes('bps');
    const modalLogoBg = isBpsModal ? '#AC161D' : '#ffffff';
    const logoHtml = logoUrl
      ? \`<img src="\${logoUrl}" alt="\${esc(b.name)}" class="h-10 max-w-[100px] object-contain" onerror="this.style.display='none'">\`
      : \`<span class="text-xl font-heading font-bold" style="color:\${CLUSTER_COLOR}">\${initials(b.name)}</span>\`;

    const appMethods = b.appInstructions.split(',').map(s=>s.trim()).filter(Boolean);
    const appHtml = appMethods.length
      ? appMethods.map(m=>\`<li class="flex items-start gap-2 text-sm text-gray-600"><span class="font-bold mt-0.5 flex-shrink-0" style="color:\${CLUSTER_COLOR}">→</span><span>\${esc(m)}</span></li>\`).join('')
      : '<li class="text-sm text-gray-600">Contact the mentor listed below.</li>';

    document.getElementById('job-modal-inner').innerHTML = \`
      <div class="text-white px-6 py-5 flex items-start justify-between gap-4" style="background:\${CLUSTER_COLOR}">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 p-2" style="background:\${modalLogoBg}">\${logoHtml}</div>
          <div>
            <p class="text-xs uppercase tracking-widest font-semibold opacity-75 mb-0.5">\${esc(b.sector)}</p>
            <h2 class="font-heading text-xl font-bold leading-tight">\${esc(b.name)}</h2>
            <p class="text-sm opacity-85 mt-0.5">\${esc(b.role)}</p>
          </div>
        </div>
        <button onclick="closeJobModal()" class="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center flex-shrink-0 transition-colors mt-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="p-6 space-y-5 overflow-y-auto" style="max-height:calc(92vh - 110px)">

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          \${badge('💰','Pay', b.compensation)}
          \${badge('⏱','Hours/Wk', b.hours)}
          \${badge('🏢','Setting', b.environment)}
          \${badge('👥','Openings', b.numStudents)}
        </div>

        \${b.mission ? \`<div class="border-l-4 pl-4" style="border-color:\${CLUSTER_COLOR}">
          <h3 class="font-heading font-bold text-sm uppercase tracking-wide text-navy-900 mb-1">About \${esc(b.name)}</h3>
          <p class="text-gray-600 text-sm leading-relaxed">\${esc(b.mission)}</p>
        </div>\` : ''}

        \${b.tasks ? \`<div>
          <h3 class="font-heading font-bold text-navy-900 mb-2 flex items-center gap-2">
            <span class="w-5 h-5 rounded text-white flex items-center justify-center text-xs font-bold" style="background:\${CLUSTER_COLOR}">✓</span>
            What You'll Do
          </h3>
          <ul class="space-y-1.5">\${bulletLines(b.tasks)}</ul>
        </div>\` : ''}

        \${b.skills ? \`<div>
          <h3 class="font-heading font-bold text-navy-900 mb-2 flex items-center gap-2">
            <span class="w-5 h-5 rounded text-white flex items-center justify-center text-xs font-bold" style="background:\${CLUSTER_COLOR}">★</span>
            Skills You'll Develop
          </h3>
          <ul class="space-y-1.5">\${bulletLines(b.skills)}</ul>
        </div>\` : ''}

        \${b.idealCandidate ? \`<div class="rounded-xl p-4" style="background:\${CLUSTER_COLOR}12">
          <h3 class="font-heading font-bold text-sm text-navy-900 mb-1">Ideal Candidate</h3>
          <p class="text-sm text-gray-600 leading-relaxed">\${esc(b.idealCandidate)}</p>
        </div>\` : ''}

        \${b.specificReqs ? \`<div>
          <h3 class="font-heading font-bold text-navy-900 mb-2 flex items-center gap-2">
            <span class="w-5 h-5 rounded text-white flex items-center justify-center text-xs font-bold" style="background:\${CLUSTER_COLOR}">!</span>
            Requirements
          </h3>
          <p class="text-sm text-gray-600">\${esc(b.specificReqs)}</p>
        </div>\` : ''}

        <div>
          <h3 class="font-heading font-bold text-navy-900 mb-2 flex items-center gap-2">
            <span class="w-5 h-5 rounded text-white flex items-center justify-center text-xs font-bold" style="background:\${CLUSTER_COLOR}">→</span>
            How to Apply
          </h3>
          <ul class="space-y-1.5">\${appHtml}</ul>
        </div>

        \${b.appLink ? \`<a href="\${esc(b.appLink)}" target="_blank" rel="noopener"
          class="block w-full text-center py-3.5 rounded-xl font-heading font-bold text-sm tracking-wide text-white transition-all hover:opacity-90"
          style="background:\${CLUSTER_COLOR}">Apply Now →</a>\` : ''}

        <div class="border-t border-gray-100 pt-4">
          <p class="text-xs text-gray-400 font-heading font-semibold uppercase tracking-wide mb-1">Primary Mentor</p>
          <p class="font-heading font-bold text-navy-900 text-sm">\${esc(b.mentorName)}</p>
          <a href="mailto:\${esc(b.mentorEmail)}" class="text-sm hover:underline" style="color:\${CLUSTER_COLOR}">\${esc(b.mentorEmail)}</a>
        </div>

        \${b.website ? \`<a href="\${esc(b.website)}" target="_blank" rel="noopener" class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          Visit \${esc(b.name)} Website
        </a>\` : ''}
      </div>\`;

    const modal = document.getElementById('modal-job');
    document.body.style.overflow = 'hidden';
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
  }

  function closeJobModal() {
    const modal = document.getElementById('modal-job');
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; document.body.style.overflow = ''; }, 400);
  }

  document.getElementById('modal-job').addEventListener('click', e => {
    if (e.target.id === 'modal-job') closeJobModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeJobModal(); });

  // ── GOOGLE SHEET LOAD ─────────────────────────────────────────────────
  function loadFromSheet() {
    fetch(APPS_SCRIPT_URL)
      .then(r => r.json())
      .then(rows => {
        const fresh = rows.map((row, idx) => {
          const sector = (row['Industry/Sector:'] || '').trim();
          return {
            idx,
            name:            (row['Company Name']||'').trim(),
            sector,
            website:         (row['Company Website']||'').trim(),
            logo:            (row['Company Logo ']||'').trim(),
            mission:         (row['Brief Mission Statement']||'').trim(),
            role:            (row['Internship Role Title  (e.g., marketing assistant, shadow, architect). ']||'').trim(),
            tasks:           (row['Primary Tasks & Responsibilities (Use Bullet Points)']||'').trim(),
            skills:          (row['Top 3 Skills Student will develop']||'').trim(),
            environment:     (row['Work Environment']||'').trim(),
            compensation:    (row['Compensation']||'').trim(),
            hours:           (row['Weekly Time Commitment']||'').trim(),
            reqs:            (row['Student Requirements']||'').trim(),
            specificReqs:    (row['What are the specific requirements?']||'').trim(),
            numStudents:     (row['Number of students Requested']||'').trim(),
            mentorName:      (row['Primary Mentor Name']||'').trim(),
            mentorEmail:     (row['Mentor Email']||'').trim(),
            appLink:         (row['Direct Application Link (If you have your own portal that you require).']||'').trim(),
            appInstructions: (row['Application Instructions']||'').trim(),
            idealCandidate:  (row['What is your ideal candidate?']||'').trim(),
            otherInfo:       (row['Any other important information to share']||'').trim(),
            clusterId:       CLUSTER_MAP[sector.toLowerCase()] || null,
          };
        });
        if (fresh.length > 0) {
          allBusinesses = fresh;
          renderJobs();
        }
      })
      .catch(() => {}); // keep static data on failure
  }

  // ── INIT ──────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    renderJobs();
    loadFromSheet();
  });
</script>
</body>
</html>`;
}

// ─── GENERATE ALL 7 PAGES ──────────────────────────────────────────────────
for (const [id, cluster] of Object.entries(CLUSTERS)) {
  const html = buildPage(id, cluster);
  const filename = `cluster-${id}.html`;
  fs.writeFileSync(filename, html);
  console.log(`✓ ${filename}`);
}
console.log('\nAll 7 cluster pages generated.');

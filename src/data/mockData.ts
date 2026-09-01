import { IndianVoiceLocale, LabParameter, PatientProfile, DietPlan, FAQItem, TechNode, MultilingualTranslation } from '../types';

export const INDIAN_VOICE_LOCALES: IndianVoiceLocale[] = [
  { code: 'en-IN', name: 'English (India)', nativeName: 'English (India)', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
];

export const MULTILINGUAL_TRANSLATIONS: Record<string, MultilingualTranslation> = {
  'en-IN': {
    transcript: 'Your Complete Blood Count report shows your overall health is in great shape. Hemoglobin and White Blood Cells are completely normal. Neutrophils show a slight elevation of 72%, which is common after a minor routine infection or seasonal stress.',
    summary: 'Your Complete Blood Count (CBC) is overall very healthy. Most blood cells are within standard ranges. Your Neutrophils are slightly elevated, which commonly indicates your body is actively clearing a mild routine infection or seasonal stress.',
    riskTitle: 'Optimal Health Profile',
    riskDesc: '92% of evaluated markers are within normal range. Mild elevation detected in Neutrophils, requiring standard wellness monitoring.',
  },
  'hi-IN': {
    transcript: 'आपकी संपूर्ण रक्त जांच (CBC) रिपोर्ट से पता चलता है कि आपका समग्र स्वास्थ्य बहुत अच्छा है। हीमोग्लोबिन और श्वेत रक्त कोशिकाएं पूरी तरह से सामान्य हैं। न्यूट्रोफिल में 72% की मामूली वृद्धि देखी गई है, जो किसी मामूली संक्रमण या मौसमी तनाव के बाद आम है।',
    summary: 'आपकी संपूर्ण रक्त जांच (CBC) कुल मिलाकर बहुत स्वस्थ है। अधिकांश रक्त कोशिकाएं मानक सीमाओं के भीतर हैं। आपके न्यूट्रोफिल थोड़े बढ़े हुए हैं, जो दर्शाता है कि आपका शरीर एक मामूली दिनचर्या संक्रमण को ठीक कर रहा है।',
    riskTitle: 'उत्कृष्ट स्वास्थ्य स्थिति',
    riskDesc: 'मूल्यांकन किए गए 92% पैरामीटर सामान्य सीमा के भीतर हैं। न्यूट्रोफिल में हल्की वृद्धि देखी गई है, जिसके लिए सामान्य स्वास्थ्य निगरानी की आवश्यकता है।',
  },
  'ta-IN': {
    transcript: 'உங்கள் இரத்தப் பரிசோதனை (CBC) அறிக்கை உங்கள் ஒட்டுமொத்த ஆரோக்கியம் மிகச்சிறப்பாக இருப்பதைக் காட்டுகிறது. ஹீமோகுளோபின் மற்றும் வெள்ளை இரத்த அணுக்கள் முற்றிலும் இயல்பானவை. நியூட்ரோபில்கள் 72% சற்று அதிகரித்துள்ளன, இது சாதாரண நோய்த்தொற்றுக்குப் பிறகு பொதுவானது.',
    summary: 'உங்கள் முழு இரத்த அணுக்கள் பரிசோதனை (CBC) மிகவும் ஆரோக்கியமாக உள்ளது. பெரும்பாலான இரத்த அணுக்கள் இயல்பான வரம்பிற்குள் உள்ளன. நியூட்ரோபில்கள் சற்று அதிகரித்துள்ளன, இது உங்கள் உடல் ஒரு லேசான தொற்றை குணப்படுத்துவதைக் குறிக்கிறது.',
    riskTitle: 'சிறந்த ஆரோக்கிய நிலை',
    riskDesc: 'மதிப்பிடப்பட்ட 92% அளவுருக்கள் இயல்பான வரம்பிற்குள் உள்ளன. நியூட்ரோபில்களில் சிறிய உயர்வு கண்டறியப்பட்டுள்ளது.',
  },
  'te-IN': {
    transcript: 'మీ రక్తం యొక్క పరీక్ష (CBC) నివేదిక మీ ఆరోగ్యం చాలా బాగుందని చూపిస్తోంది. హిమోగ్లోబిన్ మరియు తెల్ల రక్త కణాలు పూర్తిగా సాధారణంగా ఉన్నాయి. న్యూట్రోఫిల్స్ 72% కొద్దిగా పెరిగాయి, ఇది సాధారణ ఇన్ఫెక్షన్ తర్వాత సాధారణమే.',
    summary: 'మీ కంప్లీట్ బ్లడ్ కౌంట్ (CBC) నివేదిక చాలా ఆరోగ్యకరంగా ఉంది. రక్తం కణాలు సాధారణ పరిధిలో ఉన్నాయి. న్యూట్రోఫిల్స్ కొద్దిగా పెరిగాయి, మీ శరీరం ఇన్ఫెక్షన్ నుండి కోలుకుంటోందని ఇది సూచిస్తుంది.',
    riskTitle: 'అద్భుతమైన ఆరోగ్య ప్రొఫైల్',
    riskDesc: 'అంచనా వేసిన 92% పారామితులు సాధారణ పరిధిలో ఉన్నాయి. న్యూట్రోఫిల్స్‌లో స్వల్ప పెరుగుదల కనుగొనబడింది.',
  },
  'bn-IN': {
    transcript: 'আপনার সম্পূর্ণ রক্ত পরীক্ষা (CBC) রিপোর্ট নির্দেশ করে যে আপনার সামগ্রিক স্বাস্থ্য খুব ভালো। হিমোগ্লোবিন এবং শ্বেত রক্তকণিকা সম্পূর্ণ স্বাভাবিক। নিউট্রোফিলস সামান্য বৃদ্ধি পেয়ে ৭২% হয়েছে, যা সাধারণ সংক্রমণের পর স্বাভাবিক।',
    summary: 'আপনার সম্পূর্ণ রক্ত পরীক্ষা (CBC) সামগ্রিকভাবে খুব স্বাস্থ্যকর। বেশিরভাগ রক্তকণিকা স্বাভাবিক সীমার মধ্যে রয়েছে। আপনার নিউট্রোফিলস সামান্য বৃদ্ধি পেয়েছে, যা নির্দেশ করে যে আপনার শরীর সংক্রমণ নিরাময় করছে।',
    riskTitle: 'চমৎকার স্বাস্থ্য প্রোফাইল',
    riskDesc: 'মূল্যায়ন করা ৯২% প্যারামিটার স্বাভাবিক সীমার মধ্যে রয়েছে। নিউট্রোফিলে সামান্য বৃদ্ধি সনাক্ত করা হয়েছে।',
  },
  'mr-IN': {
    transcript: 'तुमचा रक्त तपासणी (CBC) अहवाल दर्शवतो की तुमचे एकंदरीत आरोग्य उत्तम आहे. हिमोग्लोबिन आणि पांढऱ्या पेशी पूर्णपणे सामान्य आहेत. न्यूट्रोफिल्स ७२% थोडे वाढले आहेत, जे किरकोळ संसर्गानंतर सामान्य आहे.',
    summary: 'तुमची संपूर्ण रक्त तपासणी (CBC) उत्तम आहे. बहुतेक पेशी सामान्य मर्यादेत आहेत. तुमचे न्यूट्रोफिल्स थोडे वाढले आहेत, जे दर्शवते की तुमचे शरीर किरकोळ संसर्गातून सावरत आहे.',
    riskTitle: 'उत्कृष्ट आरोग्य स्थिती',
    riskDesc: 'मूल्यमापन केलेले ९२% घटक सामान्य मर्यादेत आहेत. न्यूट्रोफिल्समध्ये हलकी वाढ झाली आहे.',
  },
  'gu-IN': {
    transcript: 'તમારો બ્લડ રિપોર્ટ (CBC) દર્શાવે છે કે તમારું એકંદર સ્વાસ્થ્ય ખૂબ સારું છે. હિમોગ્લોબિન અને સફેદ રક્તકણો સંપૂર્ણપણે સામાન્ય છે. ન્યુટ્રોફિલ્સ 72% થોડા વધારે છે, જે સામાન્ય ચેપ પછી સામાન્ય છે.',
    summary: 'તમારો સંપૂર્ણ બ્લડ કાઉન્ટ (CBC) ખૂબ જ સ્વસ્થ છે. મોટાભાગના કોષો સામાન્ય શ્રેણીમાં છે. તમારા ન્યુટ્રોફિલ્સ થોડા વધારે છે, જે દર્શાવે છે કે તમારું શરીર ચેપમાંથી મુક્ત થઈ રહ્યું છે.',
    riskTitle: 'ઉત્તમ સ્વાસ્થ્ય પ્રોફાઇલ',
    riskDesc: 'મૂલ્યાંકન કરાયેલ 92% પરિમાણો સામાન્ય મર્યાદામાં છે. ન્યુટ્રોફિલ્સમાં સામાન્ય વધારો જોવા મળ્યો છે.',
  },
  'kn-IN': {
    transcript: 'ನಿಮ್ಮ ರಕ್ತ ಪರೀಕ್ಷೆ (CBC) ವರದಿಯು ನಿಮ್ಮ ಒಟ್ಟಾರೆ ಆರೋಗ್ಯವು ಅತ್ಯುತ್ತಮವಾಗಿದೆ ಎಂದು ತೋರಿಸುತ್ತದೆ. ಹಿಮೋಗ್ಲೋಬಿನ್ ಮತ್ತು ಬಿಳಿ ರಕ್ತ ಕಣಗಳು ಸಂಪೂರ್ಣವಾಗಿ ಸಾಮಾನ್ಯವಾಗಿದೆ. ನ್ಯೂಟ್ರೋಫಿಲ್ಗಳು 72% ಸ್ವಲ್ಪ ಹೆಚ್ಚಾಗಿವೆ, ಇದು ಸಾಮಾನ್ಯ ಸೋಂಕಿನ ನಂತರ ಸಾಮಾನ್ಯವಾಗಿದೆ.',
    summary: 'ನಿಮ್ಮ ಕಂಪ್ಲಿಟ್ ಬ್ಲಡ್ ಕೌಂಟ್ (CBC) ಅತ್ಯುತ್ತಮವಾಗಿದೆ. ಹೆಚ್ಚಿನ ರಕ್ತ ಕಣಗಳು ಸಾಮಾನ್ಯ ಮಿತಿಯಲ್ಲಿವೆ. ನಿಮ್ಮ ನ್ಯೂಟ್ರೋಫಿಲ್ಗಳು ಸ್ವಲ್ಪ ಹೆಚ್ಚಾಗಿವೆ, ಇದು ನಿಮ್ಮ ದೇಹವು ಸೋಂಕನ್ನು ಗುಣಪಡಿಸುತ್ತಿದೆ ಎಂದು ಸೂಚಿಸುತ್ತದೆ.',
    riskTitle: 'ಉತ್ತಮ ಆರೋಗ್ಯ ಪ್ರೊಫೈಲ್',
    riskDesc: 'ಮೌಲ್ಯಮಾಪನ ಮಾಡಿದ 92% ನಿಯತಾಂಕಗಳು ಸಾಮಾನ್ಯ ಮಿತಿಯಲ್ಲಿವೆ. ನ್ಯೂಟ್ರೋಫಿಲ್‌ಗಳಲ್ಲಿ ಸ್ವಲ್ಪ ಏರಿಕೆ ಕಂಡುಬಂದಿದೆ.',
  },
  'ml-IN': {
    transcript: 'നിങ്ങളുടെ രക്ത പരിശോധന (CBC) റിപ്പോർട്ട് നിങ്ങളുടെ മൊത്തത്തിലുള്ള ആരോഗ്യം വളരെ മികച്ചതാണെന്ന് കാണിക്കുന്നു. ഹീമോഗ്ലോബിനും ശ്വേത രക്താണുക്കളും പൂർണ്ണമായും സാധാരണ നിലയിലാണ്. ന്യൂട്രോഫിൽസ് 72% നേരിയ തോതിൽ വർദ്ധിച്ചിട്ടുണ്ട്.',
    summary: 'നിങ്ങളുടെ കംപ്ലീറ്റ് ബ്ലഡ് കൗണ്ട് (CBC) വളരെ മികച്ചതാണ്. മിക്ക രക്താണുക്കളും സാധാരണ പരിധിയിലാണ്. നിങ്ങളുടെ ന്യൂട്രോഫിൽസ് നേരിയ തോതിൽ വർദ്ധിച്ചിട്ടുണ്ട്, ഇത് ശരീരം അണുബാധയിൽ നിന്ന് മുക്തമാകുന്നുവെന്ന് സൂചിപ്പിക്കുന്നു.',
    riskTitle: 'മികച്ച ആരോഗ്യ പ്രൊഫൈൽ',
    riskDesc: 'മൂല്യനിർണ്ണയം ചെയ്ത 92% സൂചകങ്ങളും സാധാരണ പരിധിയിലാണ്. ന്യൂട്രോഫിലുകളിൽ ചെറിയ വർദ്ധനവ് കണ്ടെത്തി.',
  }
};

export const INITIAL_PATIENT: PatientProfile = {
  name: 'DOE, JANE M.',
  age: 38,
  gender: 'FEMALE',
  sampleDate: '18-AUG-2026',
  riskScore: 88,
  riskLevel: 'LOW RISK',
  riskTitle: 'Optimal Health Profile',
  riskDescription: '92% of evaluated markers are within normal range. Mild elevation detected in Neutrophils, requiring standard wellness monitoring.',
  normalCount: 4,
  varianceCount: 1,
};

export const INITIAL_LAB_PARAMETERS: LabParameter[] = [
  {
    id: '1',
    name: 'Hemoglobin (Hb)',
    category: 'Complete Blood Count',
    subText: 'Oxygen-carrying protein in red blood cells',
    observedValue: '13.8 g/dL',
    standardRange: '12.0 - 15.5 g/dL',
    status: 'NORMAL',
    explanation: 'Excellent! Your red blood cells have plenty of oxygen-carrying capacity.',
  },
  {
    id: '2',
    name: 'White Blood Cells (WBC)',
    category: 'Complete Blood Count',
    subText: 'Total immune system defense cell count',
    observedValue: '8.2 x10^3/uL',
    standardRange: '4.5 - 11.0 x10^3/uL',
    status: 'NORMAL',
    explanation: 'Normal range. Your body\'s primary immune defense force is standing by.',
  },
  {
    id: '3',
    name: 'Neutrophils (Absolute)',
    category: 'Complete Blood Count',
    subText: 'First-responder white blood cells for bacterial defense',
    observedValue: '72 %',
    standardRange: '40 - 65 %',
    status: 'HIGH',
    explanation: 'Slightly high. Neutrophils act like immune firefighters clearing minor inflammation or routine recovery.',
  },
  {
    id: '4',
    name: 'Platelets (PLT)',
    category: 'Complete Blood Count',
    subText: 'Blood clotting cell fragments',
    observedValue: '285 x10^3/uL',
    standardRange: '150 - 450 x10^3/uL',
    status: 'NORMAL',
    explanation: 'Perfect clotting balance without blood thickness issues.',
  },
  {
    id: '5',
    name: 'Serum Ferritin',
    category: 'Iron Stores Panel',
    subText: 'Cellular iron storage protein level',
    observedValue: '22 ng/mL',
    standardRange: '13 - 150 ng/mL',
    status: 'LOW',
    explanation: 'Low-normal iron reserves. Boosting iron-rich foods will prevent sluggish energy levels.',
  },
  {
    id: '6',
    name: 'Fasting Plasma Glucose',
    category: 'Metabolic Panel',
    subText: 'Blood sugar level after overnight fast',
    observedValue: '92 mg/dL',
    standardRange: '70 - 99 mg/dL',
    status: 'NORMAL',
    explanation: 'Optimal fasting blood sugar with normal insulin responsiveness.',
  }
];

export const INITIAL_DIET_PLAN: DietPlan = {
  include: [
    { title: 'Iron & Vitamin C', desc: 'Spinach, lentils (dal), bell peppers, and citrus fruits to boost ferritin storage.' },
    { title: 'Anti-Inflammatory', desc: 'Walnuts, chia seeds, turmeric (curcumin), and green tea to support immune recovery.' },
    { title: 'Hydration', desc: '2.5 - 3 Liters of water daily to maintain plasma fluid balance.' }
  ],
  avoid: [
    { title: 'Ultra-processed sugars', desc: 'Sweetened drinks, packaged sweets, and refined flour (maida) that trigger inflammation.' },
    { title: 'Excess Sodium', desc: 'Salty fried snacks to prevent fluid retention and blood pressure spikes.' },
    { title: 'Alcohol & Tobacco', desc: 'Avoid to preserve liver enzyme equilibrium.' }
  ],
  tips: [
    { title: 'Post-Meal Walking', desc: '15-minute gentle walk after dinner to improve insulin sensitivity.' },
    { title: 'Sleep Hygiene', desc: '7-8 hours of sound sleep to lower neutrophil inflammation markers.' }
  ]
};

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Is ReportSarthi a replacement for my doctor?',
    answer: 'No. ReportSarthi is an educational tool designed to help you understand medical vocabulary and reference ranges before or after speaking with your doctor. It does not provide medical diagnoses or prescribe treatment plans. Always consult a qualified healthcare provider for clinical medical decisions.',
  },
  {
    id: 'faq-2',
    question: 'How does Indian Language Voice Assistant work?',
    answer: 'Select your preferred Indian language (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, English India) from the top navbar selector, and the Voice Summary Reader will synthesize audio speech in that regional accent!',
  },
  {
    id: 'faq-3',
    question: 'How is the Health Risk Score calculated?',
    answer: 'The AI Health Risk Score evaluates your observed lab metrics against international medical reference bounds, calculating a weighted index from 0 to 100 to help you easily identify areas requiring clinical follow-up.',
  },
  {
    id: 'faq-4',
    question: 'Is my medical report data private and secure?',
    answer: 'Yes! All document parsing and text extraction occur with 256-bit encryption. Personal Identification Information (PII) like SSN, address, and insurance IDs are automatically masked on the client before AI inference.',
  }
];

export const TECH_NODES: TechNode[] = [
  {
    id: 'input',
    title: 'Document Ingestion',
    category: 'input',
    description: 'PDF/Image upload with client-side PII masking and pre-processing.',
    techs: ['Browser File API', 'Canvas API', 'Web Workers'],
  },
  {
    id: 'processing',
    title: 'AI OCR & NER Engine',
    category: 'processing',
    description: 'Optical Character Recognition & Medical Named Entity Recognition.',
    techs: ['EasyOCR / Tesseract', 'PyTorch LLM', 'Spacy Medical'],
  },
  {
    id: 'backend',
    title: 'FastAPI Microservice',
    category: 'backend',
    description: 'High-throughput async API endpoints computing health risk index & diet mapping.',
    techs: ['Python 3.11', 'FastAPI', 'Pydantic Validator'],
  },
  {
    id: 'client',
    title: 'React 18 Glass Canvas',
    category: 'client',
    description: 'Liquid glassmorphic UI, Speech Synthesis engine & real-time telemetry stream.',
    techs: ['React 18', 'Tailwind CSS', 'Web Speech API', 'TypeScript'],
  }
];

export const SAMPLE_REPORTS_PRESETS = [
  {
    name: 'Jane Doe - CBC & Metabolic Panel',
    patient: {
      name: 'DOE, JANE M.',
      age: 38,
      gender: 'FEMALE',
      sampleDate: '18-AUG-2026',
      riskScore: 88,
      riskLevel: 'LOW RISK' as const,
      riskTitle: 'Optimal Health Profile',
      riskDescription: '92% of evaluated markers are within normal range. Mild elevation detected in Neutrophils, requiring standard wellness monitoring.',
      normalCount: 4,
      varianceCount: 1,
    },
    params: INITIAL_LAB_PARAMETERS,
  },
  {
    name: 'Ramesh Kumar - Lipid & Diabetes Risk',
    patient: {
      name: 'KUMAR, RAMESH',
      age: 52,
      gender: 'MALE',
      sampleDate: '24-AUG-2026',
      riskScore: 64,
      riskLevel: 'MODERATE RISK' as const,
      riskTitle: 'Metabolic & Cholesterol Attention Needed',
      riskDescription: 'Elevated Fasting Glucose (128 mg/dL) and Serum Triglycerides indicate early metabolic strain. Immediate dietary modification advised.',
      normalCount: 3,
      varianceCount: 3,
    },
    params: [
      {
        id: 'r1',
        name: 'Fasting Plasma Glucose',
        category: 'Metabolic Panel',
        subText: 'Blood sugar after overnight fast',
        observedValue: '128 mg/dL',
        standardRange: '70 - 99 mg/dL',
        status: 'HIGH' as const,
        explanation: 'Elevated fasting glucose indicates insulin resistance. Dietary sugar reduction recommended.',
      },
      {
        id: 'r2',
        name: 'Serum Triglycerides',
        category: 'Lipid Panel',
        subText: 'Circulating blood fat concentration',
        observedValue: '210 mg/dL',
        standardRange: '< 150 mg/dL',
        status: 'HIGH' as const,
        explanation: 'High triglycerides increase cardiovascular stress. Limit refined carbs & fried foods.',
      },
      {
        id: 'r3',
        name: 'HDL Cholesterol',
        category: 'Lipid Panel',
        subText: 'Good protective cholesterol',
        observedValue: '38 mg/dL',
        standardRange: '> 40 mg/dL',
        status: 'LOW' as const,
        explanation: 'Mildly low good cholesterol. Increase omega-3 fats & aerobic walking.',
      },
      {
        id: 'r4',
        name: 'Hemoglobin (Hb)',
        category: 'Complete Blood Count',
        subText: 'Oxygen-carrying protein',
        observedValue: '14.5 g/dL',
        standardRange: '13.0 - 17.0 g/dL',
        status: 'NORMAL' as const,
        explanation: 'Normal red cell oxygen capacity.',
      }
    ],
  }
];

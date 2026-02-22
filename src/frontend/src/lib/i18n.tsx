import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  appTitle: { en: 'Smart Shopping Planner', hi: 'स्मार्ट शॉपिंग प्लानर' },
  appSubtitle: { en: 'Plan your grocery trips efficiently', hi: 'अपनी किराने की यात्रा को कुशलता से योजना बनाएं' },
  login: { en: 'Login', hi: 'लॉगिन' },
  logout: { en: 'Logout', hi: 'लॉगआउट' },
  loggingIn: { en: 'Logging in...', hi: 'लॉगिन हो रहा है...' },
  welcomeTitle: { en: 'Welcome!', hi: 'स्वागत है!' },
  welcomeDescription: { en: 'Please tell us your name to get started', hi: 'शुरू करने के लिए कृपया अपना नाम बताएं' },
  yourName: { en: 'Your Name', hi: 'आपका नाम' },
  enterYourName: { en: 'Enter your name', hi: 'अपना नाम दर्ज करें' },
  continue: { en: 'Continue', hi: 'जारी रखें' },
  saving: { en: 'Saving...', hi: 'सहेजा जा रहा है...' },
  nameRequired: { en: 'Name is required', hi: 'नाम आवश्यक है' },
  profileSaved: { en: 'Profile saved successfully', hi: 'प्रोफ़ाइल सफलतापूर्वक सहेजी गई' },
  profileSaveError: { en: 'Failed to save profile', hi: 'प्रोफ़ाइल सहेजने में विफल' },
  planYourShopping: { en: 'Plan Your Shopping', hi: 'अपनी खरीदारी की योजना बनाएं' },
  location: { en: 'Location', hi: 'स्थान' },
  locationPlaceholder: { en: 'Enter city or pincode', hi: 'शहर या पिनकोड दर्ज करें' },
  useMyLocation: { en: 'Use My Location', hi: 'मेरा स्थान उपयोग करें' },
  locating: { en: 'Locating...', hi: 'स्थान खोज रहे हैं...' },
  preferredDateTime: { en: 'Preferred Date & Time', hi: 'पसंदीदा तिथि और समय' },
  budget: { en: 'Budget', hi: 'बजट' },
  shoppingItems: { en: 'Shopping Items', hi: 'खरीदारी की वस्तुएं' },
  addItemPlaceholder: { en: 'Add an item...', hi: 'एक वस्तु जोड़ें...' },
  add: { en: 'Add', hi: 'जोड़ें' },
  startVoice: { en: 'Start voice input', hi: 'वॉयस इनपुट शुरू करें' },
  stopVoice: { en: 'Stop voice input', hi: 'वॉयस इनपुट बंद करें' },
  listeningForVoice: { en: 'Listening... Speak now', hi: 'सुन रहे हैं... अब बोलें' },
  quickBuyList: { en: 'Quick Buy List', hi: 'त्वरित खरीद सूची' },
  demoMode: { en: 'Demo Mode', hi: 'डेमो मोड' },
  sampleData: { en: 'Sample Data', hi: 'नमूना डेटा' },
  pastSchedules: { en: 'Past Schedules', hi: 'पिछले शेड्यूल' },
  discoverNearbyShops: { en: 'Discover Nearby Shops', hi: 'आस-पास की दुकानें खोजें' },
  dataProvider: { en: 'Data Provider', hi: 'डेटा प्रदाता' },
  apiKey: { en: 'API Key', hi: 'एपीआई कुंजी' },
  enterApiKey: { en: 'Enter API key', hi: 'एपीआई कुंजी दर्ज करें' },
  categoryFilteringNote: { en: 'Category filtering depends on provider data availability', hi: 'श्रेणी फ़िल्टरिंग प्रदाता डेटा उपलब्धता पर निर्भर करती है' },
  findShops: { en: 'Find Shops', hi: 'दुकानें खोजें' },
  searching: { en: 'Searching...', hi: 'खोज रहे हैं...' },
  editCategories: { en: 'Edit Categories', hi: 'श्रेणियां संपादित करें' },
  listView: { en: 'List View', hi: 'सूची दृश्य' },
  mapView: { en: 'Map View', hi: 'मानचित्र दृश्य' },
  openNow: { en: 'Open Now', hi: 'अभी खुला' },
  closed: { en: 'Closed', hi: 'बंद' },
  hoursUnknown: { en: 'Hours Unknown', hi: 'समय अज्ञात' },
  minutes: { en: 'min', hi: 'मिनट' },
  selected: { en: 'Selected', hi: 'चयनित' },
  locationRequired: { en: 'Location is required', hi: 'स्थान आवश्यक है' },
  itemsRequired: { en: 'At least one item is required', hi: 'कम से कम एक वस्तु आवश्यक है' },
  noShopsFound: { en: 'No shops found', hi: 'कोई दुकान नहीं मिली' },
  shopsDiscovered: { en: 'Found {{count}} shops', hi: '{{count}} दुकानें मिलीं' },
  discoveryError: { en: 'Failed to discover shops', hi: 'दुकानें खोजने में विफल' },
  noShopsFoundDescription: { en: 'Try adjusting your location, broadening your search, or enable demo mode', hi: 'अपना स्थान समायोजित करने, अपनी खोज को व्यापक बनाने या डेमो मोड सक्षम करने का प्रयास करें' },
  tryAgain: { en: 'Try Again', hi: 'पुनः प्रयास करें' },
  deliveryAlternativeSuggestion: { en: 'Consider using delivery apps as an alternative', hi: 'विकल्प के रूप में डिलीवरी ऐप्स का उपयोग करने पर विचार करें' },
  topRecommendations: { en: 'Top 3 Recommendations', hi: 'शीर्ष 3 सिफारिशें' },
  suggestedVisitTime: { en: 'Suggested Visit Time', hi: 'सुझाया गया समय' },
  selectThisShop: { en: 'Select This Shop', hi: 'यह दुकान चुनें' },
  exportSchedule: { en: 'Export & Save Schedule', hi: 'शेड्यूल निर्यात और सहेजें' },
  costEstimate: { en: 'Cost Estimate', hi: 'लागत अनुमान' },
  estimatedTotal: { en: 'Estimated Total', hi: 'अनुमानित कुल' },
  overBudget: { en: 'Over Budget', hi: 'बजट से अधिक' },
  withinBudget: { en: 'Within Budget', hi: 'बजट के भीतर' },
  highestCostItems: { en: 'Highest Cost Items', hi: 'सबसे महंगी वस्तुएं' },
  save: { en: 'Save', hi: 'सहेजें' },
  pricesAreEstimated: { en: 'Prices are estimated based on average market rates', hi: 'कीमतें औसत बाजार दरों के आधार पर अनुमानित हैं' },
  notesReminders: { en: 'Notes & Reminders', hi: 'नोट्स और रिमाइंडर' },
  addNotesPlaceholder: { en: 'Add notes or reminders...', hi: 'नोट्स या रिमाइंडर जोड़ें...' },
  downloadCalendar: { en: 'Download Calendar', hi: 'कैलेंडर डाउनलोड करें' },
  downloadPDF: { en: 'Download PDF', hi: 'पीडीएफ डाउनलोड करें' },
  saveSchedule: { en: 'Save Schedule', hi: 'शेड्यूल सहेजें' },
  calendarDownloaded: { en: 'Calendar event downloaded', hi: 'कैलेंडर इवेंट डाउनलोड किया गया' },
  pdfDownloaded: { en: 'PDF downloaded', hi: 'पीडीएफ डाउनलोड किया गया' },
  scheduleSaved: { en: 'Schedule saved successfully', hi: 'शेड्यूल सफलतापूर्वक सहेजा गया' },
  scheduleSaveError: { en: 'Failed to save schedule', hi: 'शेड्यूल सहेजने में विफल' },
  priceComparison: { en: 'Price Comparison', hi: 'मूल्य तुलना' },
  priceComparisonDisclaimer: { en: 'Estimated prices based on heuristics', hi: 'अनुमानित कीमतें अनुमान पर आधारित' },
  cheapestOption: { en: 'Cheapest', hi: 'सबसे सस्ता' },
  loading: { en: 'Loading...', hi: 'लोड हो रहा है...' },
  noSchedulesYet: { en: 'No schedules yet', hi: 'अभी तक कोई शेड्यूल नहीं' },
  shop: { en: 'Shop', hi: 'दुकान' },
  clone: { en: 'Clone', hi: 'क्लोन' },
  scheduleDeleted: { en: 'Schedule deleted', hi: 'शेड्यूल हटाया गया' },
  scheduleDeleteError: { en: 'Failed to delete schedule', hi: 'शेड्यूल हटाने में विफल' },
  scheduleCloned: { en: 'Schedule cloned', hi: 'शेड्यूल क्लोन किया गया' },
  editItemCategories: { en: 'Edit Item Categories', hi: 'वस्तु श्रेणियां संपादित करें' },
  groceries: { en: 'Groceries', hi: 'किराना' },
  snacks: { en: 'Snacks', hi: 'स्नैक्स' },
  beverages: { en: 'Beverages', hi: 'पेय पदार्थ' },
  dairy: { en: 'Dairy', hi: 'डेयरी' },
  bakery: { en: 'Bakery', hi: 'बेकरी' },
  household: { en: 'Household', hi: 'घरेलू' },
  yourLocation: { en: 'Your Location', hi: 'आपका स्थान' },
  noShopsToDisplay: { en: 'No shops to display on map', hi: 'मानचित्र पर प्रदर्शित करने के लिए कोई दुकान नहीं' },
  mapPoweredBy: { en: 'Map powered by', hi: 'मानचित्र द्वारा संचालित' },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language;
    if (stored && (stored === 'en' || stored === 'hi')) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, params?: Record<string, any>): string => {
    const translation = translations[key]?.[language] || translations[key]?.en || key;
    
    if (params) {
      return Object.entries(params).reduce(
        (str, [key, value]) => str.replace(`{{${key}}}`, String(value)),
        translation
      );
    }
    
    return translation;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}

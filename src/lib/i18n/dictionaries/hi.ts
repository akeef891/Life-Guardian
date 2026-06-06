import type { Dictionary } from "./en";

export const hi: Dictionary = {
  nav: {
    dashboard: "डैशबोर्ड",
    profile: "आपात प्रोफ़ाइल",
    qrCard: "QR कार्ड",
    sos: "SOS",
    resources: "संसाधन",
    checkIn: "चेक-इन",
    preparedness: "तैयारी",
  },
  common: {
    loading: "लोड हो रहा है…",
    openMaps: "Google Maps में खोलें",
    distance: "किमी दूर",
    retry: "पुनः प्रयास",
    save: "सहेजें",
  },
  resources: {
    title: "आपात संसाधन केंद्र",
    description: "नज़दीकी अस्पताल, पुलिस स्टेशन और एम्बुलेंस सेवाएँ खोजें।",
    hospitals: "नज़दीकी अस्पताल",
    police: "नज़दीकी पुलिस स्टेशन",
    ambulances: "नज़दीकी एम्बुलेंस",
    useLocation: "मेरा स्थान उपयोग करें",
    refreshLocation: "GPS और संसाधन रीफ़्रेश करें",
    acquiringGps: "उच्च सटीक GPS प्राप्त हो रहा है (30 सेकंड तक)…",
    gpsTimeout: "समय पर GPS फ़िक्स नहीं मिला। बाहर जाकर पुनः प्रयास करें।",
    locationError: "स्थान प्राप्त नहीं हो सका।",
    locationHint: "नज़दीकी सेवाओं के लिए संसाधन पेज पर स्थान सक्षम करें।",
    loadError: "संसाधन सूची लोड नहीं हो सकी। कृपया पुनः प्रयास करें।",
    unavailable:
      "लाइव मानचित्र डेटा अस्थायी रूप से उपलब्ध नहीं है। SOS और आपात प्रोफ़ाइल अभी भी उपयोग कर सकते हैं।",
    noResults: "आसपास कोई संसाधन नहीं मिला।",
    noResultsHint: "आपके GPS स्थान के 10 km के भीतर कोई संसाधन नहीं मिला।",
  },
  checkIn: {
    title: "परिवार सुरक्षा चेक-इन",
    description: "अपने परिवार को बताएं कि आप सुरक्षित हैं या मदद चाहिए।",
    safe: "सुरक्षित हूँ",
    needHelp: "सहायता चाहिए",
    traveling: "यात्रा पर",
    notePlaceholder: "परिवार के लिए वैकल्पिक नोट",
    latest: "नवीनतम स्थिति",
  },
  dashboard: {
    resourceCenter: "संसाधन केंद्र",
    nearestHospital: "नज़दीकी अस्पताल",
    nearestPolice: "नज़दीकी पुलिस",
    safetyStatus: "सुरक्षा स्थिति",
    communityAlerts: "सामुदायिक अलर्ट",
  },
};

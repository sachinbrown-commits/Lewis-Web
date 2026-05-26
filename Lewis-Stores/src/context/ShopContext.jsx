import { createContext, useContext, useEffect, useState } from 'react';
import {
  applyQaScenarioPack,
  assignSupportCase,
  addPaymentMethod,
  completeMission,
  createDefectReport,
  createReturn,
  createOrder,
  getDeliveries,
  createSupportCase,
  getDefectReports,
  getCurrentUser,
  getMissionLeaderboard,
  getMissionProgress,
  getOrders,
  getPaymentMethods,
  getQaAudit,
  getQaFlags,
  getQaScenarioPacks,
  getQaTrainingMissions,
  getQaTrainingPersonas,
  getReturns,
  getSupportCases,
  login,
  register,
  removePaymentMethod,
  resetTrainingSession,
  reviewDefectReport,
  startMission,
  updateQaFlag,
  updateReturnStatus,
  updateSupportCaseStatus,
  updateCurrentUser,
} from '../lib/api';

const ShopContext = createContext();

export function useShop() {
  return useContext(ShopContext);
}

const INITIAL_CREDIT_FORM = {
  // Step 1 – Personal Info
  fullName: '',
  idNumber: '',
  email: '',
  phone: '',
  grossIncome: '',
  netIncome: '',
  expenses: '',
  // Step 2 – Employment
  employer: '',
  industry: '',
  yearsAtJob: '',
  employmentType: '',
  // Result
  submitted: false,
  approved: null,
  referenceNumber: '',
  creditLimit: 0,
};

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('ls_cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [toastMessage, setToastMessage] = useState(null);
  const [creditForm, setCreditForm] = useState(INITIAL_CREDIT_FORM);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('ls_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [authToken, setAuthToken] = useState(localStorage.getItem('ls_token') || '');
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);
  const [supportCases, setSupportCases] = useState([]);
  const [qaFlags, setQaFlags] = useState([]);
  const [qaAuditLogs, setQaAuditLogs] = useState([]);
  const [qaScenarioPacks, setQaScenarioPacks] = useState([]);
  const [trainingMissions, setTrainingMissions] = useState([]);
  const [trainingPersonas, setTrainingPersonas] = useState([]);
  const [activeTrainingPersona, setActiveTrainingPersona] = useState(() => localStorage.getItem('ls_training_persona') || 'customer');
  const [missionProgress, setMissionProgress] = useState([]);
  const [missionLeaderboard, setMissionLeaderboard] = useState([]);
  const [defectReports, setDefectReports] = useState([]);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = cartItems.length > 0 ? Math.round(cartSubtotal * 0.15) : 0;
  const shipping = cartSubtotal > 0 && cartSubtotal < 5000 ? 499 : 0;
  const cartTotal = cartSubtotal + tax + shipping;

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (product, quantity = 1, variant = 'Standard') => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.variant === variant);
      if (existing) {
        return prev.map(item => item.id === product.id && item.variant === variant
          ? { ...item, quantity: item.quantity + quantity }
          : item
        );
      }
      return [...prev, { ...product, variant, quantity }];
    });
    showToast(`${product.title} added to cart`);
  };

  const removeFromCart = (id, variant) => {
    setCartItems(prev => prev.filter(i => !(i.id === id && i.variant === variant)));
  };

  const updateQuantity = (id, variant, delta) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id && item.variant === variant) {
          const newQ = item.quantity + delta;
          if (newQ > 0) return { ...item, quantity: newQ };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    localStorage.setItem('ls_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const saveAuth = (token, user) => {
    setAuthToken(token);
    setCurrentUser(user);
    localStorage.setItem('ls_token', token);
    localStorage.setItem('ls_user', JSON.stringify(user));
  };

  const loginUser = async (email, password) => {
    const result = await login(email, password);
    saveAuth(result.token || result.Token, result.user || result.User);
    showToast(`Welcome back, ${(result.user || result.User).fullName || (result.user || result.User).email}`);
    return result.user || result.User;
  };

  const registerUser = async ({ fullName, email, password, phone, address }) => {
    const result = await register({ fullName, email, password, phone, address });
    saveAuth(result.token || result.Token, result.user || result.User);
    showToast('Account created successfully.');
    return result.user || result.User;
  };

  const logoutUser = () => {
    setAuthToken('');
    setCurrentUser(null);
    setOrders([]);
    setDeliveries([]);
    setPaymentMethods([]);
    localStorage.removeItem('ls_token');
    localStorage.removeItem('ls_user');
    showToast('You have been logged out.');
  };

  const refreshProfile = async () => {
    if (!localStorage.getItem('ls_token')) return null;
    const profile = await getCurrentUser();
    setCurrentUser(profile);
    localStorage.setItem('ls_user', JSON.stringify(profile));
    return profile;
  };

  const updateProfile = async (payload) => {
    const updated = await updateCurrentUser(payload);
    setCurrentUser(updated);
    localStorage.setItem('ls_user', JSON.stringify(updated));
    showToast('Profile updated successfully.');
    return updated;
  };

  const loadOrders = async () => {
    if (!localStorage.getItem('ls_token')) {
      setOrders([]);
      return [];
    }
    const data = await getOrders();
    setOrders(data || []);
    return data || [];
  };

  const loadDeliveries = async (params = {}) => {
    if (!localStorage.getItem('ls_token')) {
      setDeliveries([]);
      return [];
    }

    const data = await getDeliveries(params);
    setDeliveries(data || []);
    return data || [];
  };

  const placeOrder = async (payload) => {
    const created = await createOrder(payload);
    setOrders(prev => [created, ...prev]);
    return created;
  };

  const loadPaymentMethods = async () => {
    if (!localStorage.getItem('ls_token')) {
      setPaymentMethods([]);
      return [];
    }
    const data = await getPaymentMethods();
    setPaymentMethods(data || []);
    return data || [];
  };

  const savePaymentMethod = async (payload) => {
    const created = await addPaymentMethod(payload);
    await loadPaymentMethods();
    showToast('Payment method saved.');
    return created;
  };

  const deletePaymentMethod = async (id) => {
    await removePaymentMethod(id);
    await loadPaymentMethods();
    showToast('Payment method removed.');
  };

  const loadReturnRequests = async () => {
    if (!localStorage.getItem('ls_token')) {
      setReturnRequests([]);
      return [];
    }

    const data = await getReturns();
    setReturnRequests(data || []);
    return data || [];
  };

  const submitReturnRequest = async (payload) => {
    const created = await createReturn(payload);
    await loadReturnRequests();
    showToast('Return request submitted.');
    return created;
  };

  const changeReturnStatus = async (id, payload) => {
    const updated = await updateReturnStatus(id, payload);
    await loadReturnRequests();
    showToast('Return status updated.');
    return updated;
  };

  const loadSupportCases = async (params = {}) => {
    if (!localStorage.getItem('ls_token')) {
      setSupportCases([]);
      return [];
    }

    const data = await getSupportCases(params);
    setSupportCases(data || []);
    return data || [];
  };

  const submitSupportCase = async (payload) => {
    const created = await createSupportCase(payload);
    await loadSupportCases();
    showToast('Support case created.');
    return created;
  };

  const assignCase = async (id, assignedToUserId) => {
    const updated = await assignSupportCase(id, assignedToUserId);
    await loadSupportCases();
    showToast('Case assigned.');
    return updated;
  };

  const changeSupportCaseStatus = async (id, status) => {
    const updated = await updateSupportCaseStatus(id, status);
    await loadSupportCases();
    showToast('Case status updated.');
    return updated;
  };

  const loadQaFlags = async () => {
    if (!localStorage.getItem('ls_token')) {
      setQaFlags([]);
      return [];
    }
    const data = await getQaFlags();
    setQaFlags(data || []);
    return data || [];
  };

  const toggleQaFlag = async (key, isEnabled) => {
    const updated = await updateQaFlag(key, isEnabled);
    await loadQaFlags();
    showToast(`Flag ${key} updated.`);
    return updated;
  };

  const loadQaAuditLogs = async (params = {}) => {
    if (!localStorage.getItem('ls_token')) {
      setQaAuditLogs([]);
      return [];
    }
    const data = await getQaAudit(params);
    setQaAuditLogs(data || []);
    return data || [];
  };

  const loadQaScenarioPacks = async () => {
    if (!localStorage.getItem('ls_token')) {
      setQaScenarioPacks([]);
      return [];
    }
    const data = await getQaScenarioPacks();
    setQaScenarioPacks(data || []);
    return data || [];
  };

  const loadTrainingMissions = async () => {
    if (!localStorage.getItem('ls_token')) {
      setTrainingMissions([]);
      return [];
    }
    const data = await getQaTrainingMissions();
    setTrainingMissions(data || []);
    return data || [];
  };

  const loadTrainingPersonas = async () => {
    if (!localStorage.getItem('ls_token')) {
      setTrainingPersonas([]);
      return [];
    }
    const data = await getQaTrainingPersonas();
    setTrainingPersonas(data || []);
    return data || [];
  };

  const setTrainingPersona = (personaKey) => {
    setActiveTrainingPersona(personaKey);
    localStorage.setItem('ls_training_persona', personaKey);
    showToast(`Training persona set to ${personaKey}`);
  };

  const loadMissionProgress = async () => {
    if (!localStorage.getItem('ls_token')) {
      setMissionProgress([]);
      return [];
    }
    const data = await getMissionProgress();
    setMissionProgress(data || []);
    return data || [];
  };

  const loadMissionLeaderboard = async () => {
    if (!localStorage.getItem('ls_token')) {
      setMissionLeaderboard([]);
      return [];
    }
    const data = await getMissionLeaderboard();
    setMissionLeaderboard(data || []);
    return data || [];
  };

  const beginMission = async ({ missionKey, personaKey }) => {
    const result = await startMission({ missionKey, personaKey });
    await loadMissionProgress();
    showToast(`Mission started: ${missionKey}`);
    return result;
  };

  const finishMission = async ({ missionKey, personaKey, findingsCount = 0, score = null }) => {
    const result = await completeMission({ missionKey, personaKey, findingsCount, score });
    await Promise.all([loadMissionProgress(), loadMissionLeaderboard()]);
    showToast(`Mission completed: ${missionKey}`);
    return result;
  };

  const loadDefectReports = async () => {
    if (!localStorage.getItem('ls_token')) {
      setDefectReports([]);
      return [];
    }
    const data = await getDefectReports();
    setDefectReports(data || []);
    return data || [];
  };

  const submitDefectReport = async (payload) => {
    const created = await createDefectReport(payload);
    await loadDefectReports();
    showToast('Defect report submitted.');
    return created;
  };

  const reviewStudentDefectReport = async (id, payload) => {
    const updated = await reviewDefectReport(id, payload);
    await loadDefectReports();
    showToast('Defect report reviewed.');
    return updated;
  };

  const resetClassSession = async (payload) => {
    const result = await resetTrainingSession(payload);
    await Promise.all([
      loadQaFlags(),
      loadQaAuditLogs({ take: 80 }),
      loadDefectReports(),
      loadMissionProgress(),
      loadMissionLeaderboard(),
    ]);
    showToast('Class session reset completed.');
    return result;
  };

  const applyScenarioPack = async (key) => {
    const result = await applyQaScenarioPack(key);
    await Promise.all([loadQaFlags(), loadQaAuditLogs({ take: 50 })]);
    showToast(`Scenario pack applied: ${key}`);
    return result;
  };

  useEffect(() => {
    if (!authToken) return;
    refreshProfile().catch(() => {
      logoutUser();
    });
    loadOrders().catch(() => {});
    loadDeliveries().catch(() => {});
    loadPaymentMethods().catch(() => {});
    loadReturnRequests().catch(() => {});
    loadSupportCases().catch(() => {});
    loadQaFlags().catch(() => {});
    loadQaAuditLogs({ take: 50 }).catch(() => {});
    loadQaScenarioPacks().catch(() => {});
    loadTrainingMissions().catch(() => {});
    loadTrainingPersonas().catch(() => {});
    loadMissionProgress().catch(() => {});
    loadMissionLeaderboard().catch(() => {});
    loadDefectReports().catch(() => {});
  }, [authToken]);

  // Credit form handlers
  const updateCreditForm = (fields) => {
    setCreditForm(prev => ({ ...prev, ...fields }));
  };

  const submitCreditApplication = () => {
    const net = parseFloat(String(creditForm.netIncome).replace(/[^0-9.]/g, '')) || 0;
    const expenses = parseFloat(String(creditForm.expenses).replace(/[^0-9.]/g, '')) || 0;
    const disposable = net - expenses;
    const approved = net >= 3000 && disposable >= 1000 && creditForm.yearsAtJob >= 1;
    const creditLimit = approved ? Math.min(Math.round(disposable * 3), 60000) : 0;
    const refNum = `LWS-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

    setCreditForm(prev => ({
      ...prev,
      submitted: true,
      approved,
      creditLimit,
      referenceNumber: refNum,
    }));
  };

  const resetCreditForm = () => {
    setCreditForm(INITIAL_CREDIT_FORM);
  };

  return (
    <ShopContext.Provider value={{
      cartItems,
      cartCount,
      cartSubtotal,
      cartTotal,
      tax,
      shipping,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      showToast,
      creditForm,
      updateCreditForm,
      submitCreditApplication,
      resetCreditForm,
      searchQuery,
      setSearchQuery,
      currentUser,
      authToken,
      isAuthenticated: !!authToken,
      loginUser,
      registerUser,
      logoutUser,
      refreshProfile,
      updateProfile,
      orders,
      loadOrders,
      deliveries,
      loadDeliveries,
      placeOrder,
      paymentMethods,
      loadPaymentMethods,
      savePaymentMethod,
      deletePaymentMethod,
      returnRequests,
      loadReturnRequests,
      submitReturnRequest,
      changeReturnStatus,
      supportCases,
      loadSupportCases,
      submitSupportCase,
      assignCase,
      changeSupportCaseStatus,
      qaFlags,
      loadQaFlags,
      toggleQaFlag,
      qaAuditLogs,
      loadQaAuditLogs,
      qaScenarioPacks,
      loadQaScenarioPacks,
      applyScenarioPack,
      trainingMissions,
      loadTrainingMissions,
      trainingPersonas,
      loadTrainingPersonas,
      activeTrainingPersona,
      setTrainingPersona,
      missionProgress,
      loadMissionProgress,
      beginMission,
      finishMission,
      missionLeaderboard,
      loadMissionLeaderboard,
      defectReports,
      loadDefectReports,
      submitDefectReport,
      reviewStudentDefectReport,
      resetClassSession,
    }}>
      {children}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--primary)',
          color: '#fff',
          padding: '1rem 1.5rem',
          borderRadius: '4px',
          boxShadow: '0 8px 24px rgba(0,31,92,0.25)',
          zIndex: 9999,
          animation: 'slideIn 0.3s ease-out forwards',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          maxWidth: '360px',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {toastMessage}
        </div>
      )}
    </ShopContext.Provider>
  );
}

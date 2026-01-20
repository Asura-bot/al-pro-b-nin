
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, 
  MapPin, 
  ChevronRight, 
  Star, 
  Phone, 
  CheckCircle, 
  Filter,
  DollarSign,
  Smartphone,
  AlertTriangle,
  ArrowLeft,
  X,
  // Fix: Added missing lucide-react icons used in the component
  Search,
  Briefcase,
  ShieldCheck,
  Wrench,
  Zap
} from 'lucide-react';
import { 
  UserRole, 
  ServiceCategory, 
  User, 
  Job, 
  JobStatus 
} from './types';
import { 
  CATEGORIES, 
  MOCK_PROVIDERS, 
  NAV_ITEMS 
} from './constants';
import { getSmartJobDescription } from './services/geminiService';

// --- Reusable Components ---

const Rating = ({ value }: { value: number }) => (
  <div className="flex items-center gap-1">
    <Star className="text-yellow-400 fill-yellow-400" size={14} />
    <span className="text-sm font-semibold">{value.toFixed(1)}</span>
  </div>
);

const ProviderCard = ({ provider, onClick }: { provider: User, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center active:scale-[0.98] transition-transform"
  >
    <img src={provider.avatar} alt={provider.name} className="w-16 h-16 rounded-full object-cover bg-gray-200" />
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">{provider.name}</h3>
        {provider.isVerified && <CheckCircle size={16} className="text-blue-500" />}
      </div>
      <p className="text-xs text-gray-500 mb-1">{provider.specialty} • {provider.location?.neighborhood}</p>
      <div className="flex items-center gap-3">
        <Rating value={provider.rating || 0} />
        <span className="text-xs text-gray-400">{provider.completedJobs} missions</span>
      </div>
    </div>
    <ChevronRight size={20} className="text-gray-300" />
  </div>
);

const CategoryChip = ({ category, isSelected, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-3 min-w-[90px] rounded-2xl transition-all ${
      isSelected ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white text-gray-600 border border-gray-100'
    }`}
  >
    <div className={`${isSelected ? 'text-white' : category.color} p-2 rounded-xl`}>
      {category.icon}
    </div>
    <span className="text-[11px] font-medium whitespace-nowrap">{category.name}</span>
  </button>
);

const MobileMoneyModal = ({ type, amount, onComplete, onClose }: any) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');

  const handlePay = () => {
    setStep(2);
    setTimeout(() => setStep(3), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Paiement Mobile Money</h2>
            <button onClick={onClose}><X /></button>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-orange-500 bg-orange-50">
                <div className={`p-3 rounded-xl bg-white shadow-sm`}>
                  <Smartphone className={type === 'MTN' ? 'text-yellow-500' : 'text-blue-500'} />
                </div>
                <div>
                  <p className="font-bold">{type === 'MTN' ? 'MTN MoMo' : 'Moov Money'}</p>
                  <p className="text-xs text-gray-500">Bénin (+229)</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Numéro de téléphone</label>
                <input 
                  type="tel" 
                  placeholder="97 00 00 00"
                  className="w-full p-4 rounded-xl bg-gray-50 border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-xl flex gap-3">
                <AlertTriangle size={20} className="text-blue-500 shrink-0" />
                <p className="text-xs text-blue-700">
                  L'argent sera bloqué de manière sécurisée (Escrow) jusqu'à la fin de la mission.
                </p>
              </div>

              <button 
                onClick={handlePay}
                disabled={!phone}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50"
              >
                Payer {amount.toLocaleString()} FCFA
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="py-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-medium animate-pulse">En attente de validation sur votre téléphone...</p>
              <p className="text-xs text-gray-500 text-center">Composez *122# ou validez la notification push</p>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-2xl font-bold">Paiement Réussi !</h3>
              <p className="text-gray-500">L'artisan a été notifié et va se mettre au travail.</p>
              <button 
                onClick={onComplete}
                className="w-full mt-4 bg-gray-900 text-white py-4 rounded-xl font-bold"
              >
                Continuer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Application Pages ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [viewingProvider, setViewingProvider] = useState<User | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [paymentType, setPaymentType] = useState<'MTN' | 'MOOV' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [location, setLocation] = useState('Cotonou, Bénin');

  const [promptText, setPromptText] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  // Logic for smart description with Gemini
  const handleSmartDescribe = async () => {
    if (!promptText || !viewingProvider?.specialty) return;
    setIsGeneratingDescription(true);
    const result = await getSmartJobDescription(viewingProvider.specialty, promptText);
    setPromptText(result);
    setIsGeneratingDescription(false);
  };

  const filteredProviders = useMemo(() => {
    return MOCK_PROVIDERS.filter(p => {
      const matchCat = !selectedCategory || p.specialty === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location?.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleBook = () => {
    if (!viewingProvider) return;
    setPaymentType('MTN'); // Simple flow
  };

  const completeBooking = () => {
    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: 'c1',
      providerId: viewingProvider?.id || '',
      category: viewingProvider?.specialty || ServiceCategory.PLUMBING,
      description: promptText,
      amount: 5000, // Dummy fixed amount
      status: JobStatus.PAID_ESCROW,
      createdAt: Date.now(),
      location: location,
    };
    setJobs([newJob, ...jobs]);
    setPaymentType(null);
    setViewingProvider(null);
    setPromptText('');
    setActiveTab('jobs');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-24 relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 pt-6 pb-4 sticky top-0 z-30 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-xl text-white">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Localisation</p>
              <p className="text-sm font-bold text-gray-800">{location}</p>
            </div>
          </div>
          <button className="relative p-2 bg-gray-50 rounded-xl">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un maçon, plombier..."
            className="w-full bg-gray-100 py-3 pl-12 pr-4 rounded-2xl text-sm outline-none border border-transparent focus:bg-white focus:border-orange-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pt-4 space-y-6 overflow-y-auto no-scrollbar">
        
        {activeTab === 'home' && (
          <>
            <section className="bg-gray-900 rounded-[32px] p-6 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <h2 className="text-2xl font-bold leading-tight">Besoin d'un dépannage <span className="text-orange-400">immédiat ?</span></h2>
                <p className="text-xs text-gray-400">Trouvez les meilleurs artisans vérifiés de votre quartier.</p>
                <button 
                  onClick={() => setActiveTab('search')}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-transform inline-block mt-2"
                >
                  Trouver un Pro
                </button>
              </div>
              <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-orange-500/20 rounded-full blur-3xl"></div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Catégories populaires</h3>
                <button className="text-xs font-bold text-orange-500">Tout voir</button>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {CATEGORIES.map(cat => (
                  <CategoryChip 
                    key={cat.id} 
                    category={cat} 
                    isSelected={selectedCategory === cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id as ServiceCategory)}
                  />
                ))}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Proche de vous</h3>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Filter size={14} />
                  <span>Fidjrossè</span>
                </div>
              </div>
              <div className="space-y-4">
                {filteredProviders.length > 0 ? (
                  filteredProviders.map(p => (
                    <ProviderCard key={p.id} provider={p} onClick={() => setViewingProvider(p)} />
                  ))
                ) : (
                  <div className="py-12 text-center text-gray-400 italic">Aucun artisan trouvé</div>
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === 'search' && (
          <section className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Explorer les talents</h2>
                <button className="p-2 bg-gray-100 rounded-lg"><Filter size={18} /></button>
             </div>
             <div className="bg-white rounded-2xl border p-4 shadow-sm mb-4">
               <p className="text-xs font-bold text-gray-400 mb-3 uppercase">Filtrer par zone</p>
               <div className="flex gap-2 flex-wrap">
                  {['Cotonou', 'Calavi', 'Porto-Novo', 'Ouidah'].map(city => (
                    <span key={city} className="px-3 py-1 bg-gray-50 border rounded-full text-xs cursor-pointer hover:bg-orange-50 hover:border-orange-200">{city}</span>
                  ))}
               </div>
             </div>
             {MOCK_PROVIDERS.map(p => (
                <ProviderCard key={p.id} provider={p} onClick={() => setViewingProvider(p)} />
             ))}
          </section>
        )}

        {activeTab === 'jobs' && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Mes Missions</h2>
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                <div className="p-6 bg-gray-100 rounded-full text-gray-300">
                  <Briefcase size={64} />
                </div>
                <p>Aucune mission active.</p>
                <button onClick={() => setActiveTab('home')} className="text-orange-500 font-bold">Trouver un artisan</button>
              </div>
            ) : (
              jobs.map(job => {
                const provider = MOCK_PROVIDERS.find(p => p.id === job.providerId);
                return (
                  <div key={job.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <img src={provider?.avatar} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <p className="font-bold">{provider?.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{job.category}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold">
                        {job.status === JobStatus.PAID_ESCROW ? 'ESCROW ACTIF' : job.status}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-600 line-clamp-2">{job.description}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                      <p className="font-bold text-orange-500">{job.amount.toLocaleString()} FCFA</p>
                      <div className="flex gap-2">
                         <button className="p-2 bg-gray-100 rounded-lg text-gray-500"><Phone size={16} /></button>
                         <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Valider Fin</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}

        {activeTab === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Tableau de Bord Admin</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border shadow-sm">
                <p className="text-xs text-gray-400 font-bold uppercase">Volume Total</p>
                <p className="text-xl font-extrabold text-orange-500">1.2M FCFA</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border shadow-sm">
                <p className="text-xs text-gray-400 font-bold uppercase">Artisans</p>
                <p className="text-xl font-extrabold">248</p>
              </div>
            </div>
            <div className="bg-blue-600 p-6 rounded-[32px] text-white space-y-3">
               <div className="flex items-center gap-2">
                 <ShieldCheck size={20} />
                 <h3 className="font-bold">Analyses IA (Gemini)</h3>
               </div>
               <p className="text-xs opacity-80 italic">"Les demandes en électricité ont augmenté de 25% à Calavi ce mois-ci. Envisagez une campagne de recrutement d'artisans dans cette zone."</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-700">Validations en attente</h3>
              <div className="bg-white p-4 rounded-xl border flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                  <div>
                    <p className="text-sm font-bold">Koffi Mensah</p>
                    <p className="text-[10px] text-gray-500">Peintre • Porto-Novo</p>
                  </div>
                </div>
                <button className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg font-bold">Vérifier</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md shadow-2xl shadow-gray-200 rounded-[28px] border border-gray-100 p-2 flex justify-between z-40">
        {NAV_ITEMS.map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 flex flex-col items-center py-2 transition-all gap-1 ${
              activeTab === item.id ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            <div className={`p-2 rounded-2xl transition-all ${activeTab === item.id ? 'bg-orange-50' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Provider Details Sheet */}
      {viewingProvider && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 overflow-hidden">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
            <div className="relative">
              <img src={viewingProvider.avatar} className="w-full h-48 object-cover rounded-t-[40px]" alt="" />
              <button 
                onClick={() => setViewingProvider(null)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40"
              >
                <X size={24} />
              </button>
              <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full">
                <div className="bg-orange-500 p-4 rounded-full text-white shadow-xl">
                  {CATEGORIES.find(c => c.id === viewingProvider.specialty)?.icon || <Wrench />}
                </div>
              </div>
            </div>
            
            <div className="pt-16 px-8 pb-8 overflow-y-auto no-scrollbar flex-1 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-2xl font-bold">{viewingProvider.name}</h2>
                  <Rating value={viewingProvider.rating || 0} />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={14} className="text-orange-500" />
                  <span>{viewingProvider.location?.neighborhood}, {viewingProvider.location?.city}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 bg-gray-50 p-4 rounded-2xl text-center">
                  <p className="text-xl font-bold">{viewingProvider.completedJobs}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Missions</p>
                </div>
                <div className="flex-1 bg-gray-50 p-4 rounded-2xl text-center">
                  <p className="text-xl font-bold">{viewingProvider.points}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Points Pro</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Décrivez votre besoin</h4>
                <div className="relative">
                  <textarea 
                    placeholder="Ex: Ma douche fuit depuis ce matin..."
                    className="w-full bg-gray-50 rounded-2xl p-4 text-sm min-h-[100px] outline-none border focus:border-orange-500 transition-colors"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                  />
                  <button 
                    onClick={handleSmartDescribe}
                    disabled={isGeneratingDescription || !promptText}
                    className="absolute bottom-3 right-3 bg-white border shadow-sm p-2 rounded-xl text-blue-500 active:scale-95 disabled:opacity-50"
                    title="Améliorer avec l'IA"
                  >
                    {isGeneratingDescription ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Zap size={18} fill="currentColor" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 px-1">L'IA de AlôPro vous aide à être précis pour l'artisan.</p>
              </div>

              <div className="flex gap-4 sticky bottom-0 bg-white pt-2">
                <button className="p-4 bg-gray-100 rounded-2xl text-gray-600 active:scale-95 transition-transform">
                  <Phone size={24} />
                </button>
                <button 
                  onClick={handleBook}
                  disabled={!promptText}
                  className="flex-1 bg-orange-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                >
                  Commander <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {paymentType && (
        <MobileMoneyModal 
          type={paymentType} 
          amount={5000} 
          onComplete={completeBooking} 
          onClose={() => setPaymentType(null)} 
        />
      )}
    </div>
  );
}

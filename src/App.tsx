import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import AppShell from './components/AppShell';
import ChecklistPage from './pages/ChecklistPage';
import SosPage from './pages/SosPage';
import AnalyticsPage from './pages/AnalyticsPage';
import StoryHubPage from './pages/story/StoryHubPage';
import ReframePage from './pages/story/ReframePage';
import LedgerPage from './pages/story/LedgerPage';
import PillarsPage from './pages/story/PillarsPage';
import PracticePage from './pages/present/PracticePage';
import QuickReframePage from './pages/story/QuickReframePage';
import GratitudePage from './pages/story/GratitudePage';
import SettingsPage from './pages/SettingsPage';
import CardsPage from './pages/story/CardsPage';
import CardDetailPage from './pages/story/CardDetailPage';
import { lazy, Suspense } from 'react';
// Faith pages load on demand (Nabil, 2026-11-15: keeps first paint light; 99 Names + 116 du'as are heavy).
const FaithHubPage = lazy(() => import('./pages/faith/FaithHubPage'));
const CamelPage = lazy(() => import('./pages/faith/CamelPage'));
const DhikrPage = lazy(() => import('./pages/faith/DhikrPage'));
const DuasPage = lazy(() => import('./pages/faith/DuasPage'));
const NamesPage = lazy(() => import('./pages/faith/NamesPage'));
const MuhasabahPage = lazy(() => import('./pages/faith/MuhasabahPage'));
const SignsPage = lazy(() => import('./pages/faith/SignsPage'));
const QuranPage = lazy(() => import('./pages/faith/FaithReadPages').then((m) => ({ default: m.QuranPage })));
const ShiftsPage = lazy(() => import('./pages/faith/FaithReadPages').then((m) => ({ default: m.ShiftsPage })));
const StudyPage = lazy(() => import('./pages/faith/FaithReadPages').then((m) => ({ default: m.StudyPage })));
const ListenPage = lazy(() => import('./pages/faith/ListenPage'));
const HomePage = lazy(() => import('./pages/faith/FaithReadPages').then((m) => ({ default: m.HomePage })));
import Onboarding from './components/Onboarding';
import RemindersPage from './pages/RemindersPage';
import ReminderEngine from './components/ReminderEngine';
import UpdatePrompt from './components/UpdatePrompt';
import './reminders.css';
import './story.css';
import { initGlobalButtonSounds } from './utils/audio';

/** GSAP page entrance (Nabil, 2026-11-15: replaces framer-motion). Cisco easing; reduced motion = no motion. */
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from(ref.current, { opacity: 0, y: 12, duration: 0.6, ease: 'expo.out', clearProps: 'transform,opacity' });
  }, { scope: ref });
  return (
    <div ref={ref} className="page-transition-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
};

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const cleanup = initGlobalButtonSounds();
    return cleanup;
  }, []);

  // Every new screen starts at the top
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <AppShell>
      <ReminderEngine />
      <UpdatePrompt />
      <Onboarding />
      
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<PageTransition><ChecklistPage /></PageTransition>} />
          <Route path="/practice" element={<PageTransition><PracticePage /></PageTransition>} />
          <Route path="/reflect" element={<PageTransition><StoryHubPage /></PageTransition>} />
          <Route path="/reflect/quick" element={<PageTransition><QuickReframePage /></PageTransition>} />
          <Route path="/reflect/reframe" element={<PageTransition><ReframePage /></PageTransition>} />
          <Route path="/reflect/cards" element={<PageTransition><CardsPage /></PageTransition>} />
          <Route path="/reflect/cards/:id" element={<PageTransition><CardDetailPage /></PageTransition>} />
          <Route path="/reflect/gratitude" element={<PageTransition><GratitudePage /></PageTransition>} />
          <Route path="/reflect/ledger" element={<PageTransition><LedgerPage /></PageTransition>} />
          <Route path="/reflect/pillars" element={<PageTransition><PillarsPage /></PageTransition>} />
          <Route path="/faith" element={<PageTransition><FaithHubPage /></PageTransition>} />
          <Route path="/faith/camel" element={<PageTransition><CamelPage /></PageTransition>} />
          <Route path="/faith/dhikr" element={<PageTransition><DhikrPage /></PageTransition>} />
          <Route path="/faith/duas" element={<PageTransition><DuasPage /></PageTransition>} />
          <Route path="/faith/names" element={<PageTransition><NamesPage /></PageTransition>} />
          <Route path="/faith/quran" element={<PageTransition><QuranPage /></PageTransition>} />
          <Route path="/faith/shifts" element={<PageTransition><ShiftsPage /></PageTransition>} />
          <Route path="/faith/study" element={<PageTransition><StudyPage /></PageTransition>} />
          <Route path="/faith/listen" element={<PageTransition><ListenPage /></PageTransition>} />
          <Route path="/faith/home" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/reflect/muhasabah" element={<PageTransition><MuhasabahPage /></PageTransition>} />
          <Route path="/progress/signs" element={<PageTransition><SignsPage /></PageTransition>} />
          <Route path="/progress" element={<PageTransition><AnalyticsPage /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
          <Route path="/reminders" element={<PageTransition><RemindersPage /></PageTransition>} />
          <Route path="/sos" element={<PageTransition><SosPage /></PageTransition>} />
          {/* Old routes → new IA (2026-11-03) */}
          <Route path="/checklist" element={<Navigate to="/today" replace />} />
          <Route path="/present" element={<Navigate to="/practice" replace />} />
          <Route path="/tools" element={<Navigate to="/practice" replace />} />
          <Route path="/analytics" element={<Navigate to="/progress" replace />} />
          <Route path="/story" element={<Navigate to="/reflect" replace />} />
          <Route path="/story/:sub" element={<Navigate to="/reflect" replace />} />
          <Route path="*" element={<Navigate to="/today" replace />} />
        </Routes>
      
    </AppShell>
  );
}

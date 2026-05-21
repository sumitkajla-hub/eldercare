import Link from 'next/link';
import { Stethoscope, Heart, Activity, ShieldCheck, Clock, MapPin, Star, DollarSign } from 'lucide-react';

const services = [
  { name: 'Nursing Care', icon: '🩺', category: 'nursing', description: 'Professional nursing services at home including medication management, vital monitoring, wound care, and health assessments.', included: ['Vital signs monitoring', 'Medication administration', 'Wound care & dressing', 'Health assessment reports', 'Doctor coordination', 'Emergency response'], hourly: 800, daily: 5000, monthly: 120000 },
  { name: 'Elderly Attendant', icon: '💝', category: 'attendant', description: 'Trained attendants providing daily care, personal hygiene assistance, mobility support, companionship, and meal preparation.', included: ['Personal hygiene assistance', 'Mobility & walking support', 'Meal preparation', 'Companionship', 'Light housekeeping', 'Errand assistance'], hourly: 400, daily: 2500, monthly: 60000 },
  { name: 'Physiotherapy', icon: '🏃', category: 'physiotherapy', description: 'In-home physiotherapy sessions for joint mobility, pain management, post-surgery rehabilitation, and strength training.', included: ['Joint mobilization', 'Strength training', 'Balance exercises', 'Pain management', 'Post-surgery rehab', 'Home exercise programs'], hourly: 1000, daily: 6000, monthly: 150000 },
  { name: 'Post-Hospital Care', icon: '🏥', category: 'post-hospital', description: 'Comprehensive recovery care after hospitalization including wound care, medication management, and health monitoring.', included: ['Wound care management', 'Medication schedule', 'Vital monitoring', 'Recovery tracking', 'Diet management', 'Doctor follow-up coordination'], hourly: 600, daily: 4000, monthly: 100000 },
];

const faqs = [
  { q: 'How are caregivers verified?', a: 'All caregivers undergo thorough background checks, credential verification, and training assessments before being onboarded to our platform.' },
  { q: 'Can I change my caregiver?', a: 'Yes, you can request a change of caregiver at any time. We will assign a new verified professional based on your requirements.' },
  { q: 'What if I need emergency care?', a: 'Our platform focuses on scheduled care. For emergencies, please contact local emergency services. We can arrange urgent caregiver visits within 4-6 hours.' },
  { q: 'Are services available 24/7?', a: 'Yes, we offer round-the-clock care services. Night shift and 24-hour attendant services are available at adjusted rates.' },
];

export default function ServicesPage() {
  return (
    <div>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Our Care Services</h1>
          <p style={styles.heroSubtitle}>Comprehensive healthcare solutions tailored for elderly comfort and well-being</p>
        </div>
      </section>

      <section style={styles.servicesSection}>
        <div style={styles.container}>
          {services.map((service, idx) => (
            <div key={idx} style={styles.serviceCard}>
              <div style={styles.serviceHeader}>
                <span style={styles.serviceIcon}>{service.icon}</span>
                <h2 style={styles.serviceName}>{service.name}</h2>
                <p style={styles.serviceDesc}>{service.description}</p>
              </div>
              <div style={styles.serviceBody}>
                <h3 style={styles.includedTitle}>What&apos;s Included</h3>
                <ul style={styles.includedList}>
                  {service.included.map((item, i) => (
                    <li key={i} style={styles.includedItem}>✓ {item}</li>
                  ))}
                </ul>
                <div style={styles.pricing}>
                  <h3 style={styles.pricingTitle}>Pricing</h3>
                  <div style={styles.priceGrid}>
                    <div style={styles.priceCard}><span style={styles.priceLabel}>Hourly</span><span style={styles.priceValue}>₹{service.hourly}</span></div>
                    <div style={styles.priceCard}><span style={styles.priceLabel}>Daily</span><span style={styles.priceValue}>₹{service.daily.toLocaleString()}</span></div>
                    <div style={styles.priceCard}><span style={styles.priceLabel}>Monthly</span><span style={styles.priceValue}>₹{service.monthly.toLocaleString()}</span></div>
                  </div>
                </div>
                <Link href="/register" style={styles.bookBtn}>Book This Service</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.faqSection}>
        <div style={{ ...styles.container, maxWidth: '800px' }}>
          <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div style={styles.faqList}>
            {faqs.map((faq, idx) => (
              <div key={idx} style={styles.faqItem}>
                <h3 style={styles.faqQ}>{faq.q}</h3>
                <p style={styles.faqA}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: { background: 'linear-gradient(135deg, #0D9488, #0F766E)', padding: '6rem 2rem 4rem', textAlign: 'center', color: '#fff' },
  heroContent: { maxWidth: '700px', margin: '0 auto' },
  heroTitle: { fontFamily: "'Outfit', sans-serif", fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' },
  heroSubtitle: { fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6 },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' },
  servicesSection: { padding: '4rem 0' },
  serviceCard: { background: '#fff', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '2.5rem', overflow: 'hidden', border: '1px solid #E7E5E4' },
  serviceHeader: { padding: '2.5rem', background: 'linear-gradient(135deg, #f0fdfa, #fff)', borderBottom: '1px solid #E7E5E4' },
  serviceIcon: { fontSize: '3rem', display: 'block', marginBottom: '1rem' },
  serviceName: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: '#1C1917', marginBottom: '0.75rem' },
  serviceDesc: { color: '#78716C', fontSize: '1.05rem', lineHeight: 1.7 },
  serviceBody: { padding: '2.5rem' },
  includedTitle: { fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 600, color: '#1C1917', marginBottom: '1rem' },
  includedList: { listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem', marginBottom: '2rem' },
  includedItem: { color: '#0D9488', fontSize: '0.95rem', padding: '0.25rem 0' },
  pricing: { marginBottom: '2rem' },
  pricingTitle: { fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 600, color: '#1C1917', marginBottom: '1rem' },
  priceGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' },
  priceCard: { background: '#F5F5F4', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  priceLabel: { fontSize: '0.85rem', color: '#78716C', fontWeight: 500 },
  priceValue: { fontSize: '1.4rem', fontWeight: 700, color: '#0D9488', fontFamily: "'Outfit', sans-serif" },
  bookBtn: { display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' },
  faqSection: { padding: '4rem 0', background: '#F5F5F4' },
  sectionTitle: { fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 700, color: '#1C1917', textAlign: 'center', marginBottom: '2.5rem' },
  faqList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  faqItem: { background: '#fff', borderRadius: '16px', padding: '1.5rem 2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  faqQ: { fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 600, color: '#1C1917', marginBottom: '0.5rem' },
  faqA: { color: '#78716C', lineHeight: 1.7 },
};

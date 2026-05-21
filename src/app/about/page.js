import { ShieldCheck, Heart, Users, Award, Target, Eye, Sparkles } from 'lucide-react';

const values = [
  { icon: '🛡️', title: 'Trust & Safety', desc: 'Every caregiver is thoroughly vetted with background checks and credential verification.' },
  { icon: '💖', title: 'Compassion First', desc: 'We believe in treating every elderly individual with dignity, respect, and genuine care.' },
  { icon: '🎯', title: 'Quality Assurance', desc: 'Continuous monitoring and feedback systems ensure the highest standards of care.' },
  { icon: '🤝', title: 'Accessibility', desc: 'Making quality elderly care affordable and accessible to families across India.' },
];

const team = [
  { name: 'Dr. Kavita Rao', role: 'Chief Medical Officer', desc: '20+ years in geriatric medicine' },
  { name: 'Arjun Mehta', role: 'CEO & Co-Founder', desc: 'Healthcare technology entrepreneur' },
  { name: 'Sneha Patel', role: 'Head of Operations', desc: 'Former hospital administrator' },
  { name: 'Dr. Vikram Singh', role: 'Medical Advisor', desc: 'Specialist in elderly care' },
];

export default function AboutPage() {
  return (
    <div>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>About ElderCare</h1>
          <p style={styles.heroSubtitle}>Empowering families with trusted, professional elderly care services since 2020</p>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.missionGrid}>
            <div style={styles.missionCard}>
              <Target size={40} color="#0D9488" />
              <h3 style={styles.missionTitle}>Our Mission</h3>
              <p style={styles.missionText}>To make quality elderly healthcare accessible, reliable, and compassionate for every family in India through technology and verified professionals.</p>
            </div>
            <div style={styles.missionCard}>
              <Eye size={40} color="#4F46E5" />
              <h3 style={styles.missionTitle}>Our Vision</h3>
              <p style={styles.missionText}>To become India&apos;s most trusted platform for elderly care, ensuring every senior citizen receives the dignity and care they deserve at home.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ ...styles.section, background: '#F5F5F4' }}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Our Values</h2>
          <div style={styles.valuesGrid}>
            {values.map((v, i) => (
              <div key={i} style={styles.valueCard}>
                <span style={{ fontSize: '2.5rem' }}>{v.icon}</span>
                <h3 style={styles.valueTitle}>{v.title}</h3>
                <p style={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Our Leadership Team</h2>
          <div style={styles.teamGrid}>
            {team.map((member, i) => (
              <div key={i} style={styles.teamCard}>
                <div style={{ ...styles.avatar, background: ['#0D9488', '#4F46E5', '#F59E0B', '#EF4444'][i] }}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 style={styles.teamName}>{member.name}</h3>
                <p style={styles.teamRole}>{member.role}</p>
                <p style={styles.teamDesc}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...styles.section, background: '#F5F5F4' }}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>How We Verify Caregivers</h2>
          <div style={styles.verifySteps}>
            {['Application & Document Submission', 'Background Check & Verification', 'Skill Assessment & Interview', 'Training & Onboarding', 'Ongoing Performance Monitoring'].map((step, i) => (
              <div key={i} style={styles.verifyStep}>
                <div style={styles.stepNumber}>{i + 1}</div>
                <p style={styles.stepText}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.container}>
          <div style={styles.statsGrid}>
            {[{ n: '10,000+', l: 'Families Served' }, { n: '500+', l: 'Verified Caregivers' }, { n: '50+', l: 'Cities Covered' }, { n: '4.9', l: 'Average Rating' }].map((s, i) => (
              <div key={i} style={styles.statItem}>
                <span style={styles.statNumber}>{s.n}</span>
                <span style={styles.statLabel}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: { background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', padding: '6rem 2rem 4rem', textAlign: 'center', color: '#fff' },
  heroContent: { maxWidth: '700px', margin: '0 auto' },
  heroTitle: { fontFamily: "'Outfit', sans-serif", fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' },
  heroSubtitle: { fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6 },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' },
  section: { padding: '5rem 0' },
  sectionTitle: { fontFamily: "'Outfit', sans-serif", fontSize: '2.2rem', fontWeight: 700, color: '#1C1917', textAlign: 'center', marginBottom: '3rem' },
  missionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' },
  missionCard: { background: '#fff', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textAlign: 'center' },
  missionTitle: { fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 600, color: '#1C1917', margin: '1rem 0 0.75rem' },
  missionText: { color: '#78716C', lineHeight: 1.7, fontSize: '1.05rem' },
  valuesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' },
  valueCard: { background: '#fff', borderRadius: '16px', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  valueTitle: { fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', fontWeight: 600, color: '#1C1917', margin: '1rem 0 0.5rem' },
  valueDesc: { color: '#78716C', lineHeight: 1.6, fontSize: '0.95rem' },
  teamGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' },
  teamCard: { background: '#fff', borderRadius: '16px', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 700, margin: '0 auto 1rem', fontFamily: "'Outfit', sans-serif" },
  teamName: { fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 600, color: '#1C1917', margin: '0 0 0.25rem' },
  teamRole: { color: '#0D9488', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' },
  teamDesc: { color: '#78716C', fontSize: '0.9rem' },
  verifySteps: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px', margin: '0 auto' },
  verifyStep: { display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#fff', borderRadius: '12px', padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  stepNumber: { width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0D9488, #14B8A6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 },
  stepText: { fontSize: '1.05rem', fontWeight: 500, color: '#1C1917' },
  statsSection: { padding: '4rem 0', background: 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#fff' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' },
  statItem: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  statNumber: { fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 700 },
  statLabel: { fontSize: '1rem', opacity: 0.9 },
};

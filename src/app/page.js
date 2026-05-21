import Link from 'next/link';
import { 
  Heart, 
  Stethoscope, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Award, 
  ArrowRight, 
  Phone, 
  Users, 
  CheckCircle2, 
  MapPin, 
  Star 
} from 'lucide-react';

export default function Home() {
  const services = [
    {
      name: 'Nursing Care',
      icon: Stethoscope,
      description: 'Professional medical care including vital monitoring, wound care, and medication management by registered nurses.',
      price: '₹800/hour',
      color: '#0D9488',
      link: '/services#nursing',
    },
    {
      name: 'Elderly Attendant',
      icon: Heart,
      description: 'Trained attendants assisting with daily living, personal hygiene, mobility support, and warm companionship.',
      price: '₹400/hour',
      color: '#4F46E5',
      link: '/services#attendant',
    },
    {
      name: 'Physiotherapy',
      icon: Activity,
      description: 'Personalized in-home physiotherapy sessions for post-surgery rehab, joint mobility, and strength restoration.',
      price: '₹1,000/hour',
      color: '#F59E0B',
      link: '/services#physiotherapy',
    },
    {
      name: 'Post-Hospital Care',
      icon: ShieldCheck,
      description: 'Comprehensive transition support from hospital to home, ensuring quick recovery with round-the-clock monitoring.',
      price: '₹600/hour',
      color: '#10B981',
      link: '/services#post-hospital',
    },
  ];

  const features = [
    {
      title: '100% Verified Professionals',
      description: 'Every caregiver undergoes mandatory multi-level background checks, verification of medical credentials, and hands-on skill evaluation.',
      icon: ShieldCheck,
    },
    {
      title: 'Personalized Care Matching',
      description: 'We carefully match caregivers to your loved one based on clinical needs, personality compatibility, and spoken languages.',
      icon: Award,
    },
    {
      title: 'Real-time Vitals & Logs',
      description: 'Stay updated on daily medication intake, dietary logs, and physiological vitals through our seamless digital family portal.',
      icon: Activity,
    },
    {
      title: '24/7 Care Coordination',
      description: 'A dedicated Care Manager is assigned to your family to coordinate schedules, handle transitions, and assist in emergencies.',
      icon: Clock,
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Share Your Care Requirements',
      description: 'Fill out a brief assessment detailing your loved one\'s medical history, daily needs, and preferred care hours.',
    },
    {
      number: '02',
      title: 'Meet Handpicked Caregivers',
      description: 'Review custom caregiver profiles that match your clinical criteria. Schedule introductory calls or in-person meetups.',
    },
    {
      number: '03',
      title: 'Customize Your Care Plan',
      description: 'Define specific shift patterns, dietary instructions, medication times, and specialized exercise routines with our care manager.',
    },
    {
      number: '04',
      title: 'Begin Care with Peace of Mind',
      description: 'Start services with continuous monitoring. Track caregiver attendance, daily clinical notes, and vital trends from anywhere.',
    },
  ];

  const testimonials = [
    {
      quote: "The nursing care provided for my mother after her cardiac surgery was exceptional. The nurse's expertise in medical monitoring and wound dressing was a true lifesaver.",
      name: "Rajesh Kumar",
      relation: "Son of Shanti Devi (78 yrs)",
      city: "Mumbai",
      rating: 5,
    },
    {
      quote: "Suresh, the attendant assigned to my father, has become like a family member. His patience, warmth, and constant mobility assistance have given us absolute peace of mind.",
      name: "Priya Sharma",
      relation: "Daughter of Ram Prasad (82 yrs)",
      city: "Delhi",
      rating: 5,
    },
    {
      quote: "After my hip replacement, the home physiotherapist from ElderCare helped me regain absolute balance and movement. The structured daily program was fantastic.",
      name: "Harish Iyer",
      relation: "Self (71 yrs)",
      city: "Bangalore",
      rating: 5,
    },
  ];

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroGrid}>
          <div style={styles.heroLeft}>
            <div style={styles.badgeLine}>
              <span style={styles.badgeText}><Heart size={14} fill="currentColor" /> Trusted In-Home Healthcare</span>
            </div>
            <h1 style={styles.heroTitle}>
              Compassionate Care For Your <span style={styles.highlightText}>Elders</span>, Right At Home
            </h1>
            <p style={styles.heroSubtitle}>
              Connect with 100% verified, professional nurses, attendants, and therapists tailored for your family's clinical and personal needs.
            </p>
            <div style={styles.ctaGroup}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Find a Caregiver <ArrowRight size={18} />
              </Link>
              <Link href="/services" className="btn btn-outline btn-lg" style={styles.secondaryBtn}>
                Explore Services
              </Link>
            </div>
            <div style={styles.heroFeatures}>
              <span style={styles.heroFeatureItem}><CheckCircle2 size={16} color="var(--color-primary)" /> Background Verified</span>
              <span style={styles.heroFeatureItem}><CheckCircle2 size={16} color="var(--color-primary)" /> 24/7 Dedicated Support</span>
              <span style={styles.heroFeatureItem}><CheckCircle2 size={16} color="var(--color-primary)" /> No Long-term Contracts</span>
            </div>
          </div>

          <div style={styles.heroRight}>
            {/* Visual Decorative Widget representing Medical Care and Dashboard */}
            <div style={styles.widgetContainer}>
              <div style={styles.widgetHeader}>
                <div style={styles.pulseDot} />
                <span style={styles.widgetTitle}>Live Care Portal</span>
              </div>
              <div style={styles.widgetCard}>
                <div style={styles.patientRow}>
                  <div style={styles.patientAvatar}>SD</div>
                  <div>
                    <h4 style={styles.patientName}>Shanti Devi</h4>
                    <p style={styles.patientSub}>Age: 78 • Active Care Plan</p>
                  </div>
                  <span style={styles.activeStatusBadge}>Active</span>
                </div>
                
                <div style={styles.metricsGrid}>
                  <div style={styles.metricCard}>
                    <span style={styles.metricLabel}>SpO2 Vital</span>
                    <span style={styles.metricValue}>98%</span>
                    <span style={styles.metricSub}>Normal • 10m ago</span>
                  </div>
                  <div style={styles.metricCard}>
                    <span style={styles.metricLabel}>Heart Rate</span>
                    <span style={styles.metricValue}>74 bpm</span>
                    <span style={styles.metricSub}>Stable • 10m ago</span>
                  </div>
                </div>

                <div style={styles.logList}>
                  <div style={styles.logItem}>
                    <div style={styles.logBullet} />
                    <div>
                      <p style={styles.logText}><strong>10:00 AM:</strong> Blood Sugar (Fasting) recorded at 124 mg/dL</p>
                    </div>
                  </div>
                  <div style={styles.logItem}>
                    <div style={styles.logBullet} />
                    <div>
                      <p style={styles.logText}><strong>09:30 AM:</strong> Morning medication & insulin administered</p>
                    </div>
                  </div>
                  <div style={styles.logItem}>
                    <div style={styles.logBullet} />
                    <div>
                      <p style={styles.logText}><strong>08:30 AM:</strong> Nutritious diabetic breakfast completed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlapping small rating badge */}
              <div style={styles.ratingBadge}>
                <div style={styles.starRow}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <p style={styles.ratingText}>4.9/5 • 10K+ Families</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.statsContainer}>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>10,000+</span>
              <span style={styles.statLabel}>Happy Families Assisted</span>
            </div>
            <div style={styles.divider} />
            <div style={styles.statItem}>
              <span style={styles.statNumber}>500+</span>
              <span style={styles.statLabel}>Verified Caregivers</span>
            </div>
            <div style={styles.divider} />
            <div style={styles.statItem}>
              <span style={styles.statNumber}>15+</span>
              <span style={styles.statLabel}>Major Cities Covered</span>
            </div>
            <div style={styles.divider} />
            <div style={styles.statItem}>
              <span style={styles.statNumber}>99.4%</span>
              <span style={styles.statLabel}>Care Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={styles.servicesSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 className="section-title text-center">Our Specialized Healthcare Services</h2>
            <p className="section-subtitle text-center" style={{ margin: '0 auto 3rem' }}>
              We provide professional, clinical, and daily living assistance specifically tailored for elder well-being and recovery.
            </p>
          </div>

          <div className="grid-2" style={styles.servicesGrid}>
            {services.map((service, index) => {
              const IconComp = service.icon;
              return (
                <div key={index} style={styles.serviceCard} className="card">
                  <div style={{ ...styles.serviceIconWrap, backgroundColor: `${service.color}15`, color: service.color }}>
                    <IconComp size={32} />
                  </div>
                  <div style={styles.serviceContent}>
                    <h3 style={styles.serviceName}>{service.name}</h3>
                    <p style={styles.serviceDesc}>{service.description}</p>
                    <div style={styles.serviceFooter}>
                      <span style={styles.servicePrice}>Starting at <strong>{service.price}</strong></span>
                      <Link href={service.link} style={{ ...styles.serviceLink, color: service.color }}>
                        Explore service <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section style={styles.whySection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 className="section-title text-center">Why ElderCare Stands Apart</h2>
            <p className="section-subtitle text-center" style={{ margin: '0 auto 3.5rem' }}>
              We treat your family like our own. Our clinical protocols and human-centric matching set new standards in senior homecare.
            </p>
          </div>

          <div className="grid-2" style={styles.featuresGrid}>
            {features.map((feature, idx) => {
              const FeatIcon = feature.icon;
              return (
                <div key={idx} style={styles.featureItem}>
                  <div style={styles.featureIconBox}>
                    <FeatIcon size={24} color="var(--color-primary)" />
                  </div>
                  <div>
                    <h3 style={styles.featureTitle}>{feature.title}</h3>
                    <p style={styles.featureDesc}>{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={styles.stepsSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 className="section-title text-center">Your Simple Journey To Trusted Care</h2>
            <p className="section-subtitle text-center" style={{ margin: '0 auto 4rem' }}>
              We have streamlined our matching process to get you the right healthcare professional quickly and stress-free.
            </p>
          </div>

          <div style={styles.stepsTimeline}>
            {steps.map((step, idx) => (
              <div key={idx} style={styles.stepCard}>
                <div style={styles.stepNumberBadge}>{step.number}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={styles.testimonialsSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 className="section-title text-center">Loved by Families Across the Nation</h2>
            <p className="section-subtitle text-center" style={{ margin: '0 auto 3rem' }}>
              Hear the warm, first-hand stories from families who found professional support and peace of mind through us.
            </p>
          </div>

          <div className="grid-3" style={styles.testimonialsGrid}>
            {testimonials.map((test, idx) => (
              <div key={idx} style={styles.testCard} className="card">
                <div style={styles.testStars}>
                  {[...Array(test.rating)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <p style={styles.testQuote}>&ldquo;{test.quote}&rdquo;</p>
                <div style={styles.testDivider} />
                <div style={styles.testUser}>
                  <div style={styles.testAvatar}>
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={styles.testName}>{test.name}</h4>
                    <p style={styles.testRelation}>{test.relation}</p>
                    <p style={styles.testCity}><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} /> {test.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContainer}>
          <div style={styles.ctaCard}>
            <h2 style={styles.ctaTitle}>Ready to Secure Professional Care for Your Elders?</h2>
            <p style={styles.ctaDesc}>
              Join over 10,000+ happy families. Schedule a free home clinical consultation and let us find the perfect care match today.
            </p>
            <div style={styles.ctaBtnGroup}>
              <Link href="/register" className="btn btn-secondary btn-lg" style={styles.ctaPrimaryBtn}>
                Get Started Now <ArrowRight size={18} />
              </Link>
              <Link href="tel:+919999999999" className="btn btn-outline btn-lg" style={styles.ctaSecondaryBtn}>
                <Phone size={18} /> Speak to a Care Manager
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: 'var(--color-bg)',
    overflowX: 'hidden',
  },
  // Hero Styles
  hero: {
    background: 'radial-gradient(circle at 100% 0%, rgba(13, 148, 136, 0.08) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(79, 70, 229, 0.05) 0%, transparent 40%)',
    padding: '7rem 1.5rem 5rem',
    borderBottom: '1px solid var(--color-border-light)',
  },
  heroGrid: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '4rem',
    alignItems: 'center',
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  badgeLine: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(13, 148, 136, 0.08)',
    color: 'var(--color-primary-dark)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  badgeText: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 800,
    color: 'var(--color-text)',
    lineHeight: 1.15,
    marginBottom: '1.5rem',
    letterSpacing: '-0.02em',
  },
  highlightText: {
    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    lineHeight: 1.65,
    color: 'var(--color-text-secondary)',
    marginBottom: '2.5rem',
    maxWidth: 600,
  },
  ctaGroup: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '2.5rem',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text)',
  },
  heroFeatures: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  heroFeatureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
  },
  heroRight: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  // Widget Styles
  widgetContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-xl)',
    padding: '1.5rem',
    position: 'relative',
    zIndex: 2,
    backgroundImage: 'radial-gradient(rgba(13, 148, 136, 0.03) 1px, transparent 0)',
    backgroundSize: '24px 24px',
  },
  widgetHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.25rem',
    borderBottom: '1px solid var(--color-border-light)',
    paddingBottom: '0.75rem',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'var(--color-success)',
    boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.3)',
    animation: 'pulse 2s infinite',
  },
  widgetTitle: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--color-text-secondary)',
  },
  widgetCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  patientRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  patientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    color: 'var(--color-primary-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1rem',
  },
  patientName: {
    fontSize: '1.0625rem',
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  patientSub: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)',
  },
  activeStatusBadge: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: '#16A34A',
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--radius-sm)',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem',
  },
  metricCard: {
    backgroundColor: 'var(--color-bg-secondary)',
    borderRadius: 'var(--radius-md)',
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '0.25rem',
  },
  metricValue: {
    fontSize: '1.25rem',
    fontWeight: 750,
    color: 'var(--color-text)',
    fontFamily: 'var(--font-heading)',
  },
  metricSub: {
    fontSize: '0.6875rem',
    color: 'var(--color-text-light)',
    marginTop: '0.125rem',
  },
  logList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
  },
  logItem: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'flex-start',
  },
  logBullet: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    marginTop: '0.45rem',
    flexShrink: 0,
  },
  logText: {
    fontSize: '0.75rem',
    lineHeight: 1.4,
    color: 'var(--color-text-secondary)',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -15,
    right: -20,
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '0.75rem 1rem',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  starRow: {
    display: 'flex',
    gap: '2px',
  },
  ratingText: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  // Stats Section Styles
  statsSection: {
    padding: '0 1.5rem',
    marginTop: '-2rem',
    position: 'relative',
    zIndex: 10,
  },
  statsContainer: {
    maxWidth: 1200,
    margin: '0 auto',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-lg)',
    padding: '2rem 1.5rem',
  },
  statsGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '2rem',
  },
  statItem: {
    flex: 1,
    minWidth: 200,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 800,
    fontFamily: 'var(--font-heading)',
    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '0.9375rem',
    color: 'var(--color-text-secondary)',
    fontWeight: 500,
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: 'var(--color-border)',
  },
  // Services Section Styles
  sectionHeader: {
    marginBottom: '3rem',
  },
  servicesGrid: {
    gap: '2rem',
  },
  serviceCard: {
    display: 'flex',
    gap: '1.5rem',
    padding: '2.25rem',
    alignItems: 'flex-start',
    backgroundColor: 'var(--color-white)',
    transition: 'all 300ms ease',
  },
  serviceIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  serviceContent: {
    flex: 1,
  },
  serviceName: {
    fontSize: '1.375rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: 'var(--color-text)',
  },
  serviceDesc: {
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)',
    marginBottom: '1.5rem',
  },
  serviceFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    borderTop: '1px solid var(--color-border-light)',
    paddingTop: '1rem',
  },
  servicePrice: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
  },
  serviceLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  // Why Choose Us Styles
  whySection: {
    padding: '6rem 1.5rem',
    backgroundColor: 'var(--color-bg-secondary)',
    borderTop: '1px solid var(--color-border-light)',
    borderBottom: '1px solid var(--color-border-light)',
  },
  featuresGrid: {
    gap: '3rem 2.5rem',
  },
  featureItem: {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'flex-start',
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(13, 148, 136, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureTitle: {
    fontSize: '1.1875rem',
    fontWeight: 600,
    color: 'var(--color-text)',
    marginBottom: '0.5rem',
  },
  featureDesc: {
    fontSize: '0.9375rem',
    lineHeight: 1.65,
    color: 'var(--color-text-secondary)',
  },
  // How it works Styles
  stepsSection: {
    padding: '6rem 1.5rem',
  },
  stepsTimeline: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2rem',
    position: 'relative',
  },
  stepCard: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem 1.5rem',
    boxShadow: 'var(--shadow-sm)',
    position: 'relative',
    transition: 'all 250ms ease',
  },
  stepNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.875rem',
    marginBottom: '1.25rem',
    boxShadow: '0 4px 10px rgba(13, 148, 136, 0.25)',
  },
  stepTitle: {
    fontSize: '1.0625rem',
    fontWeight: 650,
    color: 'var(--color-text)',
    marginBottom: '0.75rem',
    lineHeight: 1.35,
  },
  stepDesc: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)',
  },
  // Testimonials Styles
  testimonialsSection: {
    padding: '6rem 1.5rem',
    backgroundColor: 'var(--color-bg-secondary)',
    borderTop: '1px solid var(--color-border-light)',
    borderBottom: '1px solid var(--color-border-light)',
  },
  testimonialsGrid: {
    gap: '2rem',
  },
  testCard: {
    padding: '2rem',
    backgroundColor: 'var(--color-white)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
  },
  testStars: {
    display: 'flex',
    gap: '3px',
  },
  testQuote: {
    fontSize: '0.9375rem',
    lineHeight: 1.65,
    color: 'var(--color-text)',
    fontStyle: 'italic',
    flex: 1,
  },
  testDivider: {
    height: 1,
    backgroundColor: 'var(--color-border-light)',
  },
  testUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  testAvatar: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1rem',
    boxShadow: '0 2px 4px rgba(13, 148, 136, 0.15)',
  },
  testName: {
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  testRelation: {
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
  },
  testCity: {
    fontSize: '0.75rem',
    color: 'var(--color-text-light)',
    marginTop: '2px',
  },
  // Call to Action Styles
  ctaSection: {
    padding: '6rem 1.5rem 8rem',
    backgroundImage: 'radial-gradient(rgba(13, 148, 136, 0.05) 1.5px, transparent 0)',
    backgroundSize: '32px 32px',
  },
  ctaContainer: {
    maxWidth: 1000,
    margin: '0 auto',
  },
  ctaCard: {
    background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
    borderRadius: 'var(--radius-xl)',
    padding: '4rem 3rem',
    textAlign: 'center',
    boxShadow: 'var(--shadow-xl)',
    color: 'var(--color-white)',
    position: 'relative',
    overflow: 'hidden',
  },
  ctaTitle: {
    color: 'var(--color-white)',
    fontSize: '2.5rem',
    fontWeight: 800,
    marginBottom: '1.25rem',
    lineHeight: 1.2,
    maxWidth: 750,
    margin: '0 auto 1.25rem',
  },
  ctaDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '1.125rem',
    lineHeight: 1.6,
    marginBottom: '2.5rem',
    maxWidth: 650,
    margin: '0 auto 2.5rem',
  },
  ctaBtnGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaPrimaryBtn: {
    color: 'var(--color-primary-dark) !important',
    background: 'var(--color-white) !important',
    borderColor: 'var(--color-white) !important',
    fontWeight: 600,
  },
  ctaSecondaryBtn: {
    color: 'var(--color-white) !important',
    borderColor: 'rgba(255, 255, 255, 0.4) !important',
    background: 'transparent !important',
  },
};

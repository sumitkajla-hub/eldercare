// LoadingSpinner - Animated loading indicator with optional text
export default function LoadingSpinner({ text = 'Loading...', size = 40 }) {
  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.spinner,
          width: size,
          height: size,
          borderWidth: Math.max(3, size / 10),
        }}
      />
      {text && <p style={styles.text}>{text}</p>}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    gap: '1rem',
  },
  spinner: {
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    borderTopColor: 'var(--color-primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  text: {
    fontSize: '1rem',
    color: 'var(--color-text-secondary)',
    fontFamily: 'var(--font-body)',
  },
};

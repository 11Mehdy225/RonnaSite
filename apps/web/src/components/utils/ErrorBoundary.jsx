import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { crashed: false };

  static getDerivedStateFromError() { return { crashed: true }; }

  componentDidCatch(error) {
    console.error("Application error:", error);
  }

  render() {
    if (!this.state.crashed) return this.props.children;
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1>Un problème est survenu</h1>
          <p>La page n’a pas pu s’afficher correctement. Rechargez-la ou revenez à l’accueil.</p>
          <button type="button" onClick={() => window.location.assign("/")} style={styles.button}>Retour à l’accueil</button>
        </div>
      </main>
    );
  }
}

const styles = { page: { minHeight: "100vh", display: "grid", placeItems: "center", padding: 18, background: "#030A1A" }, card: { width: "min(560px,100%)", padding: 24, borderRadius: 22, border: "1px solid rgba(255,255,255,.12)", color: "white" }, button: { padding: "12px 16px", border: 0, borderRadius: 999, background: "#1F4FD8", color: "white", fontWeight: 800 } };

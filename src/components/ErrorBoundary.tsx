import { Component, type ReactNode } from 'react';

export default class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ padding: 32, fontFamily: 'var(--font)' }}>
        <h1 style={{ fontSize: 20 }}>Something went wrong on this screen</h1>
        <pre style={{ whiteSpace: 'pre-wrap', color: '#B42318', fontSize: 13 }}>{String(this.state.error?.stack || this.state.error)}</pre>
        <button className="btn" onClick={() => { this.setState({ error: null }); window.location.assign('/dashboard'); }}>Back to home</button>
      </div>
    );
  }
}

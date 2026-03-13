import { useState } from 'react';
import { useRouter } from './hooks/useRouter';
import { Stock, SimulationState } from './types';
import { createSimulation } from './engine/simulation';
import { Home } from './pages/Home';
import { DatePicker } from './pages/DatePicker';
import { AmountInput } from './pages/AmountInput';
import { Timeline } from './pages/Timeline';
import { ResultCard } from './pages/ResultCard';

function App() {
  const { page, navigate, goHome } = useRouter();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [simulation, setSimulation] = useState<SimulationState | null>(null);

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
    navigate('datePicker');
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    navigate('amountInput');
  };

  const handleStartSimulation = (amount: number) => {
    if (!selectedStock) return;
    const sim = createSimulation(selectedStock, selectedDate, amount);
    setSimulation(sim);
    navigate('timeline');
  };

  const handleFinishTimeline = (updatedSim: SimulationState) => {
    setSimulation(updatedSim);
    navigate('result');
  };

  const handleRestart = () => {
    setSelectedStock(null);
    setSelectedDate('');
    setSimulation(null);
    goHome();
  };

  return (
    <div style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {page === 'home' && <Home onSelectStock={handleSelectStock} />}
      {page === 'datePicker' && selectedStock && (
        <DatePicker stock={selectedStock} onSelectDate={handleSelectDate} onBack={goHome} />
      )}
      {page === 'amountInput' && selectedStock && (
        <AmountInput
          stock={selectedStock}
          date={selectedDate}
          onStart={handleStartSimulation}
          onBack={() => navigate('datePicker')}
        />
      )}
      {page === 'timeline' && simulation && (
        <Timeline simulation={simulation} onFinish={handleFinishTimeline} />
      )}
      {page === 'result' && simulation && (
        <ResultCard simulation={simulation} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;

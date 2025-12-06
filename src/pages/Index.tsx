import { IPodPlayer } from '@/components/iPod/iPodPlayer';

const Index = () => {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200">
      {/* Subtle pattern overlay */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
      
      <div className="relative">
        <IPodPlayer />
        
        {/* Reflection effect */}
        <div 
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[500px] h-16 rounded-full opacity-10 blur-xl"
          style={{
            background: 'linear-gradient(to bottom, hsl(220 10% 50%), transparent)',
          }}
        />
      </div>
    </main>
  );
};

export default Index;

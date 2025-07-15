export default function EquipmentLoading() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
        <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center pb-6 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-200 rounded-md animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
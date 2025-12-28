import { AlertCircle } from "lucide-react"

export default function EmergencyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      
      {/* Spacer to prevent overlap */}
      <div className="h-4 bg-transparent" />

      {/* Emergency bar */}
      <div className="bg-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
            
            <AlertCircle className="w-4 h-4 shrink-0" />

            <span>Emergency Helplines:</span>

            <span className="mx-2 hidden sm:inline">•</span>
            <span>
              <strong>108</strong> Ambulance
            </span>

            <span className="mx-2 hidden sm:inline">•</span>
            <span>
              <strong>104</strong> Health Helpline
            </span>

            <span className="mx-2 hidden sm:inline">•</span>
            <span>
              <strong>102</strong> Medical Emergency
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
